const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CTokenUnderlyingPriceSchema = new Schema ({
    cTokenName:{
        type:String,

    },
    cTokenAddr:{
        type:String,
        unique:true,
        lowercase:true
    },
    price:{
        type:String,
    },
    decimal:{
        type:Number
    }
});

export default CTokenUnderlyingPriceSchema;