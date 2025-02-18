FROM node:16-bullseye
RUN mkdir -p /usr/src/yt-dlp-webui/download
VOLUME /usr/src/yt-dlp-webui/downloads
WORKDIR /usr/src/yt-dlp-webui
COPY package*.json ./
RUN apt-get update
RUN apt-get install curl ffmpeg -y
RUN npm install
COPY . .
RUN npm run build
RUN chmod +x ./lib/fetch-yt-dlp.sh
RUN ./lib/fetch-yt-dlp.sh && mv yt-dlp ./lib
RUN rm -rf .parcel-cache
EXPOSE 3022
CMD [ "node" , "./server.js" ]