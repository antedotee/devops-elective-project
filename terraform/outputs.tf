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

output "ecs_execution_role_arn" {
  description = "IAM role used as ECS task execution role"
  value       = data.aws_iam_role.ecs_execution.arn
}

output "ecs_cluster_name" {
  value = aws_ecs_cluster.main.name
}

output "ecs_service_name" {
  value = aws_ecs_service.main.name
}

output "ecr_repository_url" {
  value = aws_ecr_repository.app.repository_url
}

output "container_port" {
  value = var.container_port
}
