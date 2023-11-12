FROM node:20.9 as builder

WORKDIR /app

COPY . /app/

RUN npm install

RUN npm run build

FROM node:20.9 as runner

WORKDIR /app

COPY --from=builder  /app/ .

EXPOSE 3000

CMD ["npm", "start"]