# --------------------------------------------------
# VPC
# Creates an isolated network for CloudProfile.
# This is the main network that contains our subnets
# and AWS resources.
# --------------------------------------------------
resource "aws_vpc" "cloudprofile" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "cloudprofile-vpc"
  }
}


# --------------------------------------------------
# Public Subnet
# Creates a smaller network inside the VPC where
# resources such as our EC2 instance can be placed.
# It is configured to allow public IP assignment.
# --------------------------------------------------
resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.cloudprofile.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = var.availability_Zone
  map_public_ip_on_launch = true

  tags = {
    Name = "cloudprofile-public-subnet"
  }
}


# --------------------------------------------------
# Internet Gateway
# Provides a path between the VPC and the public
# internet.
# --------------------------------------------------
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.cloudprofile.id

  tags = {
    Name = "cloudprofile-igw"
  }
}


# --------------------------------------------------
# Public Route Table
# Defines where traffic from the associated subnet
# should go.
#
# 0.0.0.0/0 means any internet destination.
# Traffic is sent through the Internet Gateway.
# --------------------------------------------------
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.cloudprofile.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = {
    Name = "cloudprofile-public-route-table"
  }
}


# --------------------------------------------------
# Route Table Association
# Connects the public subnet to the public route table.
# Without this association, the subnet would not use
# the internet route defined above.
# --------------------------------------------------
resource "aws_route_table_association" "public" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public.id
}