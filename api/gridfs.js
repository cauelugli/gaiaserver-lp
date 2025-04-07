const mongoose = require('mongoose');

let gfs = null;

mongoose.connection.once('open', () => {
  gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: 'uploads'
  });
  console.log('✔️ GridFS pronto!');
});

module.exports = () => gfs;