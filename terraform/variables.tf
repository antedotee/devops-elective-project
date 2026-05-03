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

variable "project_name" {
  description = "Prefix for ECS cluster, service, task family, and ECR repository names"
  type        = string
  default     = "shopsmart"
}

variable "image_tag" {
  description = "Tag for the single app image in ECR (CI sets github.sha)"
  type        = string
  default     = "latest"
}

variable "container_port" {
  description = "Port Express listens on inside the container"
  type        = number
  default     = 3000
}
