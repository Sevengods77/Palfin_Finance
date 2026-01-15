# 🚀 Palfin Demo Walkthrough Guide

Use this guide to effectively demonstrate the powerful AI features of Palfin. Each section provides **scripts** and **scenarios** to showcase the advanced capabilities of the app.

---

## 🎙️ 1. Fintel Voice Capture Demo
**Goal:** Show how the app understands natural language, Indian context, and messy speech.

### Scenario A: The "Messy" Natural Speaker
*Demonstrates: Robust parsing, typo correction, and keyword extraction.*

**Say this:**
> "Umm, I spent, uh, 1.5 thousand rupees for dinner at swigyy... actually no, make it Swiggy... yesterday."

**What to highlight:**
- **Amount extraction:** It correctly understands "1.5 thousand" as **1500**.
- **Merchant correction:** Typo "swigyy" becomes **Swiggy**.
- **Categorization:** Automatically assigns **Food & Dining**.

### Scenario B: The "Indian Context" (Lakhs & Crores)
*Demonstrates: Understanding local numbering system.*

**Say this:**
> "Paid 2.5 lakhs as advance for the new flat rent to landlord."

**What to highlight:**
- **Indian Numbering:** Parses "2.5 lakhs" as **2,50,000**.
- **Context:** Identifying "landlord" and keywords like "rent".
- **Category:** Automatically assigns **Rent**.

### Scenario C: Family & Celebration
*Demonstrates: Social context understanding.*

**Say this:**
> "Sent 5000 to my sister for rakhi gift."

**What to highlight:**
- **Merchant:** Extracts "Sister" (Family).
- **Category:** "Rakhi" triggers **Celebration**.
- **Type:** Correctly identifies as a Debit ("Sent").

---

## 📱 2. TransExtract (SMS Parser) Demo
**Goal:** Show specific, complex SMS patterns that would break normal regex parsers but work with your AI.

**Copy & Paste these exact texts to impress:**

### 🔹 Example 1: Complex Merchant & Date
```text
Your A/c XX8932 is debited with INR 2,499.00 on 15-JAN-26. Info: NETFLIX.COM*SUBSCRIPTION. Bal: 45,000
```
**Result:**
- **Merchant:** Netflix
- **Category:** Entertainment
- **Amount:** 2499

### 🔹 Example 2: Salary Credit (Income)
```text
Rs 1,25,000 credited to ac XX1234 on 30/01/26 by TATA CONSULTANCY SERVICES - SALARY JAN. Avail Bal: 2,50,000.
```
**Result:**
- **Merchant:** Tata Consultancy Services
- **Category:** Salary/Income
- **Type:** Credit (Green/Income)

### 🔹 Example 3: Ambiguous Text with Typonyms
```text
Imps ref 128938 debit of rs 450 to uber ride... thanks for riding
```
**Result:**
- **Merchant:** Uber
- **Category:** Transportation
- **Amount:** 450

---

## 🤖 3. Finize Chatbot & Behavioral Coach
**Goal:** Show the "Personality" and "Financial Wisdom" of the bot.

**Ask these questions to get the best responses:**

### 🧠 Behavioral Psychology
**User:** "Why can't I stop ordering food online?"
**Finize:** Watch it explain the "Pain of Paying" ensuring friction-less payments make you spend more, and suggest deleting saved cards!

### 📊 Data Analysis
**User:** "How much did I spend on food this month?"
**Finize:** It will look at your actual dashboard data (e.g., the Swiggy/Zomato entries) and calculate the total, often adding a witty comment like "That's a lot of biryani! 🍗"

### 💡 Specific Advice
**User:** "I want to save for a trip to Goa."
**Finize:** It might suggest the "50/30/20 rule" or tell you exactly how much to cut from your 'Entertainment' budget based on your recent Netflix/Shopping data.

### ⚡ Troubleshooting / Fun
**User:** "What is money?"
**(If working):** You get a philosophical answer.
**(If error):** "Hmm, my financial intuition is loading..." (Shows graceful error handling).

---

## 📊 4. Category & Analytics Demo
**Goal:** Show the visual impact of the data.

1. **Populate Data First:**
   - Use Fintel to add a big "Rent" expense (e.g., 20k).
   - Use SMS to add "Shopping" (e.g., 5k).
   - Add "Food" (e.g., 2k).

2. **Open "View Categories" (Pie Chart):**
   - **Visual Balance:** Show how `Rent` dominates the chart (Real-time update).
   - **Click Logic:** Tap on the 'Food' slice to see the specific percentage.

3. **Show "Goal Progress":**
   - If you added the "Salary" credit earlier, show how the **"Savings Rate"** and **"Monthly Income"** stats on the dashboard instantly jumped up.
