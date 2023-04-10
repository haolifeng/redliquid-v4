const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CTokenExchangeRateSchema = new Schema ({
    cTokenName:{
        type:String,

    },
    cTokenAddr:{
        type:String,
        unique:true,
        lowercase:true
    },
    exchangeRate:{
        type:String,
    },
});

export default CTokenExchangeRateSchema;