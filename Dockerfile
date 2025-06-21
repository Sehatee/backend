FROM node:20.15.1

WORKDIR /app

# نسخ ملفات الحزم فقط أولاً للاستفادة من الـ cache
COPY package.json package-lock.json ./

# تثبيت سريع ودقيق باستخدام npm ci
RUN npm ci

# الآن انسخ باقي الملفات
COPY . .

EXPOSE 4000

CMD ["npm", "run", "start:dev"]
