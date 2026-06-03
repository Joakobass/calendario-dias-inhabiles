FROM node:20
WORKDIR /app
COPY package.json .
RUN npm config set strict-ssl false
RUN npm install -g pnpm && pnpm install
COPY . .
EXPOSE 8080
CMD ["npm", "start"]
