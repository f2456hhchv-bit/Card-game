# Build stage — installs all workspace deps and builds server + client
FROM node:20-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
COPY server/package.json server/
COPY client/package.json client/
RUN npm install
COPY . .
RUN npm run build

# Runtime stage — only what's needed to run the built server, which also
# serves the built client as static files behind the same URL.
FROM node:20-slim
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/server/dist ./server/dist
COPY --from=build /app/server/node_modules ./server/node_modules
COPY --from=build /app/server/package.json ./server/package.json
COPY --from=build /app/client/dist ./client/dist
EXPOSE 4000
CMD ["node", "server/dist/index.js"]
