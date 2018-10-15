FROM node:10-alpine

WORKDIR /siggers.dog

COPY . /siggers.dog
RUN npm i

EXPOSE 8080
CMD [ "npm", "run", "buildStart" ]
