// import { useEffect, useState } from "react";
// import axios from "axios";

// export default function Crypto() {
//   const [coins, setCoins] = useState([]);
//   const [portfolio, setPortfolio] = useState(
//     JSON.parse(localStorage.getItem("portfolio")) || []
//   );

//   // Fetch Market Data
//   useEffect(() => {
//     const fetchCrypto = async () => {
//       try {
//         const res = await axios.get(
//           "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1"
//         );
//         setCoins(res.data);
//       } catch {
//         console.log("Market fetch error");
//       }
//     };

//     fetchCrypto();
//   }, []);

//   // Save to localStorage
//   const savePortfolio = (data) => {
//     setPortfolio(data);
//     localStorage.setItem("portfolio", JSON.stringify(data));
//   };

//   // Add Asset
//   const addToPortfolio = (coin) => {
//     const quantity = parseFloat(
//       prompt(`Enter quantity for ${coin.name}`)
//     );
//     if (!quantity || quantity <= 0) return;

//     const existing = portfolio.find(
//       (item) => item.id === coin.id
//     );

//     let updated;

//     if (existing) {
//       updated = portfolio.map((item) =>
//         item.id === coin.id
//           ? { ...item, quantity: item.quantity + quantity }
//           : item
//       );
//     } else {
//       updated = [...portfolio, { ...coin, quantity }];
//     }

//     savePortfolio(updated);
//   };

//   // Delete Asset
//   const removeFromPortfolio = (index) => {
//     const updated = portfolio.filter((_, i) => i !== index);
//     savePortfolio(updated);
//   };

//   // Edit Quantity
//   const editQuantity = (index) => {
//     const newQty = parseFloat(prompt("Enter new quantity"));
//     if (!newQty || newQty <= 0) return;

//     const updated = portfolio.map((item, i) =>
//       i === index ? { ...item, quantity: newQty } : item
//     );

//     savePortfolio(updated);
//   };

//   // Calculations
//   const totalValue = portfolio.reduce(
//     (acc, item) => acc + item.current_price * item.quantity,
//     0
//   );

//   const weightedChange =
//     portfolio.length > 0
//       ? portfolio.reduce(
//           (acc, item) =>
//             acc +
//             item.price_change_percentage_24h *
//               (item.current_price * item.quantity),
//           0
//         ) / totalValue
//       : 0;

//   return (
//     <div>
//       <h2 style={{ color: "#c9a227", marginBottom: 15 }}>
//         MARKET TERMINAL
//       </h2>

//       {/* MARKET TABLE */}
//       <table width="100%" cellPadding="6">
//         <thead>
//           <tr>
//             <th>Asset</th>
//             <th>Price</th>
//             <th>24h %</th>
//             <th>Market Cap</th>
//             <th>Add</th>
//           </tr>
//         </thead>
//         <tbody>
//           {coins.map((coin) => (
//             <tr key={coin.id}>
//               <td>{coin.name}</td>
//               <td>${coin.current_price.toLocaleString()}</td>
//               <td
//                 style={{
//                   color:
//                     coin.price_change_percentage_24h > 0
//                       ? "green"
//                       : "red",
//                   fontWeight: "bold",
//                 }}
//               >
//                 {coin.price_change_percentage_24h.toFixed(2)}%
//               </td>
//               <td>${coin.market_cap.toLocaleString()}</td>
//               <td>
//                 <button onClick={() => addToPortfolio(coin)}>
//                   +
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* PORTFOLIO SECTION */}
//       {portfolio.length > 0 && (
//         <>
//           <h3 style={{ marginTop: 25, color: "#c9a227" }}>
//             PORTFOLIO SUMMARY
//           </h3>

//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "1fr 1fr",
//               gap: 15,
//               marginBottom: 20,
//             }}
//           >
//             <div style={{ background: "#f4f4f4", padding: 12 }}>
//               <div style={{ fontSize: 12, color: "#555" }}>
//                 Total Value
//               </div>
//               <div style={{ fontWeight: "bold", fontSize: 18 }}>
//                 ${totalValue.toFixed(2)}
//               </div>
//             </div>

//             <div style={{ background: "#f4f4f4", padding: 12 }}>
//               <div style={{ fontSize: 12, color: "#555" }}>
//                 Weighted 24h Change
//               </div>
//               <div
//                 style={{
//                   fontWeight: "bold",
//                   fontSize: 18,
//                   color:
//                     weightedChange > 0 ? "green" : "red",
//                 }}
//               >
//                 {weightedChange.toFixed(2)}%
//               </div>
//             </div>
//           </div>

//           {/* PORTFOLIO TABLE */}
//           <table width="100%" cellPadding="6">
//             <thead>
//               <tr>
//                 <th>Asset</th>
//                 <th>Quantity</th>
//                 <th>Value</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {portfolio.map((item, index) => (
//                 <tr key={index}>
//                   <td>{item.name}</td>
//                   <td>{item.quantity}</td>
//                   <td>
//                     $
//                     {(
//                       item.current_price * item.quantity
//                     ).toFixed(2)}
//                   </td>
//                   <td>
//                     <button
//                       onClick={() => editQuantity(index)}
//                     >
//                       Edit
//                     </button>{" "}
//                     <button
//                       onClick={() =>
//                         removeFromPortfolio(index)
//                       }
//                       style={{ color: "red" }}
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </>
//       )}
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import axios from "axios";

export default function Crypto() {
  const [coins, setCoins] = useState([]);
  const [portfolio, setPortfolio] = useState(
    JSON.parse(localStorage.getItem("portfolio")) || []
  );
  const [aiSummary, setAiSummary] = useState("");

  useEffect(() => {
    const fetchCrypto = async () => {
      try {
        const res = await axios.get(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1"
        );
        setCoins(res.data);
      } catch {
        console.log("Market fetch error");
      }
    };

    fetchCrypto();
  }, []);

  const savePortfolio = (data) => {
    setPortfolio(data);
    localStorage.setItem("portfolio", JSON.stringify(data));
  };

  const addToPortfolio = (coin) => {
    const quantity = parseFloat(prompt(`Enter quantity for ${coin.name}`));
    if (!quantity || quantity <= 0) return;

    const existing = portfolio.find((item) => item.id === coin.id);

    let updated;

    if (existing) {
      updated = portfolio.map((item) =>
        item.id === coin.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      updated = [...portfolio, { ...coin, quantity }];
    }

    savePortfolio(updated);
    generateAISummary(updated);
  };

  const removeFromPortfolio = (index) => {
    const updated = portfolio.filter((_, i) => i !== index);
    savePortfolio(updated);
    generateAISummary(updated);
  };

  const totalValue = portfolio.reduce(
    (acc, item) => acc + item.current_price * item.quantity,
    0
  );

  const weightedChange =
    portfolio.length > 0
      ? portfolio.reduce(
          (acc, item) =>
            acc +
            item.price_change_percentage_24h *
              (item.current_price * item.quantity),
          0
        ) / totalValue
      : 0;

  // 🔥 AI LOGIC
  const generateAISummary = (data = portfolio) => {
    if (data.length === 0) {
      setAiSummary("");
      return;
    }

    const total =
      data.reduce(
        (acc, item) =>
          acc + item.current_price * item.quantity,
        0
      );

    const avgVolatility =
      data.reduce(
        (acc, item) =>
          acc + Math.abs(item.price_change_percentage_24h),
        0
      ) / data.length;

    let risk;
    if (avgVolatility > 8) risk = "High Risk";
    else if (avgVolatility > 4) risk = "Moderate Risk";
    else risk = "Low Risk";

    let performance =
      weightedChange > 0
        ? "positive momentum"
        : "negative pressure";

    setAiSummary(
      `Your portfolio value is $${total.toFixed(
        2
      )}. It shows ${performance} in the last 24 hours. 
      Risk profile is classified as ${risk}. 
      Consider diversification if volatility increases.`
    );
  };

  useEffect(() => {
    generateAISummary(portfolio);
  }, []);

  return (
    <div>
      <h2 style={{ color: "#c9a227", marginBottom: 15 }}>
        MARKET TERMINAL
      </h2>

      <table width="100%" cellPadding="6">
        <thead>
          <tr>
            <th>Asset</th>
            <th>Price</th>
            <th>24h %</th>
            <th>Market Cap</th>
            <th>Add</th>
          </tr>
        </thead>
        <tbody>
          {coins.map((coin) => (
            <tr key={coin.id}>
              <td>{coin.name}</td>
              <td>${coin.current_price.toLocaleString()}</td>
              <td
                style={{
                  color:
                    coin.price_change_percentage_24h > 0
                      ? "green"
                      : "red",
                  fontWeight: "bold",
                }}
              >
                {coin.price_change_percentage_24h.toFixed(2)}%
              </td>
              <td>${coin.market_cap.toLocaleString()}</td>
              <td>
                <button onClick={() => addToPortfolio(coin)}>
                  +
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {portfolio.length > 0 && (
        <>
          <h3 style={{ marginTop: 25, color: "#c9a227" }}>
            PORTFOLIO SUMMARY
          </h3>

          <p>
            <b>Total Value:</b> ${totalValue.toFixed(2)}
          </p>

          <p
            style={{
              color:
                weightedChange > 0 ? "green" : "red",
              fontWeight: "bold",
            }}
          >
            24h Weighted Change: {weightedChange.toFixed(2)}%
          </p>

          {/* 🔥 AI SECTION */}
          {aiSummary && (
            <div
              style={{
                marginTop: 20,
                padding: 15,
                background: "#f4f4f4",
                borderLeft: "4px solid #c9a227",
              }}
            >
              <h4>🧠 AI Portfolio Insight</h4>
              <p>{aiSummary}</p>
            </div>
          )}

          <h4>Holdings</h4>

          {portfolio.map((item, index) => (
            <div key={index}>
              {item.name} — {item.quantity} →
              ${(item.current_price * item.quantity).toFixed(2)}
              <button
                onClick={() => removeFromPortfolio(index)}
                style={{ marginLeft: 10, color: "red" }}
              >
                Delete
              </button>
            </div>
          ))}
        </>
      )}
    </div>
  );
}