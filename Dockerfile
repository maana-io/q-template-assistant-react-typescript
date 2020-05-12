# base image
FROM node:12.2.0-alpine

# set working directory
WORKDIR /usr/app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /usr/app/node_modules/.bin:$PATH

# copy package*.json files
COPY package* /usr/app/

# run npm install first to improve docker layer caching
# - dependencies are unlikely to change so we install them first before copying src, public, etc.
RUN npm install --silent

COPY public /usr/app/public
COPY src /usr/app/src

RUN npm run build

# copy run configuration after build so we can change run/docker configuration without having to rebuild the application
COPY entrypoint.sh /usr/app/

ENV PORT=80

EXPOSE 80

CMD [ "sh", "-c", "/usr/app/entrypoint.sh" ]
