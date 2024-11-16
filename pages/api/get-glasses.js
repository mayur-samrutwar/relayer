import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const glassesDirectory = path.join(process.cwd(), 'public/glasses');
  
  try {
    const fileNames = fs.readdirSync(glassesDirectory);
    const glasses = fileNames
      // Filter out .DS_Store and any other hidden files
      .filter(fileName => !fileName.startsWith('.') && 
        (fileName.endsWith('.png') || fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')))
      .map((fileName) => ({
        id: fileName,
        image: `/glasses/${fileName}`
      }));
    
    res.status(200).json(glasses);
  } catch (error) {
    console.error('Error reading glasses directory:', error);
    res.status(500).json({ error: 'Failed to load glasses' });
  }
}