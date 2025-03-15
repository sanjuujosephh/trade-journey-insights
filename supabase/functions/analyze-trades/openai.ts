
// Call OpenAI API to get the analysis
export async function getAnalysisFromOpenAI(prompt) {
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  
  console.log('Sending request to OpenAI...');
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { 
          role: 'system', 
          content: 'You are a professional trading analyst. Provide clear, actionable insights in a concise format.'
        },
        { 
          role: 'user', 
          content: prompt 
        }
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('OpenAI API error:', errorText);
    throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  console.log('Received response from OpenAI');
  
  if (!data.choices?.[0]?.message?.content) {
    throw new Error('Invalid response from OpenAI');
  }

  return data.choices[0].message.content;
}
