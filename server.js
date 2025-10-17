require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { sequelize } = require('./config/db');
const authRoutes = require('./routes/auth');
const assignmentRoutes = require('./routes/assignments');
const submissionRoutes = require('./routes/submissions');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/assignments', assignmentRoutes);
app.use('/assignments', submissionRoutes);

// Simple health endpoint
app.get('/health', (req, res) => res.status(200).send('OK'));

// Global error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'server error' });
});

const PORT = process.env.PORT || 4000;

async function start(){
  try{
    await sequelize.authenticate();
    console.log('Connected to DB');
    // sync models
    await sequelize.sync();
    app.listen(PORT, ()=> console.log('Server running on port', PORT));
  }catch(e){
    console.error('Failed to start', e);
    process.exit(1);
  }
}

start();
