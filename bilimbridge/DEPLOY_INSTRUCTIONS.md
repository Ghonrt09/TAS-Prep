# 📚 ПОЛНАЯ ИНСТРУКЦИЯ: Как купить домен и задеплоить сайт на Vercel

## 🎯 Что мы будем делать (простыми словами):

1. **Загрузим код на GitHub** (это как "облако" для кода)
2. **Купим домен** (это адрес сайта, например tasprep.com)
3. **Загрузим сайт на Vercel** (это бесплатный хостинг)
4. **Подключим домен к Vercel** (чтобы сайт работал по вашему адресу)

---

## 📝 ЧАСТЬ 1: Подготовка проекта для GitHub

### Шаг 1.1: Проверить, что у вас есть Git

Откройте терминал (PowerShell) и напишите:
```bash
git --version
```

Если увидите версию (например, `git version 2.43.0`) - отлично! ✅
Если ошибка - нужно установить Git: https://git-scm.com/download/win

### Шаг 1.2: Создать аккаунт на GitHub

1. Откройте сайт: https://github.com
2. Нажмите кнопку **"Sign up"** (Регистрация)
3. Заполните форму:
   - Email (ваша почта)
   - Пароль (придумайте надежный)
   - Имя пользователя (например: ваш-никнейм)
4. Подтвердите email (проверьте почту)

### Шаг 1.3: Создать новый репозиторий на GitHub

1. Войдите в GitHub
2. Нажмите зеленую кнопку **"New"** или **"+"** → **"New repository"**
3. Заполните:
   - **Repository name**: `tasprep` (или любое имя)
   - **Description**: "TAS Prep - платформа для подготовки к экзаменам"
   - Выберите **Public** (публичный)
   - НЕ ставьте галочки на "Add README" и другие
4. Нажмите **"Create repository"**

### Шаг 1.4: Загрузить код на GitHub

Откройте терминал в корне репозитория (папка, где лежит `bilimbridge` с `package.json` внутри). Например, если у вас структура `ai-tracking/bilimbridge/`, перейдите в `ai-tracking`:

```bash
# Перейти в корень репозитория (папка, в которой лежит папка bilimbridge)
cd C:\Users\Alpha\.cursor\ai-tracking

# Инициализировать Git (если еще не сделано)
git init

# Добавить все файлы
git add .

# Сделать первый коммит (сохранение)
git commit -m "Initial commit"

# Подключить к GitHub (ЗАМЕНИТЕ username и имя репозитория на ваши)
git remote add origin https://github.com/ВАШ-USERNAME/ИМЯ-РЕПОЗИТОРИЯ.git

# Загрузить код на GitHub
git branch -M main
git push -u origin main
```

**Важно:** Замените `ВАШ-USERNAME` на ваш реальный username из GitHub!

---

## 🌐 ЧАСТЬ 2: Покупка домена

### Шаг 2.1: Выбрать регистратора доменов

Рекомендую **Namecheap** (простой и недорогой):
- Сайт: https://www.namecheap.com

### Шаг 2.2: Зарегистрироваться на Namecheap

1. Откройте https://www.namecheap.com
2. Нажмите **"Sign Up"** (Регистрация)
3. Заполните форму и подтвердите email

### Шаг 2.3: Купить домен

1. В поиске доменов введите: `tasprep` (или другое имя)
2. Выберите домен (рекомендую `.com` или `.online` если `.com` занят)
3. Нажмите **"Add to Cart"** (Добавить в корзину)
4. Перейдите в корзину и нажмите **"Checkout"** (Оформить заказ)
5. Оплатите домен (обычно $10-15 за год)

**Важно:** Запомните или сохраните:
- Ваш домен (например: `tasprep.com`)
- Логин и пароль от Namecheap

---

## 🚀 ЧАСТЬ 3: Деплой на Vercel

### Шаг 3.1: Зарегистрироваться на Vercel

1. Откройте сайт: https://vercel.com
2. Нажмите **"Sign Up"** (Регистрация)
3. Выберите **"Continue with GitHub"** (Войти через GitHub)
4. Разрешите доступ Vercel к вашему GitHub аккаунту

### Шаг 3.2: Задеплоить проект

1. После входа нажмите **"Add New..."** → **"Project"**
2. Вы увидите список ваших GitHub репозиториев
3. Найдите нужный репозиторий (например `tasprep` или `ai-tracking`) и нажмите **"Import"**
4. **Важно:** если Next.js проект лежит в подпапке (например `bilimbridge`), в настройках импорта укажите **Root Directory**: `bilimbridge` (нажмите "Edit" рядом с Root Directory и введите `bilimbridge`)
5. **Переменные окружения (обязательно для входа и Firebase):** перед деплоем нажмите **"Environment Variables"** и добавьте по одной переменной (значения возьмите из вашего `.env.local`):
   - `NEXT_PUBLIC_FIREBASE_API_KEY` = ваш apiKey
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` = ваш authDomain (например `tasprep-835b2.firebaseapp.com`)
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID` = ваш projectId
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` = ваш storageBucket
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` = ваш messagingSenderId
   - `NEXT_PUBLIC_FIREBASE_APP_ID` = ваш appId  
   Для каждой переменной выберите окружения: Production, Preview, Development (можно все три).
6. Нажмите **"Deploy"** (Задеплоить)

**Подождите 2-3 минуты** - Vercel соберет и загрузит ваш сайт!

### Шаг 3.3: Проверить, что сайт работает

После деплоя вы увидите:
- ✅ "Congratulations! Your project has been deployed"
- Ссылку вида: `tasprep-xxxxx.vercel.app`

Нажмите на ссылку - ваш сайт должен открыться! 🎉

---

## 🔗 ЧАСТЬ 4: Подключение домена к Vercel

### Шаг 4.1: Добавить домен в Vercel

1. В проекте на Vercel откройте вкладку **"Settings"**
2. Слева выберите **"Domains"**
3. В поле введите ваш домен (например: `tasprep.com`)
4. Нажмите **"Add"**

### Шаг 4.2: Настроить DNS в Namecheap

Vercel покажет вам DNS записи, которые нужно добавить. Обычно это:

**Тип A:**
- Host: `@`
- Value: `76.76.21.21` (IP адрес Vercel)

**Тип CNAME:**
- Host: `www`
- Value: `cname.vercel-dns.com`

**Как добавить в Namecheap:**

1. Войдите в Namecheap
2. Откройте **"Domain List"** → найдите ваш домен → **"Manage"**
3. Перейдите на вкладку **"Advanced DNS"**
4. Добавьте записи:
   - Нажмите **"Add New Record"**
   - Выберите **Type: A Record**
   - Host: `@`
   - Value: `76.76.21.21`
   - TTL: `Automatic`
   - Сохраните (зеленая галочка)
   
   - Нажмите **"Add New Record"** еще раз
   - Выберите **Type: CNAME Record**
   - Host: `www`
   - Value: `cname.vercel-dns.com`
   - TTL: `Automatic`
   - Сохраните

### Шаг 4.3: Подождать активации

DNS изменения могут занять от **5 минут до 48 часов** (обычно 10-30 минут).

Проверить можно:
1. В Vercel в разделе "Domains" - там будет статус
2. Когда увидите ✅ зеленую галочку - готово!

### Шаг 4.4: Проверить сайт

Откройте в браузере ваш домен (например: `tasprep.com`) - сайт должен работать! 🎉

---

## ✅ ЧТО ДАЛЬШЕ?

### Как обновлять сайт:

1. Измените код в вашем проекте
2. Откройте терминал в папке `tasprep`
3. Выполните:
   ```bash
   git add .
   git commit -m "Обновил сайт"
   git push
   ```
4. Vercel автоматически обновит сайт за 1-2 минуты!

---

## 🆘 ЕСЛИ ЧТО-ТО НЕ РАБОТАЕТ

### Проблема: "Git не найден"
**Решение:** Установите Git: https://git-scm.com/download/win

### Проблема: "Не могу загрузить код на GitHub"
**Решение:** Проверьте, что вы заменили `ВАШ-USERNAME` на реальный username

### Проблема: "Домен не подключается"
**Решение:** 
- Подождите 30-60 минут (DNS нужно время)
- Проверьте, что DNS записи в Namecheap точно такие, как показал Vercel
- В Vercel может быть другая инструкция - следуйте ей!

### Проблема: "Сайт не собирается на Vercel"
**Решение:** Проверьте, что все зависимости в `package.json` правильные. Если проект в подпапке `bilimbridge`, укажите в Vercel Root Directory: `bilimbridge`.

### Проблема: На сайте "Firebase config is missing" или не работает вход
**Решение:** Добавьте в Vercel все переменные окружения (Settings → Environment Variables): `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`, `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`, `NEXT_PUBLIC_FIREBASE_APP_ID`. После сохранения сделайте **Redeploy** проекта.

---

## 📞 НУЖНА ПОМОЩЬ?

Если застряли на каком-то шаге - напишите мне, и я помогу! 😊
