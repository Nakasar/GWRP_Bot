FROM node:10.7.0

WORKDIR /usr/src/bot

# Copy and Install our bot
COPY package.json /usr/src/bot
RUN npm install

COPY . /usr/src/bot

CMD ["node", "./src/index.js"]