const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var outputSchema = new Schema({
    outputId:{
        type: mongoose.Schema.ObjectId,
    },
    folder:{
        type:String,
        default:'Algos'
    },
    status:{
        type:Number,
        default:0
    }
}, {timestamps:true});

var Output = mongoose.model('output',outputSchema);
module.exports = Output;