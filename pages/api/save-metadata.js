import { connectToDatabase } from '../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, description, image, creator } = req.body;
    
    const { db } = await connectToDatabase();
    
    const metadata = {
      name,
      description,
      image,
      creator: {
        name: creator,
        avatar: "https://pbs.twimg.com/profile_images/1593304942210478080/TUYae5z7_400x400.jpg"
      }
    };

    const result = await db.collection('metadata').insertOne(metadata);
    
    return res.status(200).json({ 
      id: result.insertedId.toString(),
      metadata 
    });
  } catch (error) {
    console.error('Error saving metadata:', error);
    return res.status(500).json({ error: 'Failed to save metadata' });
  }
}
