# 💰 Palfin: Personal Finance Management App

**Palfin** is a cross-platform mobile and web application built with **React Native (Expo)** designed to help users manage their personal finances, track transactions, and visualize their spending habits. It provides an interactive dashboard and uses **Supabase** for secure backend authentication and data management.

---

## ✨ Features

* **User Authentication:** Secure signup, login, and session management using **Supabase Auth**.
* **Interactive Dashboard:** Provides a clear, at-a-glance overview of the user's current balance, monthly expenses, savings rate, and key financial metrics, driven by `dashboardData.json` (mock data).
* **Transaction Tracking:** Allows users to view a detailed history of their financial transactions (`TransactionHistory`).
* **Navigation:** Seamless routing between `home`, `dashboard`, `tools`, and `history` managed within `App.js`.
* **Cross-Platform UI:** Built with **Expo** to ensure a consistent experience across iOS, Android, and Web. 

---

## 🛠️ Technology Stack

| Category | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | **React Native (Expo)** | ~54.0.25 | Cross-platform development environment. |
| **Backend & Database** | **Supabase** (`@supabase/supabase-js`) | ^2.86.0 | Authentication, real-time database, and services. |
| **React** | **`react`** / **`react-native`** | 19.1.0 / 0.81.5 | Core UI library. |
| **Storage** | **`@react-native-async-storage/async-storage`** | ^2.2.0 | Local data persistence for user session and key values. |
| **Styling/Theme** | **`theme.js` & `sharedStyles.js`** | N/A | Centralized design system and custom fonts (e.g., 'Quintessential'). |

---

## 🚀 Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing.

### Prerequisites

You must have **Node.js** and the **Expo CLI** installed globally.

