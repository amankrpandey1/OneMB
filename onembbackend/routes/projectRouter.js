const express = require("express"),
bodyParser = require("body-parser");
const mongoose  =require('mongoose');
const {PythonShell} =require('python-shell');
const Project = require('../models/project');
const Output = require('../models/output');
var User = require('../models/user');
const authenticate =require('../authenticate')
const projectRouter = express.Router();
projectRouter.use(bodyParser.json());

projectRouter.route('/',)
.get(authenticate.verifyUser,(req,res,next)=>{
    Project.find({projectId:req.user._id},{})
    // .populate('experiments.author')
    .then((projects)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(projects);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post(authenticate.verifyUser,(req,res,next)=>{
    User.findById(req.user._id)
    .then((user)=>{
            req.body.projectId = req.user.id;
            let pr = new Project({projectId: req.body.projectId,projecttitle: req.body.projecttitle,experiments:req.body.experiments})
            pr.save()
            .then((pr)=>{
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(pr);
            });

    },(err)=>next(err))
    .catch((err)=>next(err));
})
.put(authenticate.verifyUser,(req,res,next)=>{
    res.statusCode = 403;
    res.end('PUT operation not supported on /projects');
})

.delete(authenticate.verifyUser,(req,res,next)=>{
    Project.remove({})
    .then((resp)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }),(err)=>next(err)
    .catch((err)=next(err));
});

projectRouter.route('/:prID',)
.get(authenticate.verifyUser,(req,res,next)=>{
    Project.findById(req.params.prID)
    .populate('projectId')
    .then((project)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(project);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post(authenticate.verifyUser,(req,res,next)=>{
    res.statusCode = 403;
    res.end('POST operation not supported on /projects/'+ req.params.prID);
})
.put(authenticate.verifyUser,(req,res,next)=>{
    Project.findByIdAndUpdate(req.params.prId, {
        $set: req.body
    }, { new: true })
    .then((project) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(project);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(authenticate.verifyUser,(req,res,next)=>{
    Project.findByIdAndRemove(req.params.prId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});
projectRouter.route('/:prId/experiments',)
.get(authenticate.verifyUser,(req,res,next)=>{
    Project.findById(req.params.prId)
    .populate('experiments.expId')
    .then((project)=>{
        if(project!=null){
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(project.experiments);
        }
        else{
            err = new Error('Error: project '+req.params.prId+' not found');
            res.statusCode = 404;
            return next(err);
        }
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post(authenticate.verifyUser,(req,res,next)=>{
    Project.findById(req.params.prId)
    .then((project)=>{
        if(project!=null){
            req.body.expId = req.params.prId;
            project.experiments.push(req.body);
            project.save()
            .then((project)=>{
                Project.findById(project._id)
                .populate('experiments')
                .then((project)=>{
                    console.log('Experiment Created',project);
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/json');
                    res.json(project);
                })
            },(err)=>next(err));    
        }
        else{
            err = new Error('Error: Project '+req.params.prId+' not found');
            res.statusCode = 404;
            return next(err);
        }
        
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.put(authenticate.verifyUser,(req,res,next)=>{
    res.statusCode = 403;
    res.end('PUT operation not supported on /projects/'
    + req.params.prId + '/experiments');
})
.delete(authenticate.verifyUser,(req,res,next)=>{
    Project.findById(req.params.prId)
    .then((project)=>{
        if(project!=null){
            for(var i = (project.experiments.length-1);i>=0;i--){
                project.experiments.id(project.experiments[i]._id).remove();
            }
            project.save()
            .then((project)=>{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(project);
            },(err)=>next(err));  
        }
        else{
            err = new Error('Error: Project ' + req.params.prId + ' not found');
            err.status = 404;
            return next(err);
        }   
    }),(err)=>next(err)
    .catch((err)=next(err));
});
projectRouter.route('/:prId/experiments/:experimentId',)
.get(authenticate.verifyUser,(req,res,next)=>{
    Project.findById(req.params.prId)
    .populate('experiments')
    .then((project)=>{
        if(project!=null && project.experiments.id(req.params.experimentId)!=null){

            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(project);
        }
        else if(project!=null){
            err = new Error('Error: project'+ req.params.prId +  'not found ');
            err.status = 404;
            return next(err); 
        }
        else if(project==null){
            err = new Error('Error: experiment'+ req.params.experimentId +  'not found ');
            err.status = 404;
            return next(err); 
        }
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post(authenticate.verifyUser,(req,res,next)=>{
    res.statusCode = 403;
    res.end('Post operation not supported on/projects/'+ req.params.prId
    + '/experiments/' + req.params.experimentId);
})
.put(authenticate.verifyUser,(req,res,next)=>{
    Project.findByIdAndUpdate(req.params.prId)
    .then((project)=>{
        if (project != null && project.experiments.id(req.params.experimentId) != null) {
            if (project.experiments.id(req.params.experimentId).expId.toString() != req.user._id.toString()) {
                err = new Error('You are not authorized to edit this experiment');
                err.status = 403;
                return next(err);
            }
            
            if (req.body.exptitle) {
                project.experiments.id(req.params.experimentId).exptitle = req.body.exptitle;
            }
            project.save()
            .then((project)=>{
                Project.findById(prId._id)
                .populate('experiments.expId')
                .then((project)=>{
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/json');
                    res.json(project);
                })
            },(err)=>next(err));
        }
        else if (project == null) {
            err = new Error('Project ' + req.params.prId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Experiments ' + req.params.experimentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.delete(authenticate.verifyUser,(req,res,next)=>{
    Project.findById(req.params.prId)
    .then((project)=>{
        if (project != null && project.experiments.id(req.params.experimentId) != null) {
            if (project.experiments.id(req.params.experimentId).expId.toString() != req.user._id.toString()) {
                err = new Error('You are not authorized to edit this experiment');
                err.status = 403;
                return next(err);
            }
            project.experiments.id(req.params.experimentId).remove();
            project.save()
            .then((project)=>{
                Project.findById(project._id)
                .populate('experiment.expId')
                .then((project)=>{
                    res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(project);
                })
                
            },(err)=>next(err));
        }
        else if (project == null) {
            err = new Error('Project ' + req.params.prId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Experiment ' + req.params.experimentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    },(err)=>next(err))
    .catch((err)=>next(err));
});

// run experiment router

projectRouter.route('/:prId/experiments/:experimentId/run-experiment')
.post(authenticate.verifyUser,(req,res,next)=>{
    // console.log(JSON.stringify(req.body));
    let options = {
        mode: 'text',
        pythonOptions: ['-u'], // get print results in real-time
            scriptPath: './Algos/', //If you are having python_test.py script in same folder, then it's optional.
        args: [JSON.stringify(req.body)], //An argument which can be accessed in the script using sys.argv[1]
        exitCode: 1
    };

    PythonShell.run('wrapper.py', options, function (err, result)
    {
        if (err) throw err;
        // result is an array consisting of messages collected
        //during execution of script.
        console.log('result: ', result);
        result = JSON.parse(result[0])
        console.log('return_code ',result.return_code);
        if(result.return_code=='1'){
            console.log("i am here");
            console.log('prid: ',req.params.prId);
            Project.findById(req.params.prId)
            .then(project=>{
                if(project!=null){
                    console.log("i am here 2");
                    var outputId = req.params.experimentId;
                    var folder = result.folderPath;
                    var status = parseInt(result.return_code);
                    console.log(outputId,folder,status);
                    let opt = new Output({outputId: outputId,folder:folder,status:status});
                    opt.save(function (err, book) {
                        if (err) return console.error(err);
                        console.log(book.name + " saved to bookstore collection.");
                    });
                    project.experiments.id(req.params.experimentId).status = status;
                    project.save()
                    .then((project)=>{
                        res.statusCode = 200;
                        res.setHeader('Content-Type','application/json');
                        res.send(result);
                    });
                }
            },(err)=>next(err))
            .catch((err)=>next(err));
        }

    });
})
.put(authenticate.verifyUser,(req,res,next)=>{
    res.statusCode = 403;
    res.end('PUT operation not supported on /run-experiment');
})
.get(authenticate.verifyUser,(req,res,next)=>{
    res.statusCode = 403;
    res.end('get operation not supported on /run-experiment');
})
.delete(authenticate.verifyUser,(req,res,next)=>{
    res.statusCode = 403;
    res.end('get operation not supported on /run-experiment');
});

projectRouter.route('/:prId/experiments/:experimentId/output')
.get(authenticate.verifyUser,(req,res,next)=>{
    Output.findOne({outputId:req.params.experimentId})
    .then((output)=>{
        if(output!=null){
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(output);
        }
       if(output==null){
            err = new Error('Error: experiment'+ req.params.experimentId +  'not found ');
            err.status = 404;
            return next(err); 
        }
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.put(authenticate.verifyUser,(req,res,next)=>{
    res.statusCode = 403;
    res.end('PUT operation not supported on /output');
})
.post(authenticate.verifyUser,(req,res,next)=>{
    res.statusCode = 403;
    res.end('POST operation not supported on /output');
})
.delete(authenticate.verifyUser,(req,res,next)=>{
    res.statusCode = 403;
    res.end('DELETE operation not supported on /output');
});

module.exports = projectRouter;