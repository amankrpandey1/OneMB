
var User = require('../models/user');


function getAllUsers(req,res){
    User.find({}).then((users)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(users);
    },(err)=>next(err))
    .catch((err)=>next(err));
}
