# Build stage
FROM node:18-alpine AS builder
WORKDIR /app

COPY package*.json ./

COPY src/cloud/intakan-company.json ./src/cloud/intakan-company.json


RUN npm install
COPY . .


RUN npm run build

# Run stage
FROM node:18-alpine
WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY .env .

COPY --from=builder /app/src/cloud/intakan-company.json ./src/cloud/intakan-company.json



EXPOSE 8080
CMD ["node", "dist/main"]
