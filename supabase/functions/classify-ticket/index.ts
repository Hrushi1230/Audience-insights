const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text } = await req.json();
    
    if (!text) {
      return new Response(
        JSON.stringify({ error: 'Text is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Classifying ticket:', text.substring(0, 100));

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are a customer service ticket classifier. Analyze the ticket and return ONLY a JSON object with these exact fields:
{
  "type": one of ["complaint", "question", "praise", "feature_request", "bug_report", "other"],
  "priority": one of ["low", "medium", "high", "urgent"],
  "department": one of ["support", "sales", "billing", "technical", "general"],
  "tags": array of 2-4 relevant tags as strings,
  "suggestedReply": a professional, concise reply (2-3 sentences)
}

Classification guidelines:
- complaint: customer is unhappy or reporting an issue
- question: customer needs information or help
- praise: positive feedback
- feature_request: asking for new features
- bug_report: technical problems
- other: doesn't fit above categories

Priority guidelines:
- urgent: service down, payment issues, security concerns
- high: frustrated customer, time-sensitive, affecting business
- medium: general issues, standard questions
- low: praise, feature requests, general inquiries

Return ONLY valid JSON, no markdown, no explanation.`
          },
          {
            role: 'user',
            content: text
          }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error('No response from AI');
    }

    console.log('Raw AI response:', content);

    // Parse the JSON response
    let classification;
    try {
      // Remove markdown code blocks if present
      const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
      classification = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      // Return a default classification if parsing fails
      classification = {
        type: 'question',
        priority: 'medium',
        department: 'general',
        tags: ['unclassified'],
        suggestedReply: 'Thank you for reaching out. We have received your message and will respond shortly.'
      };
    }

    console.log('Classification result:', classification);

    return new Response(
      JSON.stringify(classification),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in classify-ticket function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});