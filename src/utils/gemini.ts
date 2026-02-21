export const analyzeProfile = async (apiKey: string, profileData: any) => {
  const prompt = `
    Act as a professional LinkedIn recruiter and career coach.
    Analyze this LinkedIn profile and provide a detailed review.
    
    Profile Data:
    ${JSON.stringify(profileData, null, 2)}
    
    Score it strictly out of 100 based on the following criteria:
    1. Headline Score
    2. About Section Score
    3. Experience Score
    4. Skills Score
    5. Keyword Optimization Score
    6. Recruiter Attractiveness Score
    
    Return the response in JSON format with the following structure:
    {
      "overallScore": number,
      "scores": {
        "headline": number,
        "about": number,
        "experience": number,
        "skills": number,
        "keywords": number,
        "recruiter": number
      },
      "reasoning": "string",
      "improvements": {
        "headline": ["string"],
        "about": ["string"],
        "experience": ["string"],
        "skills": ["string"]
      },
      "missingKeywords": ["string"],
      "headlineRecommendations": ["string"],
      "achievementExamples": ["string"]
    }
    
    Be concise but impactful. Suggest detailed improvements for each section.
  `;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        responseMimeType: "application/json"
      }
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to call Gemini API');
  }

  const data = await response.json();
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!content) {
    throw new Error('Empty response from Gemini AI');
  }

  // Clean the response if it's wrapped in markdown code blocks
  const cleanedContent = content.replace(/```json/g, '').replace(/```/g, '').trim();

  return JSON.parse(cleanedContent);
};
