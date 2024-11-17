import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Use temporary images from public folder with full URLs
    const baseImageUrl = `https://i.ibb.co/G0JHwKM/nft5.png`;
    const modificationImageUrl = `https://i.ibb.co/g7Kwf4z/nft4.png`;

    // Analyze the base image
    const baseImageAnalysis = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Describe this image focusing on the main subjects, their positions, and the overall composition. Be concise." },
            {
              type: "image_url",
              image_url: {
                url: baseImageUrl,
                detail: "low"
              }
            }
          ],
        }
      ],
      max_tokens: 150
    });

    // Analyze the modification image
    const modificationImageAnalysis = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "What are the key elements or features in this image that could be incorporated into another image? Focus on style, objects, or distinctive features." },
            {
              type: "image_url",
              image_url: {
                url: modificationImageUrl,
                detail: "low"
              }
            }
          ],
        }
      ],
      max_tokens: 150
    });

    // Create an intelligent combination prompt
    const contextualPrompt = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert at creating DALL-E prompts that combine elements from different images in a natural and aesthetically pleasing way."
        },
        {
          role: "user",
          content: `Base image contains: ${baseImageAnalysis.choices[0].message.content}\n\nElements to incorporate: ${modificationImageAnalysis.choices[0].message.content}\n\nCreate a detailed DALL-E prompt that will maintain the original composition while naturally incorporating elements from the second image. Consider spatial relationships, style consistency, and logical placement of new elements.`
        }
      ],
      max_tokens: 300
    });

    // Generate the new combined image
    const imageResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt: contextualPrompt.choices[0].message.content,
      size: "1024x1024",
      quality: "standard",
      n: 1,
    });

    return res.status(200).json({
      url: imageResponse.data[0].url,
      baseAnalysis: baseImageAnalysis.choices[0].message.content,
      modificationAnalysis: modificationImageAnalysis.choices[0].message.content,
      finalPrompt: contextualPrompt.choices[0].message.content
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: error.message || 'Failed to generate image' });
  }
}
