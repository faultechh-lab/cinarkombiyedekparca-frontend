FROM node:24-bookworm-slim AS build

WORKDIR /app
COPY package.json package-lock.json .npmrc ./
RUN npm ci
COPY . ./
ARG SITE_ORIGIN=https://www.cinarkombiyedekparca.com
ENV SITE_ORIGIN=${SITE_ORIGIN}
RUN npm run build && npm run test:sites

FROM node:24-bookworm-slim
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /app/package.json ./
COPY --from=build /app/src ./src
COPY --from=build /app/scripts ./scripts
COPY --from=build /app/dist/client ./dist/client
USER node
EXPOSE 4173
CMD ["node", "scripts/preview.mjs", "--host", "0.0.0.0", "--port", "4173"]
