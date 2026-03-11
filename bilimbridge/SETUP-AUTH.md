# Пошаговая настройка регистрации и профилей

## Этап 1: Проект в Firebase

1. Зайди на [Firebase Console](https://console.firebase.google.com/).
2. Выбери свой проект (или создай новый: «Создать проект»).
3. Убедись, что проект выбран — дальше все шаги в нём.

---

## Этап 2: Включить способ входа «Email/пароль»

1. В левом меню открой **Build** → **Authentication** (Аутентификация).
2. Перейди на вкладку **Sign-in method** (Методы входа).
3. В списке найди **Email/Password** (Эл. почта/пароль).
4. Нажми на него, включи переключатель **Enable** (Включить) и нажми **Save** (Сохранить).
5. Оставь **Email link** (вход по ссылке) выключенным — не обязательно.

Готово: пользователи смогут регистрироваться по email и паролю.

---

## Этап 3: Включить Google-вход (если ещё не включён)

1. В том же разделе **Authentication** → **Sign-in method**.
2. Выбери **Google**.
3. Включи **Enable**, укажи **Project support email** (поддержка проекта) и нажми **Save**.

Так останется возможность входа через Google.

---

## Этап 4: Создать базу Firestore

1. В левом меню открой **Build** → **Firestore Database**.
2. Нажми **Create database** (Создать базу данных).
3. Выбери режим:
   - **Production mode** — потом настроишь правила (рекомендуется).
   - Или **Test mode** — только для быстрой проверки (через 30 дней доступ закроется, если не обновить правила).
4. Выбери регион (например, `europe-west1`) и нажми **Enable**.

База для профилей и прогресса создана.

---

## Этап 5: Настроить правила Firestore

1. В **Firestore Database** открой вкладку **Rules** (Правила).
2. Замени весь текст в редакторе на:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      match /progress/{doc} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

3. Нажми **Publish** (Опубликовать).

Так каждый пользователь будет видеть и менять только свои данные (`users/{его uid}` и прогресс внутри).

---

## Этап 6: Узнать ключи Firebase для приложения

1. В Firebase открой **Project settings** (иконка шестерёнки рядом с «Project Overview»).
2. Прокрути вниз до блока **Your apps**.
3. Если веб-приложения ещё нет — нажми **</>** (Web), введи имя приложения (например, `tasprep`), при необходимости отметь Firebase Hosting и нажми **Register app**.
4. Скопируй объект `firebaseConfig` (или по отдельности: `apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`).

Они понадобятся в следующем этапе.

---

## Этап 7: Создать файл .env.local в проекте

1. В папке **bilimbridge** (рядом с `package.json`) создай файл **.env.local**.
2. Добавь в него строки (подставь свои значения из Firebase):

```
NEXT_PUBLIC_FIREBASE_API_KEY=твой_apiKey
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=твой_проект.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=твой_projectId
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=твой_проект.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=числовой_senderId
NEXT_PUBLIC_FIREBASE_APP_ID=твой_appId
```

3. Сохрани файл.  
**Важно:** файл `.env.local` не должен попадать в git (в `.gitignore` он обычно уже есть).

---

## Этап 8: Запустить сайт и проверить

1. В папке **bilimbridge** в терминале выполни:
   - `npm install` (если ещё не ставил зависимости).
   - `npm run dev`.
2. В браузере открой указанный адрес (обычно `http://localhost:3000`).
3. Нажми **Войти** (или **Кіру**).
4. Проверь:
   - переключение **Вход** / **Регистрация**;
   - регистрацию по email и паролю (минимум 6 символов);
   - вход по тем же email и паролю;
   - вход через Google (если включал);
   - переход в **Профиль** и отображение имени/email;
   - прохождение пробного теста до конца и появление прогресса в профиле.

---

## Этап 9: Если что-то не работает

| Проблема | Что проверить |
|----------|----------------|
| «Firebase config is missing» | Есть ли `.env.local` в **bilimbridge**, все ли переменные `NEXT_PUBLIC_FIREBASE_*` заданы. После изменений перезапусти `npm run dev`. |
| Ошибка при регистрации по email | В Firebase: Authentication → Sign-in method → Email/Password включён. |
| Ошибка при входе через Google | Включён ли Google в Sign-in method, указан ли support email. |
| Ошибка при сохранении прогресса / в профиле | Создана ли база Firestore, опубликованы ли правила (Rules). |
| Правила в файле проекта | В репозитории есть `bilimbridge/firestore.rules`. Ими можно заменить правила в консоли или деплоить через `firebase deploy --only firestore:rules`. |

---

## Краткий чеклист

- [ ] Проект Firebase создан/выбран  
- [ ] Authentication → Email/Password включён  
- [ ] Authentication → Google включён (по желанию)  
- [ ] Firestore Database создана  
- [ ] Правила Firestore опубликованы (см. этап 5)  
- [ ] В bilimbridge создан `.env.local` с ключами Firebase  
- [ ] `npm run dev` запущен, регистрация и профиль проверены  

После этого регистрация, вход и просмотр своего прогресса в профиле должны работать.
