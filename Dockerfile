FROM node:12-alpine

# install simple http server for serving static content

# make the 'app' folder the current working directory
WORKDIR /usr/src/app2

COPY package*.json ./
# install project dependencies
RUN npm install
# RUN npm install vue-i18n
# RUN npm install i18n
# COPY . ./
# RUN npm run build

EXPOSE 8792

ENV HOST=0.0.0.0
ENV PORT=8792

CMD [ "npm", "run", "start" ]