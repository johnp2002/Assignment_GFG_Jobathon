const Transaction = require('../models/Transaction');

module.exports = async function transactions(req, res) {
    //working with all serach ,page month also
  try {
    const { search = '', page = 1, perPage = 10, month } = req.query;

    // Define the search criteria
    let searchCriteria = {};

    // Handle search for price separately if search is not empty
    if (search && !isNaN(search)) {
      // Convert search to a number
      const price = parseFloat(search);
      // Define a price range based on the search value
      searchCriteria.price = { $gte: price - 0.01, $lte: price + 0.01 };
    } else if (search) {
      // Handle search for title or description
      searchCriteria.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Fetch all transactions from the database
    const allTransactions = await Transaction.find(searchCriteria);

    // Filter transactions by month if month is specified
    let transactions = allTransactions;
    if (month && !isNaN(month) && month >= 1 && month <= 12) {
      transactions = allTransactions.filter(transaction => {
        const transactionMonth = new Date(transaction.dateOfSale).getUTCMonth() + 1; // Adding 1 because months are zero-based
        return transactionMonth === parseInt(month);
      });
    }

    // Paginate the filtered transactions
    const totalCount = transactions.length;
    const totalPages = Math.ceil(totalCount / perPage);
    transactions = transactions.slice((page - 1) * perPage, page * perPage);

    res.json({
      message: 'List of transactions',
      search,
      page,
      perPage,
      totalPages,
      totalCount,
      transactions
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch transactions', error: error.message });
  }
};

// const Transaction = require('../models/Transaction');
// //working with out month excellent
// module.exports = async function transactions(req, res) {
//   try {
//       const { search = '', page = 1, perPage = 10 } = req.query;
//       console.log(search, page, perPage);

//       // Define the search criteria
//       let searchCriteria = {};

//       // Handle search for price separately if search is not empty
//       if (search && !isNaN(search)) {
//           // Convert search to a number
//           const price = parseFloat(search);
//           // Define a price range based on the search value
//           searchCriteria.price = { $gte: price - 0.01, $lte: price + 0.01 };
//       } else if (search) {
//           // Handle search for title or description
//           searchCriteria.$or = [
//               { title: { $regex: search, $options: 'i' } },
//               { description: { $regex: search, $options: 'i' } }
//           ];
//       }

//       // Query the database based on search criteria and pagination
//       const totalCount = await Transaction.countDocuments(searchCriteria);
//       const totalPages = Math.ceil(totalCount / perPage);
//       const transactions = await Transaction.find(searchCriteria)
//           .skip((page - 1) * perPage)
//           .limit(perPage);

//       res.json({
//           message: 'List of transactions',
//           search,
//           page,
//           perPage,
//           totalPages,
//           totalCount,
//           transactions
//       });
//   } catch (error) {
//       res.status(500).json({ message: 'Failed to fetch transactions', error: error.message });
//   }
// };

// module.exports = async function transactions(req, res) {
//     try {
//         const { search = '', page = 1, perPage = 10 } = req.query;
//         console.log(search, page, perPage);

//         // Define the search criteria
//         let searchCriteria = {};

//         // Handle search for price separately
//         if (!isNaN(search)) {
//             // Convert search to a number
//             const price = parseFloat(search);
//             // Define a price range based on the search value
//             searchCriteria.price = { $gte: price - 0.01, $lte: price + 0.01 };
//         } else {
//             // Handle search for title or description
//             searchCriteria.$or = [
//                 { title: { $regex: search, $options: 'i' } },
//                 { description: { $regex: search, $options: 'i' } }
//             ];
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
// };



// const Transaction = require('../models/Transaction');

// module.exports =   async function transactions(req, res){
//     try {
//         const { search = '', page = 1, perPage = 10 } = req.query;
//         console.log(search, page, perPage)
//         // Define the search criteria
//         let searchCriteria = {};

//         // Handle search for price separately
//         if (!isNaN(search)) {
//             // Convert search to a number
//             const price = parseFloat(search);
//             // Define a price range based on the search value
//             searchCriteria.price = { $gte: price - 0.01, $lte: price + 0.01 };
//         } else {
//             searchCriteria.$or = [
//                 { title: { $regex: search, $options: 'i' } },
//                 { description: { $regex: search, $options: 'i' } }
//             ];
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
// }


// app.get('/transactions', async (req, res) => {
//     try {
//         const { search = '', page = 1, perPage = 10 } = req.query;
//         console.log(search, page, perPage)
//         // Define the search criteria
//         let searchCriteria = {};

//         // Handle search for price separately
//         if (!isNaN(search)) {
//             // Convert search to a number
//             const price = parseFloat(search);
//             // Define a price range based on the search value
//             searchCriteria.price = { $gte: price - 0.01, $lte: price + 0.01 };
//         } else {
//             searchCriteria.$or = [
//                 { title: { $regex: search, $options: 'i' } },
//                 { description: { $regex: search, $options: 'i' } }
//             ];
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