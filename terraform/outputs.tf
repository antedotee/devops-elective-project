output "s3_bucket_name" {
  description = "The name of the created S3 bucket"
  value       = aws_s3_bucket.app_bucket.bucket
}

output "s3_bucket_arn" {
  description = "The ARN of the created S3 bucket"
  value       = aws_s3_bucket.app_bucket.arn
}

output "s3_bucket_region" {
  description = "The region where the S3 bucket is deployed"
  value       = aws_s3_bucket.app_bucket.region
}

output "ecs_cluster_name" {
  description = "ECS cluster"
  value       = aws_ecs_cluster.main.name
}

output "ecs_service_name" {
  description = "ECS API service (backend)"
  value       = aws_ecs_service.api.name
}

output "ecs_web_service_name" {
  description = "ECS web service (frontend container)"
  value       = aws_ecs_service.web.name
}

output "ecs_task_execution_role_arn" {
  description = "ECS task execution role (both services)"
  value       = aws_iam_role.ecs_execution.arn
}

output "alb_dns_name" {
  description = "ALB DNS (HTTP)"
  value       = aws_lb.api.dns_name
}

output "app_public_url" {
  description = "Open in browser — SPA + /api routed by ALB"
  value       = "http://${aws_lb.api.dns_name}"
}

output "health_check_url" {
  description = "API health via ALB"
  value       = "http://${aws_lb.api.dns_name}/api/health"
}

output "ecr_repository_url" {
  description = "Backend ECR repository URL"
  value       = aws_ecr_repository.server.repository_url
}

output "ecr_client_repository_url" {
  description = "Frontend ECR repository URL"
  value       = aws_ecr_repository.client.repository_url
}
