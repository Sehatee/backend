FROM node:20.15.1
WORKDIR /app
COPY  package.json .
RUN npm install --force
COPY . .
EXPOSE 4000
CMD ["npm", "run", "start:dev"]
