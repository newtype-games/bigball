FROM node:16.13.0-alpine AS nodeModuleBuilder

WORKDIR /app

COPY ./package.json ./

COPY ./package-lock.json ./

RUN npm install --only=production

FROM node:16.13.0-alpine  AS runtime

WORKDIR /app

COPY ./ ./

COPY --from=nodeModuleBuilder /app/node_modules ./node_modules

EXPOSE 3000 5000

CMD [ "npm", "run", "server" ]