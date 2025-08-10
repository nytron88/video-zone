# build stage

FROM node:22-alpine AS builder

WORKDIR /app

# Accept build-time arg for Vite
ARG VITE_SERVER_BASE_URL
ENV VITE_SERVER_BASE_URL=$VITE_SERVER_BASE_URL

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

# serve stage

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]