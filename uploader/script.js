var express = require("express"),
	app = express(),
	http = require("http").Server(app).listen(80),
	upload = require("express-fileupload");
	app.use(upload())
const fs = require("fs")
const {exec} = require("child_process")
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
	
console.log('running');

app.get("/", function(req,res){
	res.sendFile(__dirname+"/index.html");
})

app.get("/jquery-3.6.0.min.js", function(req,res){
	res.sendFile(__dirname+"/jquery-3.6.0.min.js");
})

app.get("/latest.log", function(req,res){
	fs.readFile(__dirname+"/minecraft/logs/latest.log", 'utf8', (err, data)=>{
		//console.log(err)
		data = data.replace(/</g, '&lt;')
		data = data.replace(/>/g, '&gt;')
		data = data.split("\n").slice(-10).join("\n")
		//console.log(data)
		res.send(data);
	});
})

app.post("/", function(req,res){
	if(req.files){
		var file = req.files.file;
		file = file instanceof Array ? file : [file]
		file.forEach(function(foo){
			filename = foo.name;
			foo.mv("./upload/"+filename,function(err){
				if(err){
					console.log(err)
					res.send("error occured")
				}
			})
		})
		res.send("Done!")
	}
	if(req.body.payload){
		console.log(req.body.payload)
		command = req.body.payload
		//command = 'say done'
		payload = 'screen -S minecraft -p 0 -X stuff "'.concat(command.concat('^M"'))
		console.log(payload)
		exec(payload, (error, stdout, stderr)=>{
			if (error) {
				console.log(`error: ${error.message}`);
				return;
			}
			if (stderr) {
				console.log(`stderr: ${stderr}`);
				return;
			}
			console.log(`stdout: ${stdout}`);
		});
		//res.send("sent command")
		res.sendFile(__dirname+"/index.html");
	}
	if(!req.files && !req.body.payload){
		res.sendFile(__dirname+"/index.html");
	}
})