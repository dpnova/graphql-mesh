FROM node:22.4.0-slim

# Set a non-root user to run the container
RUN useradd --create-home --shell /bin/bash mesh
USER mesh

WORKDIR /app

COPY package.json ./

RUN npm i --only=production

EXPOSE 4000

ENTRYPOINT ["./node_modules/.bin/mesh-serve"]
