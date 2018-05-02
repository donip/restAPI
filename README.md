CMD
`express .`
`npm i`
npm i --save pug
app.js 14. sor: `app.set('view engine', 'pug');`
views mappában pug kiterjesztés beállítása
nodemon start (nodemon ./bin/www fog lefutni) > localhost:3000-en fut

views most nem fog kelleni, mert az Angular lesz a megjelenítő

routes/api.js

app.js-ben:
    app.use('/api', require('./routes/api'));

rootMappában `db` mappa létrehozása
    user.json >> [] üres tömb

package.json-ban nodemonConfig:
 ne figyelje az adatbázis mappát a nodemon - ne induljon feleslegesen újra
