# --- Стадия 1: сборка ---
# Тут собираем React/Vite проект в статику (папку dist).
# Node нужен только на этой стадии, в финальный образ он не попадёт.
FROM node:20-alpine AS build

WORKDIR /app

# Сначала копируем только package*.json, чтобы Docker закешировал
# npm install и не переустанавливал зависимости при каждом изменении кода
COPY package.json package-lock.json ./
RUN npm ci

# Теперь копируем весь код и собираем
COPY . .
RUN npm run build

# --- Стадия 2: отдача через nginx ---
# Берём чистый лёгкий nginx и кладём в него только готовую статику
FROM nginx:1.27-alpine AS production

# Свой конфиг nginx (нужен, чтобы React Router работал при прямых переходах по ссылкам)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Готовая статика из стадии сборки
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
