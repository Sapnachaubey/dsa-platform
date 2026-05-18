FROM node:22-alpine AS build

WORKDIR /app/client

ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

COPY client/package*.json ./
RUN npm ci

COPY client/ ./
RUN npm run build

FROM nginx:alpine

COPY infra/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/client/dist /usr/share/nginx/html

EXPOSE 80
