# syntax=docker/dockerfile-upstream:1.4.3

FROM node:20-alpine

ARG VERSION=local
LABEL version=$VERSION

WORKDIR /app
COPY . .
RUN npm i -g pnpm
RUN pnpm install
RUN pnpm run build
RUN rm -rf src/ static/
#USER node:node

RUN echo "$VERSION" >> /version

ENV NODE_ENV=production
#ENV PORT=8080
ENV PORT=80

EXPOSE 80/tcp
HEALTHCHECK --start-period=350s CMD curl -skfLo /dev/null http://localhost/

USER mailu

CMD ["node","build/index.js"]
