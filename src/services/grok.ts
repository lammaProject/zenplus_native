export type Mood = 'calm' | 'anxious' | 'energetic';

export interface MoodOption {
  id: Mood;
  emoji: string;
  label: string;
  description: string;
}

export const MOOD_OPTIONS: MoodOption[] = [
  {
    id: 'calm',
    emoji: '😌',
    label: 'Спокойный',
    description: 'Я в гармонии с собой',
  },
  {
    id: 'anxious',
    emoji: '😰',
    label: 'Тревожный',
    description: 'Чувствую напряжение',
  },
  {
    id: 'energetic',
    emoji: '⚡',
    label: 'Энергичный',
    description: 'Полон сил и идей',
  },
];

const MOOD_PROMPTS: Record<Mood, string> = {
  calm: `Пользователь чувствует себя спокойно и гармонично. 
Напиши короткую медитативную аффирмацию (2-3 предложения) на русском языке. 
Тон: мягкий, осознанный, поддерживающий. 
Начни с обращения "Сегодня ты..." или "В этот момент...".`,

  anxious: `Пользователь чувствует тревогу и напряжение. 
Напиши успокаивающую аффирмацию для медитации (2-3 предложения) на русском языке. 
Тон: тёплый, заземляющий, успокоительный. 
Помоги почувствовать безопасность и опору. 
Начни с "Ты в безопасности..." или "Прямо сейчас...".`,

  energetic: `Пользователь полон энергии и сил. 
Напиши вдохновляющую аффирмацию для медитации (2-3 предложения) на русском языке. 
Тон: динамичный, мотивирующий, искренний. 
Направь эту энергию в созидательное русло. 
Начни с "Твоя энергия..." или "Сегодня ты способен...".`,
};

const HF_CHAT_URL = 'https://router.huggingface.co/v1/chat/completions';
const HF_CHAT_MODEL = 'Qwen/Qwen2.5-72B-Instruct';

export interface GrokResult {
  text: string;
  error?: string;
}

export async function generateMoodAffirmation(mood: Mood): Promise<GrokResult> {
  const apiKey = process.env.EXPO_PUBLIC_HF_API_KEY;
console.log(apiKey)
  if (!apiKey || apiKey === 'your_hf_key_here') {
    return {
      text: '',
      error: 'API ключ не настроен. Добавь EXPO_PUBLIC_HF_API_KEY в .env файл.',
    };
  }

  const prompt = MOOD_PROMPTS[mood];

  try {
    const response = await fetch(HF_CHAT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: HF_CHAT_MODEL,
        messages: [
          {
            role: 'system',
            content:
              'Ты — медитативный гид приложения ZenPulse. Твои аффирмации краткие, глубокие и поэтичные. Отвечай только текстом аффирмации, без вступлений и пояснений.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 150,
        temperature: 0.85,
        stream: false,
      }),
    });
console.log(response);
    if (!response.ok) {
      const errBody = await response.text();
      return {
        text: '',
        error: `Ошибка API: ${response.status}. ${errBody}`,
      };
    }

    const data = await response.json();
    const text: string = data?.choices?.[0]?.message?.content?.trim() ?? '';

    if (!text) {
      return { text: '', error: 'Пустой ответ от AI.' };
    }

    return { text };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { text: '', error: `Сетевая ошибка: ${message}` };
  }
}
