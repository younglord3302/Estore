FROM node:18-alpine

WORKDIR /app

COPY server/package*.json ./

RUN npm install

COPY server/ .

RUN npx prisma generate

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]