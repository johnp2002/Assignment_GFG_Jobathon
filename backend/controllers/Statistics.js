const Transaction = require('../models/Transaction');

module.exports = async function getTransactionsByMonth(req, res) {
    try {
        const month = Number(req.query.month);

        // Array of month names
        const monthNames = [
            "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
        ];

        // Fetch all transactions from the database
        const allTransactions = await Transaction.find({});

        // Filter transactions by month
        const transactionsInMonth = allTransactions.filter(transaction => {
            const transactionMonth = new Date(transaction.dateOfSale).getUTCMonth(); // Zero-based month index
            return transactionMonth === month - 1; // Subtract 1 to match the zero-based index
        });

        console.log(`Found ${transactionsInMonth.length} transactions for month ${month}`);

        if (transactionsInMonth.length === 0) {
            console.log("No transactions found for the specified month.");
        }

        // Calculate total sale amount
        const totalSaleAmount = transactionsInMonth.reduce((total, transaction) => {
            return total + transaction.price;
        }, 0);

        // Count total number of sold items
        const totalSoldItems = transactionsInMonth.filter(transaction => transaction.sold).length;

        // Count total number of unsold items
        const totalUnsoldItems = transactionsInMonth.filter(transaction => !transaction.sold).length;

        // Get month name from the array
        const monthName = monthNames[month - 1]; // Subtract 1 to match the zero-based index

        res.json({
            message: `Statistics - ${monthName}`,
            month : monthName,
            totalSale: totalSaleAmount,
            totalSoldItems: totalSoldItems,
            totalUnsoldItems: totalUnsoldItems
        });
    } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({ message: error.message });
    }
};


// const Transaction = require('../models/Transaction');

// module.exports = async function getTransactionsByMonth(req, res) {
//     try {
//         const month = Number(req.query.month);

//         // Fetch all transactions from the database
//         const allTransactions = await Transaction.find({});

//         // Filter transactions by month
//         const transactionsInMonth = allTransactions.filter(transaction => {
//             const transactionMonth = new Date(transaction.dateOfSale).getUTCMonth() + 1; // Adding 1 because months are zero-based
//             return transactionMonth === month;
//         });

//         console.log(`Found ${transactionsInMonth.length} transactions for month ${month}`);

//         if (transactionsInMonth.length === 0) {
//             console.log("No transactions found for the specified month.");
//         }

//         // Calculate total sale amount
//         const totalSaleAmount = transactionsInMonth.reduce((total, transaction) => {
//             return total + transaction.price;
//         }, 0);

//         // Count total number of sold items
//         const totalSoldItems = transactionsInMonth.filter(transaction => transaction.sold).length;

//         // Count total number of unsold items
//         const totalUnsoldItems = transactionsInMonth.filter(transaction => !transaction.sold).length;

//         // Get month name
//         const monthName = new Date(allTransactions[0].dateOfSale).toLocaleString('default', { month: 'long' });

//         res.json({
//             message: `Statistics - ${monthName}`,
//             month : monthName,
//             totalSale: totalSaleAmount,
//             totalSoldItems: totalSoldItems,
//             totalUnsoldItems: totalUnsoldItems
//         });
//     } catch (error) {
//         console.error("Error fetching transactions:", error);
//         res.status(500).json({ message: error.message });
//     }
// };



// const Transaction = require('../models/Transaction');

// module.exports = async function getTransactionsByMonth(req, res) {
//     try {
//         const month = Number(req.query.month);

//         // Fetch all transactions from the database
//         const allTransactions = await Transaction.find({});

//         // Filter transactions by month
//         const transactionsInMonth = allTransactions.filter(transaction => {
//             const transactionMonth = new Date(transaction.dateOfSale).getUTCMonth() + 1; // Adding 1 because months are zero-based
//             return transactionMonth === month;
//         });

//         console.log(`Found ${transactionsInMonth.length} transactions for month ${month}`);

//         if (transactionsInMonth.length === 0) {
//             console.log("No transactions found for the specified month.");
//         }

//         res.json({
//             message: `Transactions for month ${month}`,
//             transactions: transactionsInMonth
//         });
//     } catch (error) {
//         console.error("Error fetching transactions:", error);
//         res.status(500).json({ message: error.message });
//     }
// };

// const Transaction = require('../models/Transaction');

// module.exports = async function getStatistics(req, res) {
//     try {
//         const { month } = req.query;
//         const monthNumber = parseInt(month); // Parse the month parameter to get the month number

//         if (isNaN(monthNumber) || monthNumber < 1 || monthNumber > 12) {
//             return res.status(400).json({ message: 'Invalid month. Please provide a valid month number (1-12).' });
//         }

//         // Construct the start and end dates for the selected month
//         const startDate = new Date(new Date().getFullYear(), monthNumber - 1, 1);
//         const endDate = new Date(new Date().getFullYear(), monthNumber, 0);

//         // Calculate total sale amount of selected month
//         const totalSaleAmount = await Transaction.aggregate([
//             {
//                 $match: {
//                     dateOfSale: {
//                         $gte: startDate,
//                         $lte: endDate
//                     },
//                     sold: true
//                 }
//             },
//             {
//                 $group: {
//                     _id: null,
//                     totalSaleAmount: { $sum: "$price" }
//                 }
//             }
//         ]);

//         // Calculate total number of sold items of selected month
//         const totalSoldItems = await Transaction.countDocuments({
//             dateOfSale: {
//                 $gte: startDate,
//                 $lte: endDate
//             },
//             sold: true
//         });

//         // Calculate total number of not sold items of selected month
//         const totalNotSoldItems = await Transaction.countDocuments({
//             dateOfSale: {
//                 $gte: startDate,
//                 $lte: endDate
//             },
//             sold: false
//         });

//         res.json({
//             message: 'Statistics',
//             month,
//             totalSaleAmount: totalSaleAmount.length > 0 ? totalSaleAmount[0].totalSaleAmount : 0,
//             totalSoldItems,
//             totalNotSoldItems
//         });
//     } catch (error) {
//         res.status(500).json({ message: 'Failed to fetch statistics', error: error.message });
//     }
// };
