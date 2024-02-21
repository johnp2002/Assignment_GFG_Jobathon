const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

const Transaction = require('./models/Transaction');
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());

const transactions = require('./controllers/Transactions');
const Statistics = require('./controllers/Statistics');
const getBarChartData = require('./controllers/getBarChartData');
const getPieChartData = require('./controllers/getPieChartData');
const combinedData = require('./controllers/combinedData');

// app.use('/transactions', transactions);

app.get('/initialize-database', async (req, res) => {
    
    return res.json({ message: 'Database already initialized' });

    try {
        const response = await fetch('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const data = await response.json();
        await Transaction.insertMany(data);
        res.json({ message: 'Database initialized with seed data', data });
    } catch (error) {
        res.status(500).json({ message: 'Failed to initialize database', error: error.message });
    }
});

app.get('/transactions',transactions )
app.get('/Statistics', Statistics)
app.get('/bargraph', getBarChartData)
app.get('/piegraph', getPieChartData)
app.get('/data', combinedData)



app.use((req, res, next) => {
    res.status(404).send("Sorry can't find that!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));