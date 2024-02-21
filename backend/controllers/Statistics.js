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

