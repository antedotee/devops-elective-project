# Minimal ECS + ALB + CloudFront (HTTPS). Requires a default VPC with ≥2 subnets in the region.

data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

locals {
  alb_subnet_ids = slice(sort(data.aws_subnets.default.ids), 0, 2)
}

resource "aws_ecr_repository" "server" {
  name                 = "shopsmart-server"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = false
  }
}

resource "aws_iam_role" "ecs_execution" {
  name = "shopsmart-ecs-execution"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "ecs-tasks.amazonaws.com" }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_execution" {
  role       = aws_iam_role.ecs_execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_security_group" "alb" {
  name        = "shopsmart-alb"
  description = "HTTP from internet"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "ecs_tasks" {
  name        = "shopsmart-ecs-tasks"
  description = "Tasks receive traffic from ALB only"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    description     = "App port from ALB"
    from_port       = 5001
    to_port         = 5001
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_lb" "api" {
  name               = "shopsmart-api"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = local.alb_subnet_ids
}

resource "aws_lb_target_group" "api" {
  name        = "shopsmart-api-tg"
  port        = 5001
  protocol    = "HTTP"
  vpc_id      = data.aws_vpc.default.id
  target_type = "ip"

  health_check {
    enabled             = true
    path                = "/api/health"
    matcher             = "200"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 3
  }
}

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.api.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.api.arn
  }
}

resource "aws_ecs_cluster" "main" {
  name = "shopsmart"
}

locals {
  bootstrap_node_script = "require('http').createServer((req,res)=>{const ok=req.url==='/api/health'||req.url.startsWith('/api/health?');res.writeHead(ok?200:404,{'Content-Type':'application/json'});res.end(ok?JSON.stringify({status:'ok'}):'');}).listen(5001,'0.0.0.0');"

  # Managed CloudFront policy IDs (commercial aws partition). Hardcoded so Terraform does not call
  # cloudfront:ListCachePolicies / ListOriginRequestPolicies — often denied in AWS Academy / Vocareum.
  # https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-managed-cache-policies.html
  # https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-managed-origin-request-policies.html
  cloudfront_managed_cache_policy_caching_disabled_id    = "4135ea2d-6df8-44a3-9df3-4b5a84be39ad"
  cloudfront_managed_origin_request_policy_all_viewer_id = "216adef6-5c7f-47e4-b989-5492eafa07d3"
}

resource "aws_ecs_task_definition" "bootstrap" {
  family                   = "shopsmart-server"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.ecs_execution.arn

  container_definitions = jsonencode([
    {
      name      = "shopsmart-server"
      image     = "public.ecr.aws/docker/library/node:20-alpine"
      essential = true
      command   = ["node", "-e", local.bootstrap_node_script]
      portMappings = [
        {
          containerPort = 5001
          protocol      = "tcp"
        }
      ]
    }
  ])
}

resource "aws_ecs_service" "api" {
  name            = "shopsmart-api"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.bootstrap.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  lifecycle {
    ignore_changes = [task_definition]
  }

  network_configuration {
    subnets          = local.alb_subnet_ids
    security_groups  = [aws_security_group.ecs_tasks.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.api.arn
    container_name   = "shopsmart-server"
    container_port   = 5001
  }

  depends_on = [aws_lb_listener.http]
}

resource "aws_cloudfront_distribution" "api" {
  enabled         = true
  is_ipv6_enabled = true
  price_class     = "PriceClass_100"

  origin {
    domain_name = aws_lb.api.dns_name
    origin_id   = "alb"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "http-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  default_cache_behavior {
    allowed_methods          = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods           = ["GET", "HEAD"]
    target_origin_id         = "alb"
    viewer_protocol_policy   = "redirect-to-https"
    compress                 = false
    cache_policy_id          = local.cloudfront_managed_cache_policy_caching_disabled_id
    origin_request_policy_id = local.cloudfront_managed_origin_request_policy_all_viewer_id
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  depends_on = [aws_lb_listener.http]
}
