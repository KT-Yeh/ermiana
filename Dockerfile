FROM node:24.12.0-alpine

WORKDIR /app

COPY package*.json ./

# Install production dependencies; fallback to npm install if lockfile missing
RUN npm ci --omit=dev || npm install --omit=dev

COPY . .

ENV NODE_ENV=production

# Default command can be overridden by docker-compose to run api or bot
CMD ["npm", "run", "start"]
