var express = require("express");
var atob = require("atob");
var app = express();
var formidable = require("formidable");
var shelljs = require("shelljs");
var objScripts = {};


app.get("/",function(req, res){
  res.sendFile(__dirname + "/index.html")
})

app.post('/', function (req, res){
    var form = new formidable.IncomingForm();
    console.log(form);
    form.parse(req);

    form.on('fileBegin', function (name, file){
        file.path = __dirname + '/' + file.name;
    });

    form.on('file', function (name, file){
        console.log('Uploaded ' + file.name);
        res.send(shelljs.exec("pm2 start " + file.name).output);
    });
    console.log(200);
    res.sendStatus(200);

});

app.get('/stats', function (req, res){
  shelljs.exec("pm2 list" , function(code, output){
    res.send(output);
  })
});



app.post("/script/:filename", function(req, res, next){
  console.log(req.file);
  objScripts[req.params.filename] = req.file;
  res.send("200:Success");
})

app.get("/script", function(req, res){
  res.send(JSON.stringify(objScripts));
})

app.listen(8080, function(){
  console.log("running on port 8080");
})
