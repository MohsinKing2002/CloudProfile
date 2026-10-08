resource "aws_eip" "cloudprofile" {
  domain = "vpc"

  tags = {
    Name = "cloudprofile-eip"
  }
}

resource "aws_eip_association" "cloudprofile" {
  instance_id   = aws_instance.cloudprofile.id
  allocation_id = aws_eip.cloudprofile.id
}