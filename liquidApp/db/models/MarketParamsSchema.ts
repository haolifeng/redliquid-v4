const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MarketParamsSchema = new Schema({
    name:{
        type:String, //closeFactor, liquidationIncentive ,maxAssets
    },
    value:{
        type:String,
    },
    decimal:{
        type:Number,
        default: 18
    }

})

export default MarketParamsSchema;