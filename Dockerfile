FROM node:20.11.1-alpine3.18

COPY . .
RUN npm ci
# RUN npm install -g forever

CMD ["node", "src/index.js"]