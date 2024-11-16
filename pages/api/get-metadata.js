import { connectToDatabase } from '../../lib/db';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { metadataId } = req.query;
  
  try {
    const { db } = await connectToDatabase();
    
    // Find metadata document by metadataId
    const metadata = await db.collection('metadata')
      .findOne({ 
        "_id": new ObjectId(metadataId)
      });
    
    if (!metadata) {
      return res.status(404).json({ error: 'Metadata not found' });
    }

    return res.status(200).json({
      name: metadata.name,
      description: metadata.description,
      image: metadata.image,
      creator: metadata.creator
    });
  } catch (error) {
    console.error('Error fetching metadata:', error);
    return res.status(500).json({ error: 'Failed to fetch metadata' });
  }
}
