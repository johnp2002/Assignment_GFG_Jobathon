const Transaction = require('../models/Transaction');

module.exports = async function getPieChartData(req, res) {
    try {
        const month = Number(req.query.month);

        // Fetch all transactions from the database
        const allTransactions = await Transaction.find({});
        console.log(allTransactions.length);

        // Extract unique categories and count the number of items in each category
        const categoryCounts = {};
        allTransactions.forEach(transaction => {
            const transactionMonth = new Date(transaction.dateOfSale).getUTCMonth() + 1; // Adding 1 because months are zero-based
            if (transactionMonth === month) {
                const category = transaction.category;
                categoryCounts[category] = (categoryCounts[category] || 0) + 1;
            }
        });

        // Prepare the response data
        const pieChartData = [];
        for (const category in categoryCounts) {
            pieChartData.push({ category: category, count: categoryCounts[category] });
        }

        res.json({
            message: `Pie chart data for month ${month}`,
            data: pieChartData
        });
    } catch (error) {
        console.error("Error fetching pie chart data:", error);
        res.status(500).json({ message: error.message });
    }
};
