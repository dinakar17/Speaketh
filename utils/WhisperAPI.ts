export const translateSpeechToText = async (formData: FormData | null) : Promise<any> => {
  const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY ?? ""}`,
    },
    method: "POST",
    body: formData,
  });
  const textData = await res.json();

  return textData;
};
