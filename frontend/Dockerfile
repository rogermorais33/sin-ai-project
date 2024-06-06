FROM node:18.19.0

RUN npm i npm@latest -g

WORKDIR /opt/app

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD [ "npm", "start" ]
