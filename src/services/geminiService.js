export const sendMessageToGemini = async (userMessage, contextData) => {
    const API_KEY = 'AIzaSyA59tvcW4yCSjxmOxbjK6oDbC48bRuB0XA';
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${API_KEY}`;

    const {
        balance,
        monthlyExpenses,
        transactions,
        monthlyIncome = 0,
        savingsGoal = 0,
        spendingByCategory = {}
    } = contextData;

    // Analyze spending patterns
    const totalSpent = transactions
        .filter(t => t.type === 'debit')
        .reduce((sum, t) => sum + (t.amount || 0), 0);

    const totalIncome = transactions
        .filter(t => t.type === 'credit')
        .reduce((sum, t) => sum + (t.amount || 0), 0);

    const savingsRate = totalIncome > 0
        ? ((totalIncome - totalSpent) / totalIncome * 100).toFixed(1)
        : 0;

    // Find top spending categories
    const categoryBreakdown = Object.entries(spendingByCategory)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([cat, amt]) => `${cat}: ₹${amt}`)
        .join(', ');

    // Detect spending patterns
    const recentDebits = transactions
        .filter(t => t.type === 'debit')
        .slice(0, 10);

    const frequentMerchants = recentDebits
        .reduce((acc, t) => {
            acc[t.merchant] = (acc[t.merchant] || 0) + 1;
            return acc;
        }, {});

    const topMerchant = Object.entries(frequentMerchants)
        .sort((a, b) => b[1] - a[1])[0];

    // Enhanced behavioral psychology-focused system prompt
    const systemContext = `
You are Finize, an expert financial behavioral coach using principles from behavioral economics and psychology.

📊 USER'S FINANCIAL SNAPSHOT:
- Current Balance: ₹${balance}
- Monthly Expenses: ₹${monthlyExpenses}
- Savings Rate: ${savingsRate}%
- Top Categories: ${categoryBreakdown || 'Not enough data'}
${topMerchant ? `- Frequent Merchant: ${topMerchant[0]} (${topMerchant[1]} visits)` : ''}

💰 RECENT TRANSACTIONS (Last 5):
${transactions.slice(0, 5).map(t =>
        `${t.type === 'debit' ? '📤' : '📥'} ₹${t.amount} - ${t.merchant} (${t.category})`
    ).join('\n')}

🎯 YOUR ROLE & BEHAVIORAL PSYCHOLOGY APPROACH:

1. **Quirky & Engaging Personality**:
   - Use emojis strategically (💸🎯💡🚀⚡)
   - Be conversational, witty, and supportive
   - Use gentle humor to make finance fun
   - Example: "Whoa! That's your 3rd coffee purchase this week ☕ - your wallet is getting jittery!"

2. **Behavioral Economics Techniques**:
   - **Mental Accounting**: Help categorize spending mindfully
   - **Loss Aversion**: Frame savings as "not losing" money
   - **Anchoring**: Compare current spending to past averages
   - **Present Bias**: Remind of future goals when present temptation strikes
   - **Social Proof**: "Most successful savers in your range..."

3. **Pattern Recognition & Insights**:
   - Spot unusual spending spikes
   - Identify emotional spending triggers
   - Detect subscription creep
   - Notice impulse purchase patterns
   - Track merchant frequency (brand loyalty vs. variety)

4. **Personalized Money-Saving Tips**:
   - Based on ACTUAL spending patterns
   - Actionable, specific advice (not generic)
   - Celebrate small wins
   - Suggest micro-habits (the "latte factor")

5. **SMS Transaction Extraction**:
   If user pastes SMS, extract:
   - Amount: [number]
   - Merchant: [business name]
   - Type: Credit/Debit
   - Category: [auto-classify]
   Then provide a quirky comment about it!

6. **Response Style**:
   - Keep it SHORT (2-3 sentences max for casual chat)
   - Be empathetic, never judgmental
   - Use "we" language ("Let's save together")
   - End with a micro-action or reflection question
   - For SMS: Extract + Quick behavioral insight

📈 BEHAVIORAL TRIGGERS TO WATCH:
- Weekend spending spikes
- Late-night purchases (impulse)
- Recurring small purchases (death by a thousand cuts)
- Emotional spending after debits
- Payday splurges

🎯 GOAL: Make the user feel understood, motivated, and empowered—not guilty or ashamed.

Remember: You're not a stern accountant, you're a supportive coach with behavioral psychology superpowers! 🦸‍♂️
`;

    const payload = {
        contents: [{
            parts: [{
                text: `${systemContext}\n\n---\n\nUser: ${userMessage}\n\nFinize (respond with personality!):`
            }]
        }],
        generationConfig: {
            temperature: 0.9, // More creative/quirky
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 250, // Keep responses concise
        }
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message || 'Gemini API Error');
        }

        const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text ||
            "🤔 I'm processing your financial vibes... tell me more!";

        return aiResponse;

    } catch (error) {
        console.error('Gemini Service Error:', error);

        // Fallback responses with personality
        const fallbacks = [
            "💭 Hmm, my financial intuition is loading... can you rephrase that?",
            "🔄 My money-brain needs a refresh! Try asking again?",
            "⚡ Connection hiccup! But I'm here - what's your finance question?"
        ];

        return fallbacks[Math.floor(Math.random() * fallbacks.length)];
    }
};

// BONUS: Helper function to analyze transaction and generate quirky comments
export const generateTransactionInsight = (transaction, recentHistory) => {
    const { amount, category, merchant, type } = transaction;

    const insights = {
        food: [
            `Another ${merchant} visit? Your taste buds are loyal! 🍕`,
            `₹${amount} on food - investing in happiness, I see! 😋`
        ],
        shopping: [
            `Retail therapy alert! ₹${amount} at ${merchant} 🛍️`,
            `That's a spicy purchase! Hope it sparks joy ✨`
        ],
        transport: [
            `On the move! ₹${amount} getting you places 🚗`,
            `Miles to go, money to spend! Safe travels 🛣️`
        ],
        entertainment: [
            `Fun fund activated! ₹${amount} for good vibes 🎉`,
            `You earned this treat! Enjoy responsibly 🎮`
        ],
        bills: [
            `Adulting level: Expert. Bill paid! ✅`,
            `₹${amount} keeping the lights on 💡`
        ]
    };

    const categoryInsights = insights[category.toLowerCase()] || [
        `₹${amount} spent wisely at ${merchant}!`,
        `Another day, another transaction! 💸`
    ];

    return categoryInsights[Math.floor(Math.random() * categoryInsights.length)];
};