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
  description = "ECS cluster for the API"
  value       = aws_ecs_cluster.main.name
}

output "ecs_service_name" {
  description = "ECS service name (GitHub Actions updates this service)"
  value       = aws_ecs_service.api.name
}

output "ecs_task_execution_role_arn" {
  description = "Pass this into the ECS task definition executionRoleArn"
  value       = aws_iam_role.ecs_execution.arn
}

output "alb_dns_name" {
  description = "Direct ALB DNS (HTTP only)"
  value       = aws_lb.api.dns_name
}

output "api_https_base_url" {
  description = "Use as VITE_API_BASE_URL on GitHub Pages (HTTPS)"
  value       = "https://${aws_cloudfront_distribution.api.domain_name}"
}

output "health_check_url" {
  description = "HTTPS URL for /api/health via CloudFront"
  value       = "https://${aws_cloudfront_distribution.api.domain_name}/api/health"
}

output "ecr_repository_url" {
  description = "ECR repository URL for shopsmart-server"
  value       = aws_ecr_repository.server.repository_url
}
