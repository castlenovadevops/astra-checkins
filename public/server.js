var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app); 
const io = require('socket.io')(http, {
  cors: {
    origin: '*',
  }
});
var appPort = 1919;  
// uncomment after placing your favicon in /public
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: false }));
app.use(express.static(path.resolve(__dirname)));

// app.use(express.static(path.join(__dirname, 'build')));
// app.use('*/css',express.static(path.join(__dirname,'static/css')));
// app.use('*/js',express.static(path.join(__dirname,'static/js')));
// app.use('*/icons',express.static(path.join(__dirname,'static/icons')));
// app.use('*/illustrations',express.static(path.join(__dirname,'static/illustrations')));
// app.use('*/media',express.static(path.join(__dirname,'static/media')));
// app.use('*/images',express.static(path.join(__dirname,'static/mock-images')));
 
app.use(function(request, response, next) {
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type,accessToken,accesstoken, devicetoken, Accept, api-key,udid,device-type,Authorization");
  next();
});
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname)+'/index.html');
});

app.use('/api/v1/', require('./api/v1/routes')); 
 
app.get('*', function (req, res,next) {
  res.sendFile(path.join(__dirname)+'/index.html');
  // next();
});

app.post('*', function (req, res,next) {
  // console.log("POST",req.url);
  next();
}); 
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  // // console.log(req)
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

process.on("uncaughtException",function(err){
  // console.log("Error occured an caught in uncaughtException",err);
});

process.on('unhandledRejection', function(reason, p){
    // console.log("Possibly Unhandled Rejection at: Promise ", p, " reason: ", reason);
    //process.exit();
    // application specific logging here
});

var running_sync_flag = 0

//Whenever someone connects this gets executed
io.on('connection', function(socket) {
  // console.log('A user connected');

  running_sync_flag = 0
  socket.on('startSync', function(){ 
    running_sync_flag = 1
    socket.emit('startSync',{data:'success'})
  })
  socket.on('resetSync', function(){
    running_sync_flag = 0
    socket.emit('stopSync',{data:'success'})
  })
  socket.on('refreshTechnicians', function(){
    // console.log("REFRESH SOCKET CALLED")
    socket.emit('refreshTechnicians',{data:'success'})
  })

  //Whenever someone disconnects this piece of code executed
  socket.on('disconnect', function () {
     // console.log('A user disconnected');
  });
});
  
http.listen(appPort, function() {
    // console.log('app listening on port ' + appPort.toString());
});
 