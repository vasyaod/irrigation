FROM docker.io/arm64v8/node:latest

COPY . /app

WORKDIR /app

#CMD [ "node", "index.js" ]
ENTRYPOINT [ "/app/entrypoint.sh" ]
