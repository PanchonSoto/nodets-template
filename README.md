# Getting Started

>**Note**: Install docker desktop [Docker Desktop](https://www.docker.com/products/docker-desktop/)

## Step 1: Environments

```
Clone the env.template on your own .env
```

## Step 2: Install dependencies

```bash

# install depenencies
npm install

```

## Step 3: DataBase

Before start you need to open **Docker Desktop**, if needed go to  **docker-compose.yml** to configure your services.
Then run the following command:

```bash
# deploy docker services
docker-compose up -d

```

## Step 4: Start the project in dev mode

```bash
npm run dev
```

## Run after apply any change on schema.prisma

```bash
npx prisma migrate dev --name init
```

