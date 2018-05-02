// built-in
var express = require('express');
var router = express.Router();
const fs = require('fs');
const path = require ('path');

const dbPath = '../db';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('API is LIVE');
});

/**
 * get the DataBase file path from request url
 * eg. api/user >> ...db/user.json
 */
const getDBpath = (table) => {
    return path.join(__dirname, dbPath, `${table}.json`);
}

/**
 * Generate random ID.
 * development opportunity >> prevent equal ID  creation
 */
const genID = (length = 25) => {
    const chars = 'vqbwtr823r7rtv76TV87DVnrspl2abaQFADD6ST87svba7s6012T8BV76N87AIHQJAsm56j4w4';
    let id = "";
    for (let i = 0; i < length; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
};

/**
 * Get index or indexed data from jsonData by userId
 * @param {*} jsonData the data from which to get the index or user data
 * @param {String} userId the 25-character-long ID of the user
 * @param {String} dataType data to be returned: 'index' index only || 'data' parsed object of user
 */
const getDataByUserId = (jsonData, userId, dataType) => {
    jsonData = JSON.parse(jsonData);
    const index = jsonData.findIndex(object => object._id === userId);

    switch (dataType) {
        case 'index':
            return index;
        case 'data':
            return jsonData[index];
        default:
            return JSON.stringify(jsonData[index]);
    }
};

/**
 * GET all users.
 */
router.get('/:table', (req, res, next) => {
    fs.readFile(
        getDBpath(req.params.table),
        'utf8',
        (err, jsonData) => {
            if (err) {
                console.error(err);
               return res.sendStatus(404);
               // return res.json({error: 'Entity cannot be found'});
            }
            res.send(jsonData)
        });
});

/**
 * GET specific object from the .json file
 * @return returns the user data
 */
router.get('/:table/:id', (req, res, next) => {
    fs.readFile(
        getDBpath(req.params.table),
        'utf8',
        (err, jsonData) => {
            if (err) {
               return res.sendStatus(404);
               // return res.json({error: 'Entity cannot be found'});
            }
            const user = getDataByUserId(jsonData, req.params.id, 'data');
            res.send(user);
        });
});

/**
 * CREATE object in JSON array (POST)
 */
router.post('/:table', (req, res, next) => {
    const filePath = getDBpath(req.params.table);
    fs.readFile(
        filePath,
        'utf8',
        (err, jsonData) => {
            if (err) {
               return res.sendStatus(404);
               // return res.json({error: 'Entity cannot be found'});
            }

            jsonData = JSON.parse(jsonData);
            req.body._id = genID();         // add random ID
            jsonData.push(req.body);

            fs.writeFileSync(filePath, JSON.stringify(jsonData), 'utf8');
            res.json(req.body);
        });
});

/**
 * EDIT object in .JSON-based database (PUT)
 */
router.put('/:table/:id', (req, res, next) => {
    const filePath = getDBpath(req.params.table);
    fs.readFile(
        filePath,
        'utf8',
        (err, jsonData) => {
            if (err) {
               return res.sendStatus(404);
               // return res.json({error: 'Entity cannot be found'});
            }

            const index = getDataByUserId(jsonData, req.params.id, 'index');
            jsonData = JSON.parse(jsonData);
            jsonData[index] = req.body;
            jsonData[index]['_id'] = req.params.id;

            fs.writeFileSync(filePath, JSON.stringify(jsonData), 'utf8');
            res.json(jsonData[index]);
        });
});

/**
 * DELETE user from JSON-based database (DELETE)
 */
router.delete('/:table/:id', (req, res, next) => {
    const filePath = getDBpath(req.params.table);
    fs.readFile(
        filePath,
        'utf8',
        (err, jsonData) => {
            if (err) {
               return res.sendStatus(404);
               // return res.json({error: 'Entity cannot be found'});
            }

            const index = getDataByUserId(jsonData, req.params.id, 'index');
            jsonData = JSON.parse(jsonData);
            jsonData.splice(index, 1);

            fs.writeFileSync(filePath, JSON.stringify(jsonData), 'utf8');
            res.send({success: 'Deletion successful'});
        });
});


module.exports = router;
