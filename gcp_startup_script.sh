
#One time script

sudo apt update
sudo apt install -y unzip zip git maven

curl -s "https://get.sdkman.io" | bash
source "/root/.sdkman/bin/sdkman-init.sh"
sdk install java 21.0.2-amzn


#Repeat script below

#! /bin/bash

source "/home/phandavina/.sdkman/bin/sdkman-init.sh"
export JAVA_HOME="/home/phandavina/.sdkman/candidates/java/current"
export PATH="$JAVA_HOME/bin:$PATH"
echo "JAVA_HOME is set to $JAVA_HOME"
echo "PATH is set to $PATH"

cd /home/phandavina
git clone https://github.com/Phaandaa/moosic.git moosic

gsutil cp gs://cloud-setup/server/.env /home/phandavina/moosic/server/
gsutil cp gs://cloud-setup/server/serviceAccountKey.json /home/phandavina/moosic/server/src/main/resources/

cd /home/phandavina/moosic
git pull
cd server
nohup mvn spring-boot:run &
