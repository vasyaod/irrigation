FROM docker.io/library/node:latest

COPY . /app

WORKDIR /app

#CMD [ "node", "index.js" ]
ENTRYPOINT [ "/app/entrypoint.sh" ]
