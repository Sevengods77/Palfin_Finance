const API_URL = "http://localhost:3000";

export const authService = {
  async signup(name, email, password) {
    const res = await fetch(`${API_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    return res.json();
  },

  async login(email, password) {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  },

  async logout() {
    return;
  },

  async getCurrentUser() {
    const token = await localStorage.getItem('token');
    if (!token) return null;

    const res = await fetch(`${API_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.json();
  }
};
