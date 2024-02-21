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

// List all transactions with search and pagination
// List all transactions with search and pagination
// app.get('/transactions', async (req, res) => {
    
//     const data = await Transaction.find().limit(10).sort({ date: -1 });
//     return res.json(data);
// });
// app.get('/transactions', async (req, res) => {
//     try {
//         const { search = '', page = 1, perPage = 10 } = req.query;
//         console.log(search, page, perPage)
//         // Define the search criteria
//         const searchCriteria = {
//             $or: [
//                 { title: { $regex: search, $options: 'i' } },
//                 { description: { $regex: search, $options: 'i' } },
//                 { price: { $regex: search, $options: 'i' } }
//             ]
//         };

//         // If search parameter is empty, remove it from the criteria
//         if (search === '') {
//             delete searchCriteria.$or;
//         }

//         // Query the database based on search criteria and pagination
//         const totalCount = await Transaction.countDocuments(searchCriteria);
//         const totalPages = Math.ceil(totalCount / perPage);
//         const transactions = await Transaction.find(searchCriteria)
//             .skip((page - 1) * perPage)
//             .limit(perPage);

//         res.json({
//             message: 'List of transactions',
//             search,
//             page,
//             perPage,
//             totalPages,
//             totalCount,
//             transactions
//         });
//     } catch (error) {
//         res.status(500).json({ message: 'Failed to fetch transactions', error: error.message });
//     }
// });
// app.get('/transactions', async (req, res) => {
//     //good but price problem was occuring in price
//     try {
//         const { search = '', page = 1, perPage = 10 } = req.query;
//         console.log(search, page, perPage)
//         // Define the search criteria
//         const searchCriteria = {
//             $or: [
//                 { title: { $regex: search, $options: 'i' } },
//                 { description: { $regex: search, $options: 'i' } }
//             ]
//         };

//         // If search parameter is empty, remove it from the criteria
//         if (search === '') {
//             delete searchCriteria.$or;
//         } else {
//             // If search is not empty, also include price filtering if it's a valid number
//             const parsedPrice = parseFloat(search);
//             if (!isNaN(parsedPrice)) {
//                 searchCriteria.$or.push({ price: parsedPrice });
//             }
//         }

//         // Query the database based on search criteria and pagination
//         const totalCount = await Transaction.countDocuments(searchCriteria);
//         const totalPages = Math.ceil(totalCount / perPage);
//         const transactions = await Transaction.find(searchCriteria)
//             .skip((page - 1) * perPage)
//             .limit(perPage);

//         res.json({
//             message: 'List of transactions',
//             search,
//             page,
//             perPage,
//             totalPages,
//             totalCount,
//             transactions
//         });
//     } catch (error) {
//         res.status(500).json({ message: 'Failed to fetch transactions', error: error.message });
//     }
// });

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