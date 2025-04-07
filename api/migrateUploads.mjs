import { promises as fs } from 'fs';
import path from 'path';
import { uploadFile } from './storage.mjs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Função para verificar se é arquivo
const isFile = async (filePath) => {
  try {
    const stat = await fs.stat(filePath);
    return stat.isFile();
  } catch (err) {
    return false;
  }
};

const migrateFiles = async () => {
  await mongoose.connect(process.env.MONGO_URL);
  
  const uploadsDir = '../uploads/images';
  let successCount = 0;
  let skipCount = 0;

  try {
    const items = await fs.readdir(uploadsDir, { withFileTypes: true });
    
    for (const item of items) {
      const fullPath = path.join(uploadsDir, item.name);
      
      if (item.isDirectory()) {
        console.log(`↘️ Skipping directory: ${item.name}`);
        skipCount++;
        continue;
      }

      if (!(await isFile(fullPath))) {
        console.log(`⏭️ Not a file: ${item.name}`);
        skipCount++;
        continue;
      }

      try {
        const fileBuffer = await fs.readFile(fullPath);
        await uploadFile(fileBuffer, item.name);
        console.log(`✅ Migrated: ${item.name}`);
        successCount++;
      } catch (err) {
        console.error(`❌ Failed ${item.name}:`, err.message);
      }
    }
  } finally {
    await mongoose.disconnect();
    console.log('\n📊 Migration Report:');
    console.log(`✔️ Success: ${successCount}`);
    console.log(`⏭️ Skipped: ${skipCount}`);
  }
};

migrateFiles().catch(console.error);