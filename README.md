# Likecoin Faucet Discord Bot

A Discord.js based bot client that distributes test tokens for the cosmos chain based network.

## Sites

### Dev

- [Testing Server](https://discord.gg/c975mzVYQ8)
- [Bot Invite](https://discord.com/api/oauth2/authorize?client_id=946305914472919060&permissions=3072&scope=bot%20applications.commands)

## Development

### Prerequisites

- [Node.js 16.9.0+](https://nodejs.org/en/)
- [Yarn 1.22.4](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable)

### Starting the bot locally

Run the following command to setup the project

```
$ make setup
```

This creates a `.env` file under the project root directory

Add necessary credentials to the `.env` file

Run the following command to kick start the bot for development

```
$ yarn start
```

### Using Docker

Alternately, you can use `docker-compose` to run the bot using the following command

```
$ docker-compose up -d discord
```

## Deployment

### Setup Credentials

Run the following commands to setup gcloud credentials for docker

```
$ gcloud auth login

$ gcloud auth configure-docker

```

### Manual Deployment

Ensure you have credentials setup for pandawork as well as the gcr image registry

Run the following command to build and push a docker image

```
$ make docker-build

$ make docker-push
```

This builds and tags the docker image with the short hash of the latest commit and pushes to the registry

Run the deployment command

```
$ make -C deploy deploy ENV=dev
```
