// pages/api/whisper.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const formData = req.body; // won't work since req.body is not parsed
  const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ''}`,
    },
    method: 'POST',
    body: formData,
  });

  console.log(response);

  const textData = await response.json();

  if (response.ok) {
    res.status(200).json(textData);
  } else {
    res.status(response.status).json({ error: textData.error });
  }
}
