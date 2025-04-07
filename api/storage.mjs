import { GridFSBucket } from 'mongodb';
import mongoose from 'mongoose';

let gfs;

mongoose.connection.once('open', () => {
  gfs = new GridFSBucket(mongoose.connection.db, {
    bucketName: 'uploads'
  });
});

// Exporte como objeto nomeado
export const uploadFile = async (fileBuffer, filename) => {
  return new Promise((resolve, reject) => {
    const uploadStream = gfs.openUploadStream(filename);
    uploadStream.write(fileBuffer);
    uploadStream.end(() => resolve(filename));
    uploadStream.on('error', reject);
  });
};

export const getFileStream = (filename) => {
  return gfs.openDownloadStreamByName(filename);
};

// Adicione esta linha para compatibilidade
export default { uploadFile, getFileStream };