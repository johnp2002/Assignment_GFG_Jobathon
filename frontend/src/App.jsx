import { useEffect, useState } from "react";
import axios from "axios";
import MonthSelect from "./components/MonthSelect";
import BarChart from "./components/BarGraph";
import PieGraph from "./components/PieChart";

function App() {
  const [month, setMonth] = useState(null);
  const [search, setSearch] = useState("");
  const [data, setData] = useState(null);
  const [stats, setStats] = useState(null);
  const [barChart, setBarChart] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/data?month=${month}&search=${search}`
      );
      console.log(response);
      setData(response.data.transactions);
      setStats(response.data.statistics);
      setBarChart(response.data.barChartData.barChartData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  
  useEffect(() => {
    if (month !== null) {
      fetchData();
    }
  }, [month, search]);

  const onChangeMonth = (selectedMonth) => {
    setMonth(selectedMonth);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  return (
    <div className="container *:first-letter:mt-8 ">
      <h1 className="w-2/3  mx-auto text-center mt-2 text-3xl rounded-lg font-bold font-sans bg-blue-300 text-white p-4 my-4">Transaction Dashboard</h1>
      <div className="flex justify-between items-center mb-6 w-2/3  mx-auto py-4">
        <div className="relative w-1/3">
          <input
            type="text"
            className="input input-primary w-full"
            placeholder="Search"
            value={search}
            onChange={handleSearchChange}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="absolute w-5 h-5 top-1/2 right-4 transform -translate-y-1/2 text-gray-400"
          >
            <path
              fillRule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <MonthSelect onChange={onChangeMonth} />
      </div>

      {data && (
        <table className="table table-striped mb-8 w-2/3  mx-auto ">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Description</th>
              <th>Price</th>
              <th>Category</th>
              <th>Sold</th>
              <th>Image</th>
            </tr>
          </thead>
          <tbody>
            {data.transactions.map((transaction) => (
              <tr key={transaction._id}>
                <td>{transaction.id}</td>
                <td>{transaction.title}</td>
                <td>{transaction.description}</td>
                <td>{transaction.price}</td>
                <td>{transaction.category}</td>
                <td>{transaction.sold ? "Yes" : "No"}</td>
                <td>
                  <img
                    src={transaction.image}
                    alt={transaction.title}
                    className="w-12 h-12 object-cover rounded"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="flex justify-between bg-gray-100 p-6 rounded-lg w-2/3  mx-auto ">
        {stats && (
          <div className="w-1/3 bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">{stats.message}</h2>
            <p>Total Sale : {stats.totalSale}</p>
            <p>Total Sold Items : {stats.totalSoldItems}</p>
            <p>Total unSold Items : {stats.totalUnsoldItems}</p>
          </div>
        )}
        <div className="w-2/3 ml-4">
          {stats && <h2 className="text-xl">Bar Chart Stats - {stats.month} <span className="text-sm"> (Selected month name from dropdown )</span></h2>}
          {barChart && <BarChart data={barChart} />}
        </div>
      </div>
      <div className=" bg-gray-100 p-6 rounded-lg w-2/3  mx-auto">

      {month && <PieGraph month={month}/>}
      </div>
    </div>
  );
}

export default App;
