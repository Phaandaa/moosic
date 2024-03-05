#!/bin/bash

sudo apt update
sudo apt install default-jdk
java -version

# Install Git
sudo apt-get install -y git

# Clone your repository (Replace with your repository URL)
git clone https://github.com/Phaandaa/moosic.git

# Change directory to your repo (replace 'your_repo' with your actual repo name)
cd moosic/server

# Install Maven (if your project is a Maven project and needs it)
sudo apt-get install -y maven

# Build your project (if needed)
mvn package

mvn spring-boot:run
