FROM node:16.14-alpine3.14 AS build
WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn install
COPY . .
RUN yarn build 

FROM node:16.14-alpine3.14
WORKDIR /usr/src/app

COPY package.json yarn.lock ./
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
CMD ["yarn", "serve"]
