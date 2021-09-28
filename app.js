var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cors = require('cors');

const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')
const multer = require('multer');


// database Config


mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost:27017/test?serverSelectionTimeoutMS=5000&connectTimeoutMS=10000&3t.uriVersion=3&3t.connection.name=local&3t.alwaysShowAuthDB=true&3t.alwaysShowDBFromUserRole=true', { useNewUrlParser: true })
  .then(() => {
    console.log('Start');
  })
  .catch(err => {
    console.error('App starting error:', err.stack);
    process.exit(1);
  });





var itemRouter = require('./src/routes/todoRoutes');
var productRouter = require('./src/routes/productRoutes');



app.use(express.static('public'));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', itemRouter);
app.use('/', productRouter);

cloudinary.config({
  cloud_name: 'duxeq31cl',
  api_key: '692861435622978',
  api_secret: 'FuRK2lrhoiWQhlV0c2DfTEiKjLE'
});
const fileUpload = multer()

app.post('/upload', fileUpload.single('image'), function (req, res, next) {
  let streamUpload = (req) => {
    return new Promise((resolve, reject) => {
      let stream = cloudinary.uploader.upload_stream(
        (error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        }
      );

      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });
  };

  async function upload(req) {
    let result = await streamUpload(req);
    res.status(201).send((result));

  }
  upload(req);
  console.log(req,"request");
});


const port = process.env.Port || 4000
app.listen(port, function () {
  console.log('Server is running on Port: ', port);
});

module.exports = app;