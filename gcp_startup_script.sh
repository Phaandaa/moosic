#! /bin/bash

apt update
apt install -y unzip zip git maven

curl -s "https://get.sdkman.io" | bash
source "/root/.sdkman/bin/sdkman-init.sh"
sdk install java 21.0.2-amzn

if id "moosicuser" &>/dev/null; then
    echo 'User moosicuser already exists.'
else
    useradd -m -s /bin/bash moosicuser
fi

git clone https://github.com/Phaandaa/moosic.git /opt/moosic

chown -R moosicuser:moosicuser /opt/moosic

gsutil cp gs://cloud-setup/server/.env /opt/moosic/server/
gsutil cp gs://cloud-setup/server/serviceAccountKey.json /opt/moosic/server/src/main/resources/
chown moosicuser:moosicuser /opt/moosic/server/.env
chown moosicuser:moosicuser /opt/moosic/server/src/main/resources/serviceAccountKey.json

sudo -u moosicuser sh -c 'cd /opt/moosic/server && mvn install'

sudo -u moosicuser sh -c 'cd /opt/moosic/server && nohup mvn spring-boot:run &'
