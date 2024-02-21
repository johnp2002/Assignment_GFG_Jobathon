


const axios = require('axios');

// Define the base URLs for the three APIs
const baseURL = 'http://localhost:3000';
const transactionsURL = `${baseURL}/transactions`;
const statisticsURL = `${baseURL}/statistics`;
const barChartDataURL = `${baseURL}/bargraph`;

// Define the function to fetch and combine the data
async function fetchDataFromAllEndpoints(month, search = '', page = 1, perPage = 10) {
    try {
        // Make requests to each API endpoint using Axios with the month and additional query parameters
        const transactionsPromise = axios.get(`${transactionsURL}?month=${month}&search=${search}&page=${page}&perPage=${perPage}`).then(res => res.data);
        const statisticsPromise = axios.get(`${statisticsURL}?month=${month}`).then(res => res.data);
        const barChartDataPromise = axios.get(`${barChartDataURL}?month=${month}`).then(res => res.data);

        // Wait for all promises to resolve using Promise.all()
        const [transactionsData, statisticsData, barChartData] = await Promise.all([
            transactionsPromise,
            statisticsPromise,
            barChartDataPromise
        ]);

        // Combine the responses into a single JSON object
        const combinedData = {
            transactions: transactionsData,
            statistics: statisticsData,
            barChartData: barChartData
        };

        return combinedData;
    } catch (error) {
        console.error('Error fetching combined data:', error);
        throw error;
    }
}

// Define the route handler for the combined API
module.exports = async function combined(req, res) {
    try {
        // Extract the month parameter and additional query parameters from the request query
        const { month, search, page, perPage } = req.query;

        // Fetch data from all endpoints for the specified month and send the combined response
        const combinedData = await fetchDataFromAllEndpoints(month, search, page, perPage);
        res.json(combinedData);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch combined data', error: error.message });
    }
}



// // Define the base URLs for the three APIs
// const baseURL = 'http://localhost:3000';
// const transactionsURL = `${baseURL}/transactions`;
// const statisticsURL = `${baseURL}/statistics`;
// const barChartDataURL = `${baseURL}/bargraph`;

// // Define the function to fetch and combine the data
// async function fetchDataFromAllEndpoints(month) {
//     try {
//         // Make requests to each API endpoint using Axios with the month parameter
//         const transactionsPromise = axios.get(`${transactionsURL}?month=${month}`).then(res => res.data);
//         const statisticsPromise = axios.get(`${statisticsURL}?month=${month}`).then(res => res.data);
//         const barChartDataPromise = axios.get(`${barChartDataURL}?month=${month}`).then(res => res.data);

//         // Wait for all promises to resolve using Promise.all()
//         const [transactionsData, statisticsData, barChartData] = await Promise.all([
//             transactionsPromise,
//             statisticsPromise,
//             barChartDataPromise
//         ]);

//         // Combine the responses into a single JSON object
//         const combinedData = {
//             transactions: transactionsData,
//             statistics: statisticsData,
//             barChartData: barChartData
//         };

//         return combinedData;
//     } catch (error) {
//         console.error('Error fetching combined data:', error);
//         throw error;
//     }
// }

// // Define the route handler for the combined API
// module.exports = async function combined(req, res) {
//     try {
//         // Extract the month parameter from the request query
//         const { month } = req.query;

//         // Fetch data from all endpoints for the specified month and send the combined response
//         const combinedData = await fetchDataFromAllEndpoints(month);
//         res.json(combinedData);
//     } catch (error) {
//         res.status(500).json({ message: 'Failed to fetch combined data', error: error.message });
//     }
// }
