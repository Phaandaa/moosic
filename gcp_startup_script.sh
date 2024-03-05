#!/bin/bash
sudo apt install unzip -y
sudo apt install zip -y
curl -s "https://get.sdkman.io" | bash
source "$HOME/.sdkman/bin/sdkman-init.sh"
sdk install java 21.0.2-amzn
sudo apt install -y git
git clone https://github.com/Phaandaa/moosic.git
cd moosic/server
sudo apt install -y maven
# Remember to upload env and serviceAccountKey.json, and automate this process if possible
mvn spring-boot:run
