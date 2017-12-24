# Пример сайта на MEVN

## Описание

Демонстрационный сайт, созданный с помощью стека из MongoDB, Express, Vue и NodeJS.

## Использование

### Вам понадобятся

Git: https://git-scm.com/download/

NodeJS и NPM: https://nodejs.org/en/download/

MongoDB: https://www.mongodb.com/download-center#community

### Установка

```
mkdir website
cd website
git clone https://github.com/Kinrany/website.git
npm install
mkdir ./data/db
```

### Запуск

```
<путь установки MongoDB>/bin/mongod --dbpath ./data/db --nojournal
node server.js
```

> Для удобства запуска MongoDB на Windows есть скрипт `mongodb_start.bat`.
> Перед использованием нужно добавить `<путь установки MongoDB>/bin/` в PATH (например, с помощью [PathEditor](https://patheditor2.codeplex.com/)), либо заменить в скрипте `mongod` на полный путь.

Сайт будет доступен по адресу [`localhost:8080`](http://localhost:8080/). Можно указать другие IP и порт, задав [переменные окружения](https://ru.wikipedia.org/wiki/%D0%9F%D0%B5%D1%80%D0%B5%D0%BC%D0%B5%D0%BD%D0%BD%D0%B0%D1%8F_%D1%81%D1%80%D0%B5%D0%B4%D1%8B) IP и PORT соответственно. Для этого удобно использовать [dotenv](https://www.npmjs.com/package/dotenv).

## Структура проекта

Составляющие проекта: 

 - клиент на [Vue](https://vuejs.org/v2/guide/index.html) и [jQuery](https://jquery.com/)
 - сервер на [Node](https://nodejs.org/en/about/) и [Express](https://expressjs.com/en/guide/routing.html)
 - база данных на [MongoDB](https://docs.mongodb.com/) с использованием NPM пакета [mongodb](https://www.npmjs.com/package/mongodb)

> На момент написания (01.12.2017) сайт состоит из двух страниц: заготовки для опроса (`/survey`) и книги посетителей (`/guestbook`). Страница опроса технологически проще, поэтому дальше речь пойдёт только о книге посетителей.

### Клиентская часть

Файлы клиента расположены в папках `/views/` (HTML-страницы) и `/public/` (библиотеки, скрипты и ресурсы).

Тело `guestbook.html` состоит из единственного [приложения Vue](https://vuejs.org/v2/guide/instance.html):

```html
<!-- guestbook.html -->
<body>
    <div id="guestbook">
        <!-- Содержимое приложения -->
    </div>
</body>
```

```javascript
// guestbook.js
let app = new Vue({
    el: '#guestbook',
    data: /* объект для хранения данных */,
    methods: {
        send_message: /* функция отправки сообщения */,
        load_submissions: /* функция загрузки сообщений */
    }
});
```

Главные элементы интерфейса -- кнопка обновления, список оставленных сообщений (с новыми сообщениями в начале) и поля для ввода и отправки нового сообщения.

Приложение хранит в `app.data` список оставленных сообщений `submissions`, а также введённые пользователем имя `message_author` и сообщение `message_text`.

При первой загрузке страницы, а также при отправке сообщения (методом `send_message()`) и автоматическом обновлении вызывается метод `load_submissions()`, загружающий актуальный список оставленных сообщений. Оба метода используют [jQuery](https://jquery.com/) и [AJAX](https://en.wikipedia.org/wiki/Ajax_%28programming%29) для обмена информацией с сервером.

### Серверная часть

Серверная логика содержится в `server.js`.

Сервер написан на JavaScript с использованием [Node](https://nodejs.org/en/about/) и использует [Express](https://expressjs.com/en/guide/routing.html) -- фреймворк, упрощающий обработку запросов. 

API сервера предоставляет три вида запросов:

1\. HTML-страницы из папки `/views/`

```javascript
app.get('/', static_html('views/index.html'));
app.get('/survey', static_html('views/survey.html'));
app.get('/guestbook', static_html('views/guestbook.html'));
```

2\. Публичные статические файлы из папки `/public/`

```javascript
app.use('/public', express.static('public'));
```

3\. Запросы гостевой книги

```javascript
app.get('/guestbook/submissions.json', function (request, response) { 
    /* Запрос к локальной базе данных */ 
});

app.post('/guestbook/submit', function (request, response) {
    /* Валидация и добавление сообщения в базу данных */
});
```

### База данных

Сервер общается с базой данных с помощью отдельного модуля `mongo_connection.js`,
который в свою очередь использует NPM пакет [mongodb](https://www.npmjs.com/package/mongodb).

Сообщения хранятся в коллекции `guestbook_submissions` в формате

```json
{
    "author": "kinrany",
    "text": "Hello world!"
}
```

Модуль экспортирует функции `guestbook_add_submission` и `guestbook_get_submissions`. 
Функции асинхронные и возвращают результат через параметр `callback(error, result)`. 
Реализуются они с помощью [`db.collection.find()`](https://docs.mongodb.com/manual/reference/method/db.collection.find/) 
и [`db.collection.insertOne(document)`](https://docs.mongodb.com/manual/reference/method/db.collection.insertOne/).

### Прочее

`data/db/` -- файлы базы данных.

`node_modules/`, `package.json`, `package-lock.json` -- файлы NPM

`mongodb_start.bat` -- скрипт для простого запуска MongoDB
