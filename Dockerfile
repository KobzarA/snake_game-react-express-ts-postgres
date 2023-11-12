FROM node:lts-alpine
# FROM kobza95/nasa-project:latest


WORKDIR /app

COPY package*.json ./
RUN npm i pnpm -g

COPY client/package*.json client/
COPY client/ client/

COPY server/package*.json server/
COPY server/ server/

RUN pnpm install-all
RUN pnpm build-all 

# COPY client/dist/ server/public/


USER node

ENV VITE_REACT_APP_API_BASE=https://localhost:8001/api/scores
ENV PORT=8001
ENV PG_PORT=5432

#get or create https certs
CMD [ "pnpm", "start" ]


EXPOSE 8001
