// Finize service that calls Gemini for personalised, spending-aware advice.

const logs = [];

const GEMINI_API_KEY = "AIzaSyBcBzgKpdqThB31qs3zWmkT1RyES5kqrj8";
const GEMINI_MODEL = 'gemini-2.5-flash-lite';

function formatTransactionsContext(transactions = []) {
  if (!Array.isArray(transactions) || !transactions.length) {
    return 'No detailed transaction data was provided.';
  }

  const total = transactions.reduce((s, t) => s + Number(t.amount || 0), 0);
  const recent = transactions.slice(-10).map((t, idx) => {
    const amt = Number(t.amount || 0);
    const desc = t.description || t.merchant || t.category || 'Transaction';
    const date = t.date || t.created_at || '';
    const category = t.category || '';
    return `${idx + 1}. ${desc} — ₹${amt.toFixed(2)}${
      category ? ` [${category}]` : ''
    }${date ? ` on ${date}` : ''}`;
  });

  return [
    `Total spending in the current period (approx): ₹${total.toFixed(2)}.`,
    `Recent transactions (most recent last, up to 10):`,
    ...recent,
  ].join('\n');
}

function formatFinancialSnapshot(snapshot) {
  if (!snapshot || typeof snapshot !== 'object') return 'No additional budget/savings snapshot is available.';

  const lines = [];

  if (typeof snapshot.monthlySpend === 'number') {
    lines.push(`Current monthly spend (from dashboard): ₹${snapshot.monthlySpend.toFixed(2)}.`);
  }
  if (typeof snapshot.budget === 'number') {
    lines.push(`Approximate monthly budget: ₹${snapshot.budget.toFixed(2)}.`);
  }
  if (typeof snapshot.budgetProgress === 'number') {
    lines.push(`Budget progress: about ${snapshot.budgetProgress}% of the budget used.`);
  }
  if (typeof snapshot.savings === 'number') {
    lines.push(`Estimated savings balance: ₹${snapshot.savings.toFixed(2)}.`);
  }
  if (snapshot.level) {
    lines.push(`Gamification level: ${snapshot.level}.`);
  }
  if (typeof snapshot.streak === 'number') {
    lines.push(`Tracking streak: ${snapshot.streak} days.`);
  }
  if (typeof snapshot.points === 'number') {
    lines.push(`Reward points: ${snapshot.points}.`);
  }

  return lines.length ? lines.join('\n') : 'No additional budget/savings snapshot is available.';
}

function buildGeminiPayload(message, transactions, user, history = [], snapshot = null) {
  const userId = (user && (user.email || user.id)) || 'anonymous';
  const txContext = formatTransactionsContext(transactions);
  const snapshotText = formatFinancialSnapshot(snapshot);

  const systemInstruction = `
You are Finize, a friendly, behaviourally-informed personal finance coach for an Indian user.
- Focus on **how the user spends money** and give concrete, rupee-denominated suggestions.
- Use the transaction context when available, but do **not** invent exact balances that are not in the data.
- Help the user "spend" their money more intentionally: re-allocate wasteful expenditure into savings, goals, or debt repayment.
- Keep answers short, practical, and conversational. Never mention that you are an AI model.

User identifier: ${userId}

Transaction context:
${txContext}

Financial snapshot (from app-level metrics):
${snapshotText}
`.trim();

  const historyContents = Array.isArray(history)
    ? history.map((m) => ({
        role: m.from === 'finize' ? 'model' : 'user',
        parts: [{ text: String(m.text || '') }],
      }))
    : [];

  return {
    contents: [
      { role: 'user', parts: [{ text: systemInstruction }] },
      ...historyContents,
      { role: 'user', parts: [{ text: String(message || '') }] },
    ],
  };
}

async function callGemini(message, transactions, user, history = [], snapshot = null) {
  if (!GEMINI_API_KEY) throw new Error('Gemini API key is not configured.');

  const payload = buildGeminiPayload(message, transactions, user, history, snapshot);
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Gemini error: ${res.status}`);
  }

  const data = await res.json();

  return (
    data?.candidates?.[0]?.content?.parts?.map((p) => p.text || '').join(' ').trim() ||
    'Gemini returned an empty response.'
  );
}

export async function getResponse(message, transactions = [], user = null, history = [], snapshot = null) {
  const text = await callGemini(message, transactions, user, history, snapshot);
  const entry = {
    ts: Date.now(),
    user: user ? user.email || user.id || 'anon' : 'anon',
    message,
    response: text,
  };
  logs.push(entry);
  return { response: text, entry };
}

export function getLogs() {
  return logs.slice();
}

export function clearLogs() {
  logs.length = 0;
}

// Mock training endpoint
export async function trainMock() {
  return { status: 'ok', trainedOn: logs.length };
}
