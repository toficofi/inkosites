FROM node:18
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
RUN npm install

COPY . .

ENV PORT=8080
ENV HOST=0.0.0.0
EXPOSE 8080
CMD ["npx", "ts-node", "express.ts"]