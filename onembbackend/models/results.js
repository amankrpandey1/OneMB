const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ResultSchema = new Schema({
    resId:{
        type: mongoose.Schema.ObjectId,
    },
    restitle:{
        type: mongoose.Schema.ObjectId,
    },
    reslocation:{
        type:String,
        required: true,
    },
    status:{
        type:String,
        required:true,
        default:"200",
    }

},{timestamps:true}
);
var Results = mongoose.model("result",ResultSchema);
module.exports = Results;