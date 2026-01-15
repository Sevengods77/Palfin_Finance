export const CATEGORY_KEYWORDS = {
    'Food & Dining': ['food', 'lunch', 'dinner', 'breakfast', 'burger', 'pizza', 'subway', 'zomato', 'swiggy', 'restaurant', 'cafe', 'coffee', 'tea', 'snacks', 'dining', 'mcdonalds', 'kfc', 'dominos', 'starbucks', 'briyani', 'hotel', 'mess'],
    'Groceries': ['grocery', 'groceries', 'bigbasket', 'blinkit', 'zepto', 'instamart', 'milk', 'fruits', 'vegetables', 'supermarket', 'mart', 'kirana', 'bread', 'egg', 'ration', 'reliance fresh', 'dmart'],
    'Transportation': ['cab', 'uber', 'ola', 'taxi', 'auto', 'bus', 'train', 'flight', 'ticket', 'fuel', 'petrol', 'diesel', 'parking', 'toll', 'metro', 'ride', 'rapido', 'yulu', 'scooter', 'bike', 'car'],
    'Bills & Utilities': ['bill', 'electricity', 'water', 'gas', 'recharge', 'wifi', 'broadband', 'mobile', 'internet', 'dth', 'rent', 'maintenance', 'bescom', 'bwssb', 'jio', 'airtel', 'vi', 'vodafone'],
    'Shopping': ['shop', 'store', 'amazon', 'flipkart', 'myntra', 'ajio', 'clothes', 'shirt', 'pant', 'shoes', 'accessories', 'toy', 'gift', 'electronics', 'mall', 'decathlon', 'zara', 'h&m', 'purchase', 'bought'],
    'Entertainment': ['movie', 'cinema', 'film', 'netflix', 'prime', 'spotify', 'game', 'subscription', 'event', 'ticket', 'show', 'bookmyshow', 'hotstar', 'youtube', 'playstation', 'xbox'],
    'Healthcare': ['doctor', 'pharmacy', 'medicine', 'hospital', 'clinic', 'gym', 'fitness', 'yoga', 'test', 'lab', 'medical', 'pharmeasy', 'cult', 'apollo', '1mg'],
    'Travel': ['hotel', 'stay', 'booking', 'trip', 'tour', 'vacation', 'resort', 'airbnb', 'makemytrip', 'goibibo', 'easemytrip', 'irctc'],
    'Education': ['school', 'college', 'fee', 'course', 'book', 'stationery', 'udemy', 'coursera', 'tuition', 'class', 'learning', 'workshop'],
    'Family Support': ['mother', 'father', 'sister', 'brother', 'parent', 'family', 'relative', 'mom', 'dad', 'bro', 'sis', 'cousin', 'wife', 'husband', 'son', 'daughter'],
    'Celebration': ['diwali', 'birthday', 'wedding', 'gift', 'festival', 'party', 'rakhi', 'holi', 'christmas', 'new year', 'anniversary', 'celebration', 'treat'],
    'Salary/Income': ['salary', 'bonus', 'credit', 'interest', 'dividend', 'refund', 'income', 'paycheck', 'stipend', 'earnings'],
    'Investment': ['stocks', 'mutual fund', 'sip', 'fd', 'investment', 'zerodha', 'groww', 'upstox', 'coin'],
    'Rent': ['rent', 'landlord', 'house rent', 'office rent', 'rental'],
};

// Common typos and their corrections
const TYPO_MAP = {
    'mo r': 'Mother', 'motr': 'Mother', 'mothr': 'Mother',
    'fa her': 'Father', 'fathr': 'Father',
    'sist r': 'Sister', 'sistr': 'Sister',
    'brot er': 'Brother', 'brothr': 'Brother',
    'swigyy': 'Swiggy', 'swigy': 'Swiggy', 'zomto': 'Zomato',
    'amazn': 'Amazon', 'amzn': 'Amazon',
    'netflx': 'Netflix',
    'ubr': 'Uber',
    'diw li': 'Diwali', 'divali': 'Diwali', 'deepavali': 'Diwali',
    'rsturnt': 'Restaurant',
    'l kh': 'lakh', 'lack': 'lakh',
    'too thousand': '2000'
};

// Number words validation
const NUMBER_WORDS = {
    'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
    'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
    'eleven': 11, 'twelve': 12, 'thirteen': 13, 'fourteen': 14, 'fifteen': 15,
    'sixteen': 16, 'seventeen': 17, 'eighteen': 18, 'nineteen': 19, 'twenty': 20,
    'thirty': 30, 'forty': 40, 'fifty': 50, 'sixty': 60, 'seventy': 70, 'eighty': 80, 'ninety': 90,
    'hundred': 100, 'thousand': 1000, 'lakh': 100000, 'lac': 100000, 'crore': 10000000,
    'k': 1000
};

const cleanText = (text) => {
    let cleaned = text.toLowerCase();
    // Fix typos first
    Object.keys(TYPO_MAP).forEach(typo => {
        cleaned = cleaned.replace(new RegExp(typo, 'g'), TYPO_MAP[typo].toLowerCase());
    });
    return cleaned;
};

const parseAmount = (text) => {
    text = cleanText(text);

    // 1. Direct Pattern: "2.5 lakhs", "10k", "50 thousand", "1.5 crore"
    const multiplierRegex = /(\d+(?:\.\d+)?)\s*(k|thousand|lakh|lac|crore|hundred)s?/i;
    const multiplierMatch = text.match(multiplierRegex);

    if (multiplierMatch) {
        const val = parseFloat(multiplierMatch[1]);
        const unit = multiplierMatch[2].toLowerCase();
        let multiplier = 1;
        if (unit.startsWith('k') || unit === 'thousand') multiplier = 1000;
        if (unit === 'hundred') multiplier = 100;
        if (unit.startsWith('lakh') || unit === 'lac') multiplier = 100000;
        if (unit === 'crore') multiplier = 10000000;
        return val * multiplier;
    }

    // 2. Word Conversion: "one lakh", "fifty thousand"
    // Heuristic: identify numbers in words and convert. This is complex for full NLP, 
    // but we can handle simple cases like "fifty thousand" or "five hundred".
    // A simplified approach: replace known number words with digits then re-run regex could work, 
    // or specifically look for combos.
    // Let's handle simple "word + unit" like "fifty thousand".
    const wordUnitRegex = /([a-z]+)\s*(hundred|thousand|lakh|crore)s?/i;
    const wordMatch = text.match(wordUnitRegex);
    if (wordMatch) {
        const numberWord = wordMatch[1];
        const unit = wordMatch[2];
        if (NUMBER_WORDS[numberWord] && NUMBER_WORDS[unit]) {
            return NUMBER_WORDS[numberWord] * NUMBER_WORDS[unit];
        }
    }

    // Handle "fifteen hundred" -> 15 * 100
    const wordWordRegex = /([a-z]+)\s+([a-z]+)/i;
    // This is too broad, let's stick to specific known patterns or fallback to digits.

    // 3. Standard Regex for Digits (with optional currency symbols)
    // Matches: 1,50,000 | 5000.50 | 500
    // Remove commas first
    const cleanNumbers = text.replace(/,/g, '');
    const amountRegex = /(?:rs\.?|inr|₹)?\s*(\d+(?:\.\d{2})?)/i;
    // We need to capture the *best* number. Usually the first one associated with currency, or just the first number if distinct.
    // Let's try to find a number that isn't a date (e.g. 15-Jan) or phone number.
    // Date regex to exclude dates
    const datePattern = /\d{2}[-/]\d{2}/;

    // Split by spaces and look for valid numbers
    const tokens = cleanNumbers.split(/\s+/);
    for (let token of tokens) {
        // Strip symbols
        let raw = token.replace(/[₹rs:inr]/gi, '');
        if (!isNaN(raw) && raw !== '' && !datePattern.test(token)) {
            // Check if it looks like a phone number (10 digits starting with 6-9) - simple heuristic
            if (raw.length === 10 && raw > 6000000000) continue;
            // Check if year
            if (raw.length === 4 && (raw.startsWith('202') || raw.startsWith('203'))) continue; // Likely year

            return parseFloat(raw);
        }
    }

    // Fallback to strict regex if token parsing fails but something exists
    const strictMatch = cleanNumbers.match(/(\d+(?:\.\d+)?)/);
    if (strictMatch) return parseFloat(strictMatch[1]);

    return 0;
};

const parseMerchant = (text, category) => {
    let clean = cleanText(text);

    // 1. Regex Extraction: "at X", "to X", "from X"
    // We prioritize "at", then "to"/"from" depending on context, but generally they indicate the entity.
    const merchantRegex = /(?:at|to|from|via|paid)\s+([a-z0-9\s&]+?)(?:\s+(?:for|on|using|by|in)|$)/i;
    const match = clean.match(merchantRegex);

    let merchant = match ? match[1].trim() : '';

    // If no preposition match, we might use the category as a fallback or look for Proper Nouns (difficult in lower case).
    // Try to find known merchants from keywords? 
    // Actually, lets check if any words in text match known merchant keywords in our CATEGORY_KEYWORDS (like 'swiggy', 'uber')
    // If we find a known entity, use it as merchant.

    for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
        for (const word of keywords) {
            if (clean.includes(word) && word.length > 3) { // >3 to avoid short common words
                // Check if it's a specific brand/name vs generic
                // Heuristic: if it's a brand name, use it. 
                // List of generic words to NOT set as merchant:
                const generics = ['food', 'lunch', 'dinner', 'cab', 'auto', 'bill', 'shop', 'movie', 'doctor', 'school', 'rent'];
                if (!generics.includes(word)) {
                    // Start Case
                    return word.charAt(0).toUpperCase() + word.slice(1);
                }
            }
        }
    }

    if (!merchant) {
        // Fallback: If we have a detected category, maybe "Unknown [Category]"
        if (category && category !== 'General') return category; // e.g. "Rent"
        return "Unknown Merchant";
    }

    // Cleaning common filler words from captured merchant
    const fillers = ['my', 'the', 'a', 'an', 'rs', 'rupees', 'inr'];
    fillers.forEach(f => {
        if (merchant.startsWith(f + ' ')) merchant = merchant.slice(f.length + 1);
    });

    // Validations
    if (merchant.length < 2) return "Unknown Merchant";

    // Title Case
    return merchant.replace(/\b\w/g, c => c.toUpperCase());
};

export const getCategoryFromKeywords = (text, merchant) => {
    const clean = cleanText(text + ' ' + (merchant || ''));

    // Check strict prioritized list
    const priorities = [
        'Celebration', 'Rent', 'Salary/Income', 'Investment', 'Family Support',
        'Healthcare', 'Travel', 'Education', 'Bills & Utilities',
        'Groceries', 'Food & Dining', 'Transportation', 'Entertainment', 'Shopping'
    ];

    for (const cat of priorities) {
        const keywords = CATEGORY_KEYWORDS[cat];
        if (keywords.some(k => clean.includes(k))) {
            return cat;
        }
    }

    return 'General';
};

const parseType = (text, category) => {
    const clean = text.toLowerCase();

    if (category === 'Salary/Income') return 'credit';
    if (['received', 'credited', 'got', 'income', 'refund', 'deposit'].some(w => clean.includes(w))) {
        // Double check context: "received from" vs "sent to"
        // "received payment" -> credit
        return 'credit';
    }

    // Default debit
    return 'debit';
};

export const extractTransactionDetails = (text) => {
    if (!text) return null;

    const amount = parseAmount(text);

    // Preliminary categorization to help with merchant extraction (sometimes)
    // but usually we extract merchant first. 
    // Let's do a pass of categorization first to see if it helps.
    let category = getCategoryFromKeywords(text, ''); // Pass empty merchant first

    const merchant = parseMerchant(text, category);

    // Re-categorize with merchant info found (e.g. if merchant is "Swiggy", it confirms Food)
    category = getCategoryFromKeywords(text, merchant);

    const type = parseType(text, category);

    return {
        amount: parseFloat(amount.toFixed(2)),
        merchant: merchant,
        category: category,
        type: type,
        notes: text, // Saving original text as notes/context
        date: new Date().toISOString().split('T')[0]
    };
};
