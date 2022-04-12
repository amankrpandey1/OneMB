const express = require("express"),
bodyParser = require("body-parser");
const mongoose  =require('mongoose');
const Data = require('../models/data');
var User = require('../models/user');
const authenticate =require('../authenticate')
const multer = require('multer');
const csv = require('fast-csv');
const fs = require('fs');

global.__basedir = __dirname;

const dataRouter = express.Router();
dataRouter.use(bodyParser.json());

//getting storage
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,__basedir+'/uploads/')
    },
    filename:(req,file,cb)=>{
        cb(null,req.user._id+"_"+file.fieldname+"-"+Date.now()+"-"+file.originalname)
    }
});
// filter to csv filex
const csvFilter = (req,file,cb)=>{
    if(file.mimetype.includes("csv")){
        cb(null,true);
    }
    else{
        cb("file format not valid, upload csv file only",false);
    }
};
const upload = multer({storage:storage,fileFilter:csvFilter});


dataRouter.route('/')
.get(authenticate.verifyUser,(req,res,next)=>{
    Data.find({dataId:req.user._id},{})
    // .populate('data.title')
    .then((data)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(data);
    },(err)=>next(err))
    .catch((err)=>next(err));

})
.post(authenticate.verifyUser,upload.single("file"),(req,res)=>{
    if(req.file==undefined){
        return res.status(400).send({
            message:"no file selected."
        });
    }
    
    //import csv to mongodb
    let csvData = [];
    let filePath = __basedir+'/uploads/'+req.file.filename;
    fs.createReadStream(filePath)
    .pipe(csv.parse({headers:true}))
    .on("error",(error)=>{
        console.log(error.message);
    })
    .on("data",(row)=>{
        csvData.push(row);
    })
    .on("end",()=>{
        User.findById(req.user._id)
        .then((user)=>{
            let dt = new Data({dataId: req.user._id,
                datatitle: req.body.datatitle,
                dataFileLocation:filePath});
                dt.save()
                .then((dataId)=>{
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/json');
                    res.json(dt);
            });
        },(err)=>next(err))
        .catch((err)=>next(err));
    });
})
.put(authenticate.verifyUser,(req,res,next)=>{
    res.statusCode = 403;
    res.end('PUT operation not supported on /data');
})

.delete(authenticate.verifyUser,(req,res,next)=>{
    Data.remove({})
    .then((resp)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }),(err)=>next(err)
    .catch((err)=next(err));
});

dataRouter.route('/:dataID',)
.get(authenticate.verifyUser,(req,res,next)=>{
    Data.findById(req.params.dataID)
    // .populate()
    .then((data)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(data);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post(authenticate.verifyUser,(req,res,next)=>{
    res.statusCode = 403;
    res.end('POST operation not supported on /data/'+ req.params.dataID);
})
.put(authenticate.verifyUser,(req,res,next)=>{
    Data.findById(req.params.dataID)
    .then((data)=>{
        console.log(req.user._id.toString());
        console.log(data.dataId.toString());

        if (data != null && req.user._id.toString() === data.dataId.toString()) {
            
            if (req.body.datatitle) {
                data.datatitle = req.body.datatitle;
            }
            if((req.body.desc)){
                data.desc = req.body.desc;
            }
            data.save()
            .then((data)=>{
                Data.findById(req.params.dataID)
                // .populate('data')
                .then((data)=>{
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/json');
                    res.json(data);
                })
            },(err)=>next(err));
        }
        else if (data == null) {
            err = new Error('data ' + req.params.dataID + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('data ' + req.params.dataID + ' not found');
            err.status = 404;
            return next(err);            
        }
    },(err)=>next(err))
    .catch((err)=>next(err));

})
.delete(authenticate.verifyUser,(req,res,next)=>{
    Data.findByIdAndRemove(req.params.dataID)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});
module.exports = dataRouter;