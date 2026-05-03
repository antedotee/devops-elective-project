# ECS Fargate: SPA (nginx) + API (Node) behind one ALB. Default → web :80; path /api* → API :5001.
# No CloudFront (fewer IAM calls for AWS Academy).

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

# Often already created by earlier CI pushes; managing it here caused RepositoryAlreadyExistsException.
data "aws_ecr_repository" "server" {
  name = "shopsmart-server"
}

resource "aws_ecr_repository" "client" {
  name                 = "shopsmart-client"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = false
  }
}

resource "aws_iam_role" "ecs_execution" {
  count = var.ecs_execution_role_arn == "" ? 1 : 0
  name  = "shopsmart-ecs-execution"

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
  count      = var.ecs_execution_role_arn == "" ? 1 : 0
  role       = aws_iam_role.ecs_execution[0].name
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
    description     = "API port"
    from_port       = 5001
    to_port         = 5001
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  ingress {
    description     = "Web port"
    from_port       = 80
    to_port         = 80
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

resource "aws_lb_target_group" "web" {
  name        = "shopsmart-web-tg"
  port        = 80
  protocol    = "HTTP"
  vpc_id      = data.aws_vpc.default.id
  target_type = "ip"

  health_check {
    enabled             = true
    path                = "/"
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
    target_group_arn = aws_lb_target_group.web.arn
  }
}

resource "aws_lb_listener_rule" "api_paths" {
  listener_arn = aws_lb_listener.http.arn
  priority     = 10

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.api.arn
  }

  condition {
    path_pattern {
      values = ["/api*"]
    }
  }
}

resource "aws_ecs_cluster" "main" {
  name = "shopsmart"
}

locals {
  bootstrap_node_script = "require('http').createServer((req,res)=>{const ok=req.url==='/api/health'||req.url.startsWith('/api/health?');res.writeHead(ok?200:404,{'Content-Type':'application/json'});res.end(ok?JSON.stringify({status:'ok'}):'');}).listen(5001,'0.0.0.0');"

  # Academy: pass ecs_execution_role_arn. Full AWS: leave empty and Terraform creates shopsmart-ecs-execution.
  ecs_execution_role_arn = length(aws_iam_role.ecs_execution) > 0 ? aws_iam_role.ecs_execution[0].arn : var.ecs_execution_role_arn
}

resource "aws_ecs_task_definition" "bootstrap_api" {
  family                   = "shopsmart-server"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = local.ecs_execution_role_arn

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

resource "aws_ecs_task_definition" "bootstrap_web" {
  family                   = "shopsmart-client"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = local.ecs_execution_role_arn

  container_definitions = jsonencode([
    {
      name      = "shopsmart-client"
      image     = "public.ecr.aws/nginx/nginx:stable-alpine"
      essential = true
      portMappings = [
        {
          containerPort = 80
          protocol      = "tcp"
        }
      ]
    }
  ])
}

resource "aws_ecs_service" "api" {
  name            = "shopsmart-api"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.bootstrap_api.arn
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

  depends_on = [aws_lb_listener_rule.api_paths]
}

resource "aws_ecs_service" "web" {
  name            = "shopsmart-web"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.bootstrap_web.arn
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
    target_group_arn = aws_lb_target_group.web.arn
    container_name   = "shopsmart-client"
    container_port   = 80
  }

  depends_on = [aws_lb_listener.http]
}
