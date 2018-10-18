FROM node:10-alpine

WORKDIR /siggers.dog

COPY . /siggers.dog
RUN npm i
RUN npm run build

EXPOSE 8080

CMD [ "npm", "run", "start" ]
