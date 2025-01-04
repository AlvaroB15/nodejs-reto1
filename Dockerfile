FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

ENV PORT_FASTIFY=3000
ENV PORT_EXPRESS=3001

EXPOSE 3000 3001

CMD ["npm", "start"]
