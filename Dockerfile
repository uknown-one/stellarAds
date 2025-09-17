Use Node.js LTS version

FROM node:18-slim


Create app directory

WORKDIR /usr/src/app


Install app dependencies

A wildcard is used to ensure both package.json AND package-lock.json are copied

COPY package*.json ./


Install dependencies

RUN npm ci --only=production


Bundle app source

COPY . .


Set environment variables

ENV NODE_ENV=production
ENV PORT=3000


Expose the port the app runs on

EXPOSE 3000


Start the application

CMD ["node", "server.js"]
