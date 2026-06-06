const fallbackAnalyze = (message) => {
  const text = String(message || '');
  const lower = text.toLowerCase();
  const phone = text.match(/\(?\d{2}\)?\s*\d{4,5}[-.\s]?\d{4}/)?.[0] || '';
  const address = text.match(/(?:rua|av\.?|avenida|alameda)\s+[^,.\n]+(?:\s*,?\s*\d+)?/i)?.[0] || '';
  const name = text.match(/(?:sou|meu nome e|meu nome é|me chamo|aqui e|aqui é|e o|é o|e a|é a)\s+([A-Za-zÀ-ÿ]+)/i)?.[1] || '';

  const serviceMap = [
    ['Calha', ['calha', 'calhas']],
    ['Rufo', ['rufo', 'rufos']],
    ['Janela', ['janela', 'janelas']],
    ['Porta', ['porta', 'portas']],
    ['Box de Vidro', ['box', 'banheiro']],
    ['Vidro Temperado', ['vidro', 'temperado', 'laminado']],
    ['Guarda-corpo', ['guarda-corpo', 'guarda corpo', 'sacada']],
    ['Manutenção', ['manutenção', 'manutencao', 'conserto', 'reparo', 'arrumar', 'trocar']],
  ];

  const service = serviceMap.find(([, keys]) => keys.some((key) => lower.includes(key)))?.[0] || '';
  const urgency = lower.includes('urgente') || lower.includes('vazando') || lower.includes('quebr')
    ? 'urgente'
    : lower.includes('rapido') || lower.includes('rápido') || lower.includes('logo')
      ? 'alta'
      : 'media';

  return {
    name: name ? name.charAt(0).toUpperCase() + name.slice(1) : '',
    phone,
    address,
    neighborhood: '',
    city: 'Maringá',
    service,
    availability: '',
    urgency,
    summary: [name && `Cliente ${name}`, service && `precisa de ${service.toLowerCase()}`, address && `em ${address}`]
      .filter(Boolean)
      .join(', ') || 'Mensagem recebida. Revise os dados antes de criar o lead.',
    suggestedActions: ['Confirmar dados do cliente', 'Agendar visita tecnica'],
    confidence: [name, phone, address, service].filter(Boolean).length / 4,
    source: 'fallback',
  };
};

export async function analyzeCustomerMessage(message) {
  if (!process.env.OPENAI_API_KEY) {
    return fallbackAnalyze(message);
  }

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
      input: [
        {
          role: 'system',
          content: [
            'Extraia dados comerciais de mensagens de clientes para uma empresa de esquadrias, aluminio, vidros, calhas e manutencao.',
            'Responda somente JSON valido, sem markdown.',
            'Use campos: name, phone, address, neighborhood, city, service, availability, urgency, summary, suggestedActions, confidence.',
            'urgency deve ser baixa, media, alta ou urgente. confidence deve ser numero entre 0 e 1.',
          ].join('\n'),
        },
        { role: 'user', content: message },
      ],
    }),
  });

  if (!response.ok) {
    return fallbackAnalyze(message);
  }

  const data = await response.json();
  const outputText = data.output_text || data.output?.flatMap((item) => item.content || []).map((content) => content.text).join('\n');

  try {
    return { ...JSON.parse(outputText), source: 'openai' };
  } catch {
    return { ...fallbackAnalyze(message), summary: outputText || fallbackAnalyze(message).summary, source: 'openai-text' };
  }
}
