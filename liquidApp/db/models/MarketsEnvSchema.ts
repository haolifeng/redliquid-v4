const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MarketsEnvSchema = new Schema({
    cTokenName:{
        type:String, //closeFactor, liquidationIncentive
    },
    cTokenAddr:{
        type:String,
        unique:true,
        lowercase:true
    },
    isListed:{
        type:Boolean,
    },
    collateralFactorMantissa:{
        type:String,
        
    },
    isComped:Boolean,
})

export default MarketsEnvSchema;