# Bản chạy trên VPS của catalogue Thiện Hiền (hướng dẫn: docs/DEPLOY.md). Build từ thư mục gốc repo.
FROM node:24-slim AS deps
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/catalogue/package.json apps/catalogue/
COPY packages/shared/package.json packages/shared/
# --ignore-scripts: bỏ "prepare" (lefthook cần git), các gói dùng binary dựng sẵn nên không cần script
RUN pnpm install --frozen-lockfile --ignore-scripts

FROM deps AS build
COPY . .
# NEXT_PUBLIC_SITE_URL được ghi cứng vào bản build (canonical, sitemap, JSON-LD)
ARG NEXT_PUBLIC_SITE_URL=http://localhost
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL CATALOGUE_SERVER=1 NEXT_TELEMETRY_DISABLED=1
RUN pnpm --filter catalogue build

FROM node:24-slim AS run
WORKDIR /app
ENV NODE_ENV=production CATALOGUE_SERVER=1 NEXT_TELEMETRY_DISABLED=1 \
    HOSTNAME=0.0.0.0 PORT=3000 UPLOAD_DIR=/data/uploads
COPY --from=build --chown=node:node /app/apps/catalogue/.next/standalone ./
COPY --from=build --chown=node:node /app/apps/catalogue/.next/static ./apps/catalogue/.next/static
COPY --from=build --chown=node:node /app/apps/catalogue/public ./apps/catalogue/public
# Thư mục ảnh tải lên: volume gắn vào đây thừa hưởng quyền của user node
RUN mkdir -p /data/uploads && chown -R node:node /data
USER node
EXPOSE 3000
CMD ["node", "apps/catalogue/server.js"]
