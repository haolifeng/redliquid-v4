const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HeartBeatSchema = new Schema({
    type:{
        type:String,
    },
    timestamp:{
        type:Number,
    },
})

export default HeartBeatSchema;