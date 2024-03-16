
#One time script

sudo apt update
sudo apt install -y unzip zip git maven

curl -s "https://get.sdkman.io" | bash
source "/root/.sdkman/bin/sdkman-init.sh"
sdk install java 21.0.2-amzn


#Repeat script below

#!/bin/bash

export HOME="/home/phandavina"

source "$HOME/.sdkman/bin/sdkman-init.sh"
export JAVA_HOME="$HOME/.sdkman/candidates/java/current"
export PATH="$JAVA_HOME/bin:$PATH"
echo "JAVA_HOME is set to $JAVA_HOME"
echo "PATH is set to $PATH"

sudo -u phandavina git config --global --add safe.directory "$HOME/moosic"

project_dir="$HOME/moosic"

if [ ! -d "$project_dir" ]; then
    sudo -u phandavina git clone https://github.com/Phaandaa/moosic.git "$project_dir"
fi

sudo -u phandavina git -C "$project_dir" pull origin main

sudo -u phandavina gsutil cp gs://cloud-setup/server/.env "$project_dir/server/"
sudo -u phandavina gsutil cp gs://cloud-setup/server/serviceAccountKey.json "$project_dir/server/src/main/resources/"

cd "$project_dir/server"
nohup sh -c 'JAVA_HOME="/home/phandavina/.sdkman/candidates/java/current" mvn spring-boot:run' &
