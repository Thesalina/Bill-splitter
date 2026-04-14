# 💸 Bill Splitter

A full-stack app to split expenses in a group — see who paid, who owes, and how much.

Built with **MongoDB, Express, React, Node.js (MERN)**.

---

## ✨ Features

- Create groups and add members
- Log expenses with who paid
- Auto-calculate who owes whom
- Clean React frontend UI

---

## 🛠️ Tech Stack

- **Frontend** — React
- **Backend** — Node.js, Express
- **Database** — MongoDB + Mongoose

---

## 🚀 Run Locally

```bash
# Clone the repo
git clone https://github.com/Thesalina/bill-splitter-api.git
cd bill-splitter-api

# Install dependencies
npm install

# Add your MongoDB URL in .env
MONGO_URI=mongodb://localhost:27017/bill_splitter

# Start the server
npm run dev
```

---

## 📡 API Endpoints

| Method | Endpoint | What it does |
|---|---|---|
| POST | `/api/groups` | Create a group |
| POST | `/api/members/:groupId` | Add a member |
| POST | `/api/expenses/:groupId` | Add an expense |
| GET | `/api/split/:groupId` | Get who owes whom |

---

## 👩‍💻 Made by Salina Bishwokarma

[GitHub](https://github.com/Thesalina) · [LinkedIn](https://www.linkedin.com/in/salina-bishwokarma-5bb0a91b9/)
