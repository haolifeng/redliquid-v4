const mongoose = require('mongoose');

import Storage from "./Storage";
import config from '../config';
const dbConfig = config.storage;
let dbOption = {

    useNewUrlParser: true,

    connectTimeoutMS: 30000,
    socketTimeoutMS: 360000
};

let dburl = dbConfig.dbUrl;
let db = mongoose.createConnection(dburl, dbOption);

db.on('conneted', function(err){

});

let storage = new Storage(db);

export default storage;