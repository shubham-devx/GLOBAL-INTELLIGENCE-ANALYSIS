import { useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Country() {
  const [country1, setCountry1] = useState("");
  const [country2, setCountry2] = useState("");
  const [labels, setLabels] = useState([]);
  const [values1, setValues1] = useState([]);
  const [values2, setValues2] = useState([]);
  const [risk, setRisk] = useState("");
  const [aiSummary, setAiSummary] = useState("");
  const [comparisonAI, setComparisonAI] = useState("");
  const [latestGDP, setLatestGDP] = useState(null);
  const [growthRate, setGrowthRate] = useState(null);

  const fetchCountryGDP = async (name, setter, setLatest = false) => {
    const res = await axios.get(
      `https://restcountries.com/v3.1/name/${name}`
    );

    const code = res.data[0].cca2;

    const gdpRes = await axios.get(
      `https://api.worldbank.org/v2/country/${code}/indicator/NY.GDP.MKTP.CD?format=json`
    );

    const gdpData = gdpRes.data[1]
      .filter((item) => item.value !== null)
      .slice(0, 10)
      .reverse();

    if (labels.length === 0) {
      setLabels(gdpData.map((item) => item.date));
    }

    const values = gdpData.map((item) => item.value);
    setter(values);

    if (setLatest) {
      const latest = values[values.length - 1];
      const previous = values[values.length - 2];
      setLatestGDP(latest);
      setGrowthRate(((latest - previous) / previous) * 100);
    }

    calculateRisk(values);
  };

  const handleCompare = async () => {
    try {
      await fetchCountryGDP(country1, setValues1, true);
      if (country2) {
        await fetchCountryGDP(country2, setValues2);
      }

      generateAISummary();
      generateComparisonReport();
    } catch {
      alert("Error fetching data");
    }
  };

  const calculateRisk = (data) => {
    let volatility = 0;
    for (let i = 1; i < data.length; i++) {
      volatility += Math.abs(data[i] - data[i - 1]) / data[i - 1];
    }
    volatility /= data.length;

    if (volatility > 0.08) setRisk("HIGH RISK");
    else if (volatility > 0.04) setRisk("MEDIUM RISK");
    else setRisk("LOW RISK");
  };

  const generateAISummary = () => {
    if (!values1.length) return;

    const latest = values1[values1.length - 1];
    const first = values1[0];

    const growth =
      latest > first ? "strong expansion trend" : "economic contraction trend";

    setAiSummary(
      `${country1} demonstrates ${growth} over the last decade with ${risk} volatility profile.`
    );
  };

  const generateComparisonReport = () => {
    if (!values1.length || !values2.length) return;

    const latest1 = values1[values1.length - 1];
    const latest2 = values2[values2.length - 1];

    if (latest1 > latest2) {
      setComparisonAI(
        `${country1} currently outperforms ${country2} in total GDP size.`
      );
    } else {
      setComparisonAI(
        `${country2} currently outperforms ${country1} in total GDP size.`
      );
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("GLOBAL ECONOMIC REPORT", 20, 20);
    doc.setFontSize(12);
    doc.text(`Country: ${country1}`, 20, 40);
    doc.text(`Risk Profile: ${risk}`, 20, 50);
    doc.text(`Latest GDP: $${latestGDP?.toLocaleString()}`, 20, 60);
    doc.text(`Growth Rate: ${growthRate?.toFixed(2)}%`, 20, 70);
    doc.text(aiSummary, 20, 85, { maxWidth: 170 });
    doc.save("Bloomberg_Economic_Report.pdf");
  };

  const chartData = {
    labels,
    datasets: [
      {
        label: country1,
        data: values1,
        borderColor: "#ffcc00",
        backgroundColor: "rgba(255,204,0,0.1)",
        tension: 0.3,
      },
      country2 && values2.length
        ? {
            label: country2,
            data: values2,
            borderColor: "#00aaff",
            tension: 0.3,
          }
        : {},
    ],
  };

  return (
    <div>
      <h2 style={{ color: "#ffcc00", marginBottom: 15 }}>
        GLOBAL ECONOMIC TERMINAL
      </h2>

      <div style={{ marginBottom: 15 }}>
        <input
          type="text"
          placeholder="Primary Country"
          value={country1}
          onChange={(e) => setCountry1(e.target.value)}
        />
        <input
          type="text"
          placeholder="Compare With"
          value={country2}
          onChange={(e) => setCountry2(e.target.value)}
        />
        <button onClick={handleCompare}>RUN ANALYSIS</button>
      </div>

      {latestGDP && (
        <>
          {/* KPI ROW */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 15,
              marginBottom: 20,
            }}
          >
            <div style={{ background: "#1a1a1a", padding: 12 }}>
              <div style={{ fontSize: 12, color: "#888" }}>
                Latest GDP
              </div>
              <div style={{ fontWeight: "bold", fontSize: 18 }}>
                ${latestGDP.toLocaleString()}
              </div>
            </div>

            <div style={{ background: "#1a1a1a", padding: 12 }}>
              <div style={{ fontSize: 12, color: "#888" }}>
                Growth Rate
              </div>
              <div
                style={{
                  fontWeight: "bold",
                  fontSize: 18,
                  color: growthRate > 0 ? "#00ff88" : "#ff4d4d",
                }}
              >
                {growthRate?.toFixed(2)}%
              </div>
            </div>

            <div style={{ background: "#1a1a1a", padding: 12 }}>
              <div style={{ fontSize: 12, color: "#888" }}>
                Risk Profile
              </div>
              <div
                style={{
                  fontWeight: "bold",
                  fontSize: 18,
                  color:
                    risk === "HIGH RISK"
                      ? "#ff4d4d"
                      : risk === "MEDIUM RISK"
                      ? "#ffaa00"
                      : "#00ff88",
                }}
              >
                {risk}
              </div>
            </div>
          </div>

          <Line data={chartData} />

          {aiSummary && (
            <div style={{ marginTop: 20 }}>
              <h4 style={{ color: "#ffcc00" }}>AI ECONOMIC SUMMARY</h4>
              <p>{aiSummary}</p>
            </div>
          )}

          {comparisonAI && (
            <div style={{ marginTop: 10 }}>
              <h4 style={{ color: "#00aaff" }}>COMPARATIVE REPORT</h4>
              <p>{comparisonAI}</p>
            </div>
          )}

          <button
            style={{ marginTop: 15 }}
            onClick={exportPDF}
          >
            EXPORT PDF REPORT
          </button>
        </>
      )}
    </div>
  );
}