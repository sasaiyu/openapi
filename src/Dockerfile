FROM node:22

WORKDIR /app

COPY index.js .
RUN npm install gaze path swagger-merger express

CMD ["node", "index.js"]
