FROM node:16.14-alpine3.14 AS deps
WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM node:16.14-alpine3.14 AS builder
WORKDIR /usr/src/app

COPY . . 
COPY package.json yarn.lock ./
COPY --from=deps /usr/src/app/node_modules ./node_modules
RUN yarn install --prefer-offline
RUN yarn build 

FROM node:16.14-alpine3.14 AS runtime
WORKDIR /usr/src/app

COPY package.json yarn.lock ./
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
CMD ["yarn", "serve"]
