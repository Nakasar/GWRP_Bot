FROM node:10.7.0

WORKDIR /usr/src/bot

# Copy and Install our bot
COPY package.json /usr/src/bot
RUN npm install

RUN echo deb http://ftp.uk.debian.org/debian jessie-backports main >> /etc/apt/sources.list
RUN apt-get update
RUN apt-get install ffmpeg -y

COPY . /usr/src/bot

CMD ["node", "./src/index.js"]