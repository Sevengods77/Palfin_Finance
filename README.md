# 💰 Palfin - Your Personal Finance Pal

<div align="center">

![Palfin Logo](./assets/Palfin_logo.png)

**Simplify Your Money, Amplify Your Savings**

[![License](https://img.shields.io/badge/license-0BSD-blue.svg)](LICENSE)
[![Expo](https://img.shields.io/badge/Expo-~54.0-000020.svg?style=flat&logo=EXPO&labelColor=fff)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React%20Native-0.81.5-61DAFB.svg?style=flat&logo=react)](https://reactnative.dev/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

[✨ Features](#-features) • [🚀 Installation](#-installation) • [📖 Usage](#-usage) • [🛠️ Tech Stack](#️-tech-stack) • [🤝 Contributing](#-contributing)

</div>

---

## 🎯 What is Palfin?

**Palfin** (Your **Pal** for **Fin**ances) is a modern, intelligent personal finance management application designed to make expense tracking effortless and insightful. Built with React Native and Expo, Palfin brings the power of AI-assisted financial tracking to your fingertips - whether you're on web, iOS, or Android.

Gone are the days of manually entering every expense. With **Fintel Voice Recognition** and **SMS Transaction Extraction**, Palfin automatically captures and categorizes your transactions, giving you real-time insights into your spending habits without the hassle.

### 🌟 Why Palfin?

- 🗣️ **Voice-Powered**: Speak your expenses naturally - "Spent 500 rupees on groceries"
- 📱 **SMS-Intelligent**: Paste bank SMS messages and watch them transform into organized data
- 🤖 **AI-Coached**: Get personalized behavioral coaching from Finize, your financial companion
- 📊 **Visual Insights**: Beautiful charts and analytics to understand where your money goes
- 🎯 **Goal-Oriented**: Set savings goals and track your progress in real-time
- 🔒 **Secure**: Built with Supabase authentication for enterprise-grade security

---

## ✨ Features

### 🎙️ **Fintel Voice Capture**
Transform your voice into organized financial data with our cutting-edge voice recognition system.

**How it works:**
1. **Press & Hold** the microphone button
2. **Speak naturally**: "Paid 1,200 for electricity bill" or "Spent 500 on BigBasket groceries"
3. **Review & Confirm**: Fintel automatically extracts amount, category, and merchant
4. **Save**: Your transaction is instantly added to your dashboard

**Technical Magic:**
- Uses Web Speech API for browser-based recognition
- Intelligent NLP parsing to extract transaction details
- Real-time transcription with editable text input
- Auto-categorization using smart keyword matching
- Supports Indian context (₹ rupees, local merchants)

### 📱 **TransExtract - SMS Transaction Extractor**
Never manually enter bank transactions again! Our SMS parser understands Indian banking formats.

**How it works:**
1. **Copy** your bank transaction SMS (e.g., "Your A/C XXX1234 debited with Rs.500 at AMAZON")
2. **Paste** into TransExtract
3. **Extract**: Advanced regex patterns identify:
   - Amount (with commas, decimals, currency symbols)
   - Transaction type (debit/credit)
   - Merchant name
   - Date and reference number
4. **Auto-categorize**: Smart categorization assigns the right category
5. **Dashboard Update**: Watch your balance and stats update in real-time

**Supported Patterns:**
- Multiple currency formats: Rs., INR, ₹
- Transaction types: debited, credited, paid, received
- Merchant extraction from "at", "to", "from" keywords
- Reference/Transaction ID parsing
- Date format flexibility (DD-MM-YYYY, DD/MM/YY, etc.)

### 🤖 **Finize - Your Behavioral Finance Coach**
Meet Finize, your AI-powered financial companion that provides personalized tips and coaching.

**Capabilities:**
- **Daily Tips**: Get contextual financial wisdom based on your spending patterns
- **Behavioral Insights**: Understand psychological triggers behind your spending
- **Goal Support**: Motivation and strategies to reach your savings targets
- **Chat Interface**: Floating corner widget - always available, never intrusive
- **Smart Responses**: Powered by Gemini AI for intelligent, personalized advice

**How it works:**
Simply click the "Behavioral Coach" button or open the floating chat widget to:
- Ask questions about your finances
- Get spending analysis
- Receive encouragement on your financial journey
- Learn budgeting strategies

### 📊 **Category Analytics & Pie Charts**
Visualize your spending patterns with beautiful, interactive charts.

**Features:**
- **Category Breakdown**: See exactly where your money goes
- **Visual Clarity**: Color-coded pie charts using React Native Chart Kit
- **Smart Categorization**: Automatic assignment to categories like:
  - 🍔 Food & Dining
  - 🚗 Transportation
  - 🛒 Shopping
  - 💡 Utilities
  - 🏥 Health & Wellness
  - 🎮 Entertainment
  - 📱 Subscriptions
  - And more...

### 🎯 **Goal Setting & Progress Tracking**
Set financial goals and watch your progress in real-time.

**Features:**
- Create custom savings goals
- Visual progress bars
- Percentage completion tracking
- Automatic balance-to-goal calculations
- Motivational milestones

### 📈 **Smart Dashboard**
Your financial command center with real-time metrics.

**Dashboard Highlights:**
- **Current Balance**: See your available funds at a glance
- **Monthly Spend**: Track this month's expenses with trend indicators
- **Savings Rate**: Monitor your savings percentage
- **Streak Counter**: Gamified daily tracking motivation
- **Recent Transactions**: Quick view of your latest activity
- **Pull-to-Refresh**: Always have the latest data

### 🔐 **Secure Authentication**
Peace of mind with Supabase-powered authentication.

**Security Features:**
- Email/password authentication
- Secure session management
- Real-time auth state synchronization
- Automatic token refresh
- Logout from anywhere

---

## 🚀 Installation

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Expo CLI** (or use `npx`)
- **Git**

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/palfin.git
   cd palfin
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory (if not using Supabase, skip this):
   ```env
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**
   ```bash
   # For web
   npm run web
   
   # For iOS (macOS only)
   npm run ios
   
   # For Android
   npm run android
   
   # Or start Expo and choose platform
   npm start
   ```

5. **Access the application**
   - **Web**: Opens automatically at `http://localhost:8081` (or similar)
   - **Mobile**: Scan QR code with Expo Go app

### 📦 Build for Production

```bash
# Web build
expo build:web

# iOS build
expo build:ios

# Android build
expo build:android
```

---

## 🌐 Website

🚀 **Coming Soon!** We're working on a beautiful landing page and web app deployment.

For now, you can run the web version locally using:
```bash
npm run web
```

---

## 📖 Usage

### Getting Started

1. **Sign Up/Login**
   - Open the app and click "Sign Up"
   - Enter your email and password
   - Verify your email (if using Supabase)

2. **Set Initial Balance**
   - Navigate to Goal Setting
   - Set your starting balance and savings goal

3. **Start Tracking!**
   Choose your preferred method:

### Method 1: Voice Input (Fintel)
```
You: "Spent 250 on coffee"
Fintel: ✅ Captured!
        Amount: ₹250
        Category: Food & Dining
        Merchant: Coffee Expense
```

### Method 2: SMS Extraction
```
Paste: "Your A/C XX1234 debited Rs.1,500 at ZOMATO on 15-01-26"
Result: ✅ Transaction Added!
        Amount: ₹1,500
        Merchant: ZOMATO
        Category: Food & Dining
```

### Method 3: Chat with Finize
```
You: "How much did I spend on food this month?"
Finize: "You've spent ₹4,500 on food this month, which is
         15% higher than last month. Consider meal prepping
         to reduce dining out expenses!"
```

---

## 🛠️ Tech Stack

### Frontend
- **React Native** (0.81.5) - Cross-platform mobile framework
- **React** (19.1.0) - UI library
- **Expo** (~54.0) - Development and build platform
- **React Native Web** - Web deployment

### UI/UX
- **React Native Chart Kit** - Beautiful charts
- **React Native SVG** - Custom graphics
- **Expo AV** - Audio/video capabilities
- **Custom Theme System** - Consistent design language
- **Google Fonts** (Quintessential) - Typography

### Backend & Services
- **Supabase** - Authentication and backend
- **AsyncStorage** - Local data persistence
- **Gemini AI** - Intelligent coaching (via API)

### Data Processing
- **Custom NLP Parser** - Transaction text extraction
- **Regex-based SMS Parser** - Bank message processing
- **Category Classifier** - Smart categorization engine
- **Local JSON Store** - Fast local data access

---

## 📱 Platform Support

| Platform | Status | Notes |
|----------|--------|-------|
| 🌐 Web | ✅ Fully Supported | Best experience on modern browsers |
| 📱 iOS | ✅ Supported | Via Expo Go or standalone build |
| 🤖 Android | ✅ Supported | Via Expo Go or standalone build |

---

## 🎨 Design Philosophy

Palfin follows modern design principles:
- **Dark Mode First**: Beautiful, easy-on-the-eyes interface
- **Glassmorphism**: Subtle transparency and blur effects
- **Micro-interactions**: Smooth animations and feedback
- **Accessible**: Color contrast and readable fonts
- **Mobile-First**: Responsive design that works everywhere

---

## 🗺️ Roadmap

### Version 2.0 (Upcoming)
- [ ] Bank API integration for automatic transaction sync
- [ ] Budget templates and recommendations
- [ ] Recurring expense detection
- [ ] Export to CSV/Excel
- [ ] Multi-currency support
- [ ] Bill reminders and alerts

### Version 3.0 (Future)
- [ ] Social features - share goals with friends
- [ ] Investment tracking
- [ ] Tax calculation assistance
- [ ] Receipt scanning with OCR
- [ ] Desktop apps (Electron)

---

## 🤝 Contributing

We love contributions! Whether it's:
- 🐛 Bug reports
- 💡 Feature suggestions
- 📝 Documentation improvements
- 🔧 Code contributions

**How to contribute:**

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

---

## 📄 License

This project is licensed under the **0BSD License** - see the [LICENSE](LICENSE) file for details.

TL;DR: Do whatever you want with this code. No restrictions, no attribution required. We just want to help people manage their finances better! 💚

---

## 🙏 Acknowledgments

- **Expo Team** - For the amazing development platform
- **Supabase** - For the awesome backend-as-a-service
- **Google Gemini** - For powering our AI coach
- **React Native Community** - For the fantastic ecosystem
- **You!** - For using Palfin and making finance tracking easier

---

## 📞 Contact & Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/palfin/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/palfin/discussions)
- **Email**: support@palfin.app (coming soon)

---

<div align="center">

### Made with ❤️ and ☕ by the Palfin Team

**Star ⭐ this repo if you find it helpful!**

</div>
