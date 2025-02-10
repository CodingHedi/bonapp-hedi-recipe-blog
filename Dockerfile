FROM node:22-alpine

RUN npm install -g pnpm

COPY . .

RUN pnpm install

RUN pnpm run build

CMD ["pnpm", "run", "start"]
