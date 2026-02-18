import { useState } from "react";
import axios from "axios";
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

export default function Weather() {
  const [city, setCity] = useState("");
  const [labels, setLabels] = useState([]);
  const [temps, setTemps] = useState([]);
  const [aiSummary, setAiSummary] = useState("");

  const fetchWeather = async () => {
    try {
      const geoRes = await axios.get(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
      );

      if (!geoRes.data.results) {
        alert("City not found");
        return;
      }

      const { latitude, longitude } = geoRes.data.results[0];

      const weatherRes = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max&timezone=auto`
      );

      const temperatureData = weatherRes.data.daily.temperature_2m_max;
      const dateData = weatherRes.data.daily.time;

      setLabels(dateData);
      setTemps(temperatureData);

      generateAISummary(temperatureData);
    } catch {
      alert("Weather API error");
    }
  };

  // 🔥 AI WEATHER LOGIC
  const generateAISummary = (data) => {
    if (!data || data.length === 0) return;

    const avg =
      data.reduce((acc, temp) => acc + temp, 0) / data.length;

    const max = Math.max(...data);
    const min = Math.min(...data);

    let risk = "";
    let trend =
      data[data.length - 1] > data[0]
        ? "warming trend"
        : "cooling trend";

    if (max > 40) risk = "⚠️ Heatwave Risk";
    else if (min < 5) risk = "⚠️ Cold Wave Risk";
    else risk = "Normal Weather Conditions";

    setAiSummary(
      `Average temperature is ${avg.toFixed(
        1
      )}°C with a ${trend}. 
      Highest expected temperature is ${max}°C 
      and lowest is ${min}°C. 
      Risk Level: ${risk}.`
    );
  };

  const chartData = {
    labels,
    datasets: [
      {
        label: "Max Temperature (°C)",
        data: temps,
        borderWidth: 2,
      },
    ],
  };

  return (
    <div
      style={{
        background: "white",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ color: "#c9a227" }}>
        WEATHER INTELLIGENCE
      </h2>

      <input
        type="text"
        placeholder="Enter city (Delhi, London...)"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        style={{ padding: "8px", marginRight: "10px" }}
      />
      <button onClick={fetchWeather} style={{ padding: "8px 12px" }}>
        Analyze
      </button>

      {labels.length > 0 && (
        <>
          <div style={{ marginTop: "25px" }}>
            <Line data={chartData} />
          </div>

          {/* 🔥 AI SUMMARY SECTION */}
          {aiSummary && (
            <div
              style={{
                marginTop: 25,
                padding: 15,
                background: "#f4f4f4",
                borderLeft: "4px solid #c9a227",
              }}
            >
              <h4>🧠 AI Weather Insight</h4>
              <p>{aiSummary}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}