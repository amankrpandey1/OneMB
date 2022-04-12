const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DataSchema = new Schema({
    dataId:{
        type: mongoose.Schema.ObjectId,
    },
    datatitle:{
        type:String,
        required:true,
        default:'dummy_data',
    },
    desc:{
        type:String,
        default:'',
    },
    dataFileLocation:
    {   
        type:String,
    }
},{
    timestamps:true
});
var Data = mongoose.model('data',DataSchema);
module.exports = Data;