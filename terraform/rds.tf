resource "random_password" "db" {
  length  = 20
  special = false
}

resource "random_password" "jwt_secret" {
  length  = 48
  special = false
}

resource "aws_db_subnet_group" "main" {
  name_prefix = "ssdb-"
  subnet_ids  = [for az in local.availability_zones : local.subnets_per_az[az]]

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_security_group" "rds" {
  name_prefix = "ssrds-"
  description = "PostgreSQL from ECS tasks only"
  vpc_id      = data.aws_vpc.default.id

  lifecycle {
    create_before_destroy = true
  }

  ingress {
    description     = "Postgres from ECS"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.ecs_sg.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_db_instance" "postgres" {
  identifier                 = "${var.project_name}-pg"
  engine                     = "postgres"
  engine_version             = "16"
  instance_class             = "db.t3.micro"
  allocated_storage          = 20
  max_allocated_storage      = 50
  storage_type               = "gp3"
  username                   = "shopsmart"
  password                   = random_password.db.result
  db_name                    = "shopsmart"
  db_subnet_group_name       = aws_db_subnet_group.main.name
  vpc_security_group_ids     = [aws_security_group.rds.id]
  skip_final_snapshot        = true
  publicly_accessible        = false
  multi_az                   = false
  backup_retention_period    = 0
  deletion_protection        = false
  auto_minor_version_upgrade = true
}
