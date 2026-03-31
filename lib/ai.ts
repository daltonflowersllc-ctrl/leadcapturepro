import Groq from 'groq-sdk';

function getGroqClient() {
  return new Groq({ apiKey: process.env.GROQ_API_KEY || 'placeholder' });
}

export async function scoreLead(
  serviceType: string,
  urgency: string,
  budget: string,
  description: string
): Promise<{ score: 'hot' | 'warm' | 'cold'; emoji: '🔴' | '🟡' | '🟢'; reason: string; confidence: number }> {
  try {
    const completion = await getGroqClient().chat.completions.create({
      model: 'llama3-8b-8192',
      messages: [
        {
          role: 'system',
          content:
            'You are a lead scoring assistant for home service businesses. Analyze the lead details and return ONLY valid JSON with no markdown or extra text: {score, emoji, reason, confidence}',
        },
        {
          role: 'user',
          content: `Service: ${serviceType}\nUrgency: ${urgency}\nBudget: ${budget}\nDescription: ${description}`,
        },
      ],
    });
    const text = completion.choices[0]?.message?.content || '';
    return JSON.parse(text);
  } catch {
    return { score: 'warm', emoji: '🟡', reason: 'Unable to score lead automatically', confidence: 0 };
  }
}

export async function generateSmartSMS(
  businessName: string,
  callerPhone: string,
  hourOfDay: number
): Promise<string> {
  try {
    let timeOfDay = 'morning';
    if (hourOfDay >= 12 && hourOfDay < 17) timeOfDay = 'afternoon';
    else if (hourOfDay >= 17) timeOfDay = 'evening';

    const completion = await getGroqClient().chat.completions.create({
      model: 'llama3-8b-8192',
      messages: [
        {
          role: 'system',
          content:
            'You write friendly missed call SMS messages for home service businesses. Make it personal and create urgency. Always end with exactly [FORM_LINK]. Under 320 characters total.',
        },
        {
          role: 'user',
          content: `Business: ${businessName}\nCaller phone: ${callerPhone}\nTime of day: ${timeOfDay}`,
        },
      ],
    });
    const msg = completion.choices[0]?.message?.content || '';
    if (msg && msg.includes('[FORM_LINK]')) return msg;
    return `Hi! You just called ${businessName} but we missed you. We don't want to lose you! Fill out this quick form and we'll call you right back: [FORM_LINK]`;
  } catch {
    return `Hi! You just called ${businessName} but we missed you. We don't want to lose you! Fill out this quick form and we'll call you right back: [FORM_LINK]`;
  }
}

export async function generateOwnerSMS(
  businessName: string,
  callerName: string,
  callerPhone: string,
  serviceType: string,
  urgency: string,
  budget: string,
  description: string,
  leadScore: string,
  leadEmoji: string
): Promise<string> {
  try {
    const completion = await getGroqClient().chat.completions.create({
      model: 'llama3-8b-8192',
      messages: [
        {
          role: 'system',
          content:
            'You write short SMS alerts for contractors about new leads. Under 160 characters. Start with the score emoji. Be direct and actionable. Include caller name/phone, service type, and urgency.',
        },
        {
          role: 'user',
          content: `Business: ${businessName}\nCaller: ${callerName} (${callerPhone})\nService: ${serviceType}\nUrgency: ${urgency}\nBudget: ${budget}\nDescription: ${description}\nScore: ${leadScore} ${leadEmoji}`,
        },
      ],
    });
    return (
      completion.choices[0]?.message?.content ||
      `${leadEmoji} New lead: ${callerName} (${callerPhone}) needs ${serviceType} - ${urgency}. Check dashboard: [APP_URL]/dashboard`
    );
  } catch {
    return `${leadEmoji} New lead: ${callerName} (${callerPhone}) needs ${serviceType} - ${urgency}. Check dashboard: [APP_URL]/dashboard`;
  }
}

export async function transcribeVoicemail(audioUrl: string): Promise<string> {
  try {
    const response = await fetch(audioUrl);
    if (!response.ok) throw new Error('Failed to fetch audio');
    const arrayBuffer = await response.arrayBuffer();
    const file = new File([arrayBuffer], 'voicemail.mp3', { type: 'audio/mpeg' });

    const transcription = await getGroqClient().audio.transcriptions.create({
      file,
      model: 'whisper-large-v3',
    });
    return transcription.text;
  } catch {
    return 'Voicemail transcription unavailable';
  }
}

export async function generateCallScripts(
  callerName: string,
  serviceType: string,
  urgency: string,
  budget: string,
  description: string
): Promise<string[]> {
  try {
    const completion = await getGroqClient().chat.completions.create({
      model: 'llama3-8b-8192',
      messages: [
        {
          role: 'system',
          content:
            'You write phone call scripts for contractors calling back leads. Return ONLY a valid JSON array of 3 strings. Each script under 100 words. Be natural and confident. Tailor to the specific service and urgency.',
        },
        {
          role: 'user',
          content: `Caller: ${callerName}\nService: ${serviceType}\nUrgency: ${urgency}\nBudget: ${budget}\nDescription: ${description}`,
        },
      ],
    });
    const text = completion.choices[0]?.message?.content || '';
    const scripts = JSON.parse(text);
    if (Array.isArray(scripts) && scripts.length >= 3) return scripts.slice(0, 3);
    throw new Error('Invalid scripts response');
  } catch {
    return [
      `Hi ${callerName}, this is [Your Name] calling back about your inquiry. I saw you reached out and I'd love to help. Do you have a few minutes to discuss what you need?`,
      `Hey ${callerName}! I'm returning your call about ${serviceType || 'our services'}. I want to make sure we take care of you. When would be a good time to get started?`,
      `Hello ${callerName}, thanks for your interest! I'm following up on your request. I have availability this week and would love to get you taken care of. Can we schedule a time?`,
    ];
  }
}
