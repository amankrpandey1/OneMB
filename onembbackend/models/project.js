const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var experimentSchema = new Schema({
    expId: {type: mongoose.Schema.ObjectId},
    exptitle:{
        type:String,
        required:true,
        default:'exp1',
    },
    status:{
        type: mongoose.Schema.ObjectId,
    }
},
    {timestamps:true}
); 

var ProjectSchema = new Schema({
    projectId:{
        type: mongoose.Schema.ObjectId,
    },
    projecttitle:{
        type:String,
        required:true,
        default:'Project1',
    },
    experiments:[experimentSchema]
},
    {timestamps:true}
);
var Project = mongoose.model('project',ProjectSchema);
module.exports = Project;