FROM node:20

WORKDIR /app

# Copy package.json and install deps
COPY package.json package-lock.json ./
RUN npm install

# Copy frontend code
COPY . .

# Build React app
RUN npm install && npm run build

# Use serve to run built app
RUN npm install -g serve

EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]
