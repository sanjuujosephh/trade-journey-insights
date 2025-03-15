
// Call OpenAI API to get the analysis
export async function getAnalysisFromOpenAI(prompt) {
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  
  if (!openAIApiKey) {
    console.error('OpenAI API key not configured');
    throw new Error('OpenAI API key not configured');
  }
  
  console.log('Sending request to OpenAI...');
  try {
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
        temperature: 0.7,
        max_tokens: 1500
      }),
    });

    const responseText = await response.text();
    
    if (!response.ok) {
      console.error(`OpenAI API error (${response.status}):`, responseText);
      throw new Error(`OpenAI API error: ${response.status} - ${responseText.substring(0, 200)}`);
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse OpenAI response:', e);
      console.error('Response text:', responseText.substring(0, 500));
      throw new Error('Invalid JSON response from OpenAI');
    }
    
    console.log('Received response from OpenAI');
    
    if (!data.choices?.[0]?.message?.content) {
      console.error('Unexpected OpenAI response format:', JSON.stringify(data).substring(0, 200));
      throw new Error('Invalid response format from OpenAI');
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API request failed:', error);
    throw error; // Re-throw to be handled by the calling function
  }
}
