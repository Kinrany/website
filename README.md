# Проект сайта с использованием стека MEVN

## Демонстрация

https://website-kinrany.c9users.io/

(Может быть недоступна из-за ограничений хостинга. Свяжитесь со мной любым удобным способом.)

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
<MongoDB installation path>/bin/mongod --dbpath ./data/db --nojournal
node server.js
```

> Для удобства запуска MongoDB на Windows есть скрипт `mongodb_start.bat`.
> Перед использованием нужно добавить `<MongoDB installation path>/bin/` в PATH (например, с помощью [PathEditor](https://patheditor2.codeplex.com/)), либо заменить в скрипте `mongod` на полный путь.

Сайт будет доступен по адресу [`localhost:8080`](http://localhost:8080/). Можно указать другие IP и порт, задав [переменные окружения](https://ru.wikipedia.org/wiki/%D0%9F%D0%B5%D1%80%D0%B5%D0%BC%D0%B5%D0%BD%D0%BD%D0%B0%D1%8F_%D1%81%D1%80%D0%B5%D0%B4%D1%8B) IP и PORT соответственно. Для этого удобно использовать [dotenv](https://www.npmjs.com/package/dotenv).

## Структура проекта

Составляющие проекта: 

 - клиент на [Vue](https://vuejs.org/v2/guide/index.html) и [JQuery](http://jquery.com/)
 - сервер на [Node](https://nodejs.org/en/about/) и [Express](http://expressjs.com/en/guide/routing.html)
 - база данных на [MongoDb](https://docs.mongodb.com/) с использованием пакета [mongodb](https://www.npmjs.com/package/mongodb)

> На момент написания (01.12.2017) сайт состоит из двух страниц: заготовки для опроса (`/survey`) и книги посетителей (`/guestbook`). Страница опроса технологически проще, поэтому дальше речь пойдёт только о книге посетителей.

### Клиентская часть

Файлы клиента расположены в папках `/views/` (HTML-страницы) и `/public/` (библиотеки, скрипты и ресурсы).

Тело `guestbook.html` состоит из единственного [приложения Vue](https://vuejs.org/v2/guide/instance.html):

```html
<div id="guestbook">
    <!-- Содержимое приложения -->
</div>
```

```javascript
let app = new Vue({
    el: '#guestbook',
    data: /* data object */,
    methods: {
        /* list of methods */
    }
});
```

