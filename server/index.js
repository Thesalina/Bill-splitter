const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());

app.use('/api/groups', require('./routes/groupRoutes'));
app.use('/api/members', require('./routes/memberRoutes'));
app.use('/api/expenses', require('./routes/expenseRoutes'));
app.use('/api/split', require('./routes/splitRoutes'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected ✅');
    app.listen(5000, () => console.log('Server running on port 5000 🚀'));
  })
  .catch(err => console.log(err));