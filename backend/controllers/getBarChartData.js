const Transaction = require('../models/Transaction');

module.exports = async function getBarChartData(req, res) {
    try {
        const month = Number(req.query.month);

        // Fetch all transactions from the database
        const allTransactions = await Transaction.find({});

        // Filter transactions by month
        const transactionsInMonth = allTransactions.filter(transaction => {
            const transactionDate = new Date(transaction.dateOfSale);
            const transactionMonth = transactionDate.getMonth() + 1; // Adding 1 because months are zero-based
            const transactionYear = transactionDate.getFullYear();
            return transactionMonth === month && transactionYear >= 1920 && transactionYear <= 2024;
        });

        // Initialize object to store price range counts
        const priceRangeCounts = {
            "0-100": 0,
            "101-200": 0,
            "201-300": 0,
            "301-400": 0,
            "401-500": 0,
            "501-600": 0,
            "601-700": 0,
            "701-800": 0,
            "801-900": 0,
            "901-above": 0
        };

        // Calculate counts for each price range
        transactionsInMonth.forEach(transaction => {
            const price = transaction.price;
            if (price <= 100) {
                priceRangeCounts["0-100"]++;
            } else if (price <= 200) {
                priceRangeCounts["101-200"]++;
            } else if (price <= 300) {
                priceRangeCounts["201-300"]++;
            } else if (price <= 400) {
                priceRangeCounts["301-400"]++;
            } else if (price <= 500) {
                priceRangeCounts["401-500"]++;
            } else if (price <= 600) {
                priceRangeCounts["501-600"]++;
            } else if (price <= 700) {
                priceRangeCounts["601-700"]++;
            } else if (price <= 800) {
                priceRangeCounts["701-800"]++;
            } else if (price <= 900) {
                priceRangeCounts["801-900"]++;
            } else {
                priceRangeCounts["901-above"]++;
            }
        });

        // Prepare response
        const response = {
            month: month,
            barChartData: priceRangeCounts
        };

        res.json(response);
    } catch (error) {
        console.error("Error fetching bar chart data:", error);
        res.status(500).json({ message: error.message });
    }
};
