FROM node:20-bullseye-slim AS builder
WORKDIR /app


COPY package.json package-lock.json* ./

# Install OS-level build dependencies required by node-gyp (python, make, g++)
# then install npm packages. Cleanup apt lists to keep the image small.

# Allow build-time injection of public values used by the client bundle.
# These must be available before `next build` so client code picks them up.
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID

ENV PYTHON=python3
RUN apt-get update \
	&& apt-get install -y --no-install-recommends \
	   python3 \
	   python3-dev \
	   python-is-python3 \
	   build-essential \
	   make \
	   g++ \
	&& rm -rf /var/lib/apt/lists/* \
	&& npm install --legacy-peer-deps

# Export build-time NEXT_PUBLIC_* args into ENV so `next build` can read them
ENV NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}
ENV NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=${NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID}

COPY . .
ENV NODE_ENV=production
RUN npm run build

RUN npm prune --production

FROM node:20-bullseye-slim AS runner
WORKDIR /app

ARG NEXT_PUBLIC_APP_URL
ARG MONGODB_URI
ARG MONGODB_DB
ARG NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["npm", "start"]

