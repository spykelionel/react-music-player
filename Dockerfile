FROM node:18-alpine

WORKDIR /app

# Install dependencies only when needed
COPY package.json package-lock.json* ./

RUN npm install --frozen-lockfile

# Copy the rest of the app
COPY . .

EXPOSE 5173

CMD [ "npm", "run", "dev" ]
