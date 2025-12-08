FROM node:20
WORKDIR /app
COPY package*.json ./
COPY .npmrc ./
RUN npm install
COPY . .
# Skipped build due to dependency issues
EXPOSE 4000
CMD ["npm", "run", "dev"]
