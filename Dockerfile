FROM node:14-alpine

WORKDIR /home/nestjs-project-api

CMD npm run start:docker:dev

# run the command below to create the container
# docker build -t run dockerization-nestjs-projec .