FROM node:24-alpine
EXPOSE 3002
WORKDIR /app
COPY . .
RUN npm install
ENTRYPOINT ["npm","run","dev"]