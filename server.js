    var express = require('express'),
    path = require('path'),
    nodeMailer = require('nodemailer'),
    bodyParser = require('body-parser');
    var fs = require('fs');
    var formidable = require('formidable');
    
    var multer  = require('multer')

    var app = express();
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    var port = 3000;

    // Directing to the HTML form
    app.get('/', function (req, res) {
      res.sendFile(__dirname + '/index.html');
    });

    //Multer  to save files on the server
    var storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, '')
      },
      filename: function (req, file, cb) {
        cb(null, file.originalname )
      }
    })
    var upload = multer({ storage: storage });

        
      // Queue to get messages in it
        var queue = require('queue');

        var q = queue();
         function extraSlowJob(cb) {
             
             // Timer function 
	           setTimeout(function() {

              // POST REQUEST API
              app.post('/sendDelayedEmail', upload.single('myFile'), (req, res, next) => {
                const file = req.file;
                console.log(file.originalname);
                if (!file) {
                  const error = new Error('Please upload a file')
                  error.httpStatusCode = 400
                  return next(error)
                }
                  res.send("The server is up after 5000 ms");
            
                  // logging the incoming parameters
                console.log("to ="+req.body.to);
                console.log("subject = "+req.body.subject);
                console.log("body = "+req.body.body);
                console.log("Image = "+req.file.originalname);

                // credentials of the accounts being used to send the email
              let transporter = nodeMailer.createTransport({
                  service: 'gmail',
                  auth: {
                      user: 'demoarush1235@gmail.com',
                      pass: 'Gtavicecity@1235'
                  }
                  
              });

              // Sending the mail
              let mailOptions = {
                  from: '"Arush Kumar" <demoarush1235@gmail.com>', // sender address
                  to: req.body.to, // list of receivers
                  subject: req.body.subject, // Subject line
                 // text: req.body.body, // plain text body
                  html: req.body.body, // html body
                  attachments : [
                    {
                      // the file being uploaded by the user
                        filename:req.file.originalname,
                        content: fs.createReadStream(req.file.originalname)
                  },
                  {
                    //  the predefined HTML file  
                    filename: 'Intro.html',
                    content: fs.createReadStream('Intro.html')
                  }
                ]
              };
        
              transporter.sendMail(mailOptions, (error, info) => {
                  if (error) {
                      return console.log(error);
                  }
                  console.log('Message %s sent: %s', info.messageId, info.response);
                  });
              });
	      }, 5000)
         }

        q.push(extraSlowJob);
        // begin processing, get notified on end / failure
        q.start(function (err) {
        if (err) throw err
        console.log('all done:', results)
        })

        // listening the server at  port 3000
          app.listen(port, function(){
            console.log('Server is running at port: ',port);
          });





