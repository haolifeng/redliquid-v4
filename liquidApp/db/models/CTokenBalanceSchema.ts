const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CTokenBalanceSchema = new Schema ({
    tokenName:{
        type:String,

    },
    tokenAddr:{
        type:String,
        lowercase: true
    },
    userAddr:{
        type:String,
        lowercase:true,
    },
    balance:{
        type:String,
    },
});

export default CTokenBalanceSchema;