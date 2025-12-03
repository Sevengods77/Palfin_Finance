// Simple in-memory Finize service that returns heuristic behavioral nudges
// and stores a local conversation log. This is a mock service to simulate
// RL/behavioral responses until a real backend/model is connected.

const logs = [];

function simplePolicy(message, transactions = []) {
  const msg = (message || '').toLowerCase();

  // If user asks about saving or budget
  if (/(save|saving|budget|spend less|help me save)/i.test(msg)) {
    // analyze transactions quickly
    const total = transactions.reduce((s, t) => s + Number(t.amount || 0), 0);
    if (total > 10000) return `I see your spending this period is ₹${Math.round(total)} — consider setting a weekly budget and pausing non-essential subscriptions.`;
    if (total > 5000) return `You're spending moderately; try tracking one category this week and reduce impulse buys.`;
    return `Great job — continue maintaining your habits. Try saving a fixed percentage each paycheck.`;
  }

  // If user asks about a transaction or merchant
  if (/starbucks|coffee|cafe|restaurant/i.test(msg)) {
    return `Looks like a dining purchase — try switching one dine-out per week into a home-cooked option to save ~₹500/month.`;
  }

  // Default friendly response
  return `Hi — I'm Finize. I can analyze your spending patterns and provide behaviourally-informed nudges. Ask me things like 'How can I save this month?'`;
}

export async function getResponse(message, transactions = [], user = null) {
  const response = simplePolicy(message, transactions);
  const entry = { ts: Date.now(), user: user ? user.email || 'anon' : 'anon', message, response };
  logs.push(entry);
  return { response, entry };
}

export function getLogs() { return logs.slice(); }

export function clearLogs() { logs.length = 0; }

// Mock training endpoint — in real world this would train an RL model using logs
export async function trainMock() {
  // pretend to run training
  return { status: 'ok', trainedOn: logs.length };
}
