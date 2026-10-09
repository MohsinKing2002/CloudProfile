variable "aws_region" {
  description = "AWS Region for CloudProfile infrastructure"
  type        = string
  default     = "us-east-1"
}

variable "availability_Zone" {
  description = "Availability Zone for the public subnet"
  type        = string
  default     = "us-east-1a"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3a.medium"
}

variable "ssh_cidr" {
  description = "CIDR allowed to SSH into the EC2 instance"
  type        = string
}