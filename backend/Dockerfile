FROM node:22-alpine

# Install native build deps for canvas
RUN apk add --no-cache python3 make g++ cairo-dev pango-dev giflib-dev

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 8000

CMD ["npm", "run", "start"]