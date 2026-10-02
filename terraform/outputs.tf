output "ec2_public_ip" {
  description = "Public IP address of CloudProfile EC2 instance"
  value       = aws_instance.cloudprofile.public_ip
}

output "ec2_instance_id" {
  description = "EC2 instance ID"
  value       = aws_instance.cloudprofile.id
}
