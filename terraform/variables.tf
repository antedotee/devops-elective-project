variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "us-east-1"
}

variable "bucket_prefix" {
  description = "Prefix for the S3 bucket name"
  type        = string
  default     = "shopsmart-assets"
}

variable "ecs_execution_role_arn" {
  description = <<-EOT
    Existing IAM role ARN for ECS task execution (pull from ECR, etc.).
    Required when your lab denies iam:CreateRole (common on AWS Academy).
    Must trust ecs-tasks.amazonaws.com and attach AmazonECSTaskExecutionRolePolicy.
    Leave empty only if Terraform may create role shopsmart-ecs-execution (full-access accounts).
  EOT
  type        = string
  default     = ""
}
