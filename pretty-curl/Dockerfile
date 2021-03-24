FROM node
EXPOSE 8080
WORKDIR /app
COPY . /app/
RUN npm install -g
ENTRYPOINT ["npm", "start", "--"]