const { Collection } = require('mongodb');
var passportLocalMongoose = require('passport-local-mongoose');
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    
    firstname:{
        type:String,
        default:'',
        // required:true
    },
    lastname:{
        type:String,
        default:'',
    },
    dob:{
        type:Date,
        default:'',
        // required:true,
    },
    email:{
        type:String,
        default:'',
        // required:true,
    },
    company:{
        type:String,
        default:'',
        
    },
    designation:{
        type:String,
        default:'',
    },
    areaofexp:{
        type:String,
        default:'',
    },
    admin:{
        type:Boolean,
        default:false
    }

},  {
    timestamps:true
    }
);
UserSchema.plugin(passportLocalMongoose)
module.exports = mongoose.model('User',UserSchema);