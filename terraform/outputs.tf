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
