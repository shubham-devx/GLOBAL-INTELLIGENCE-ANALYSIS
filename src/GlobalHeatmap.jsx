import { useEffect, useState } from "react";
import axios from "axios";
import {
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";

const geoUrl =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export default function GlobalHeatmap() {
  const [tooltip, setTooltip] = useState("");
  const [gdpData, setGdpData] = useState({});
  const [aiSummary, setAiSummary] = useState("");

  // 🔥 Fetch GDP Data Once
  useEffect(() => {
    const fetchGDP = async () => {
      try {
        const res = await axios.get(
          "https://api.worldbank.org/v2/country/all/indicator/NY.GDP.MKTP.CD?format=json&per_page=300"
        );

        const data = res.data[1];

        const formatted = {};

        data.forEach((item) => {
          if (item.value && item.countryiso3code) {
            formatted[item.countryiso3code] = item.value;
          }
        });

        setGdpData(formatted);
      } catch {
        console.log("GDP fetch error");
      }
    };

    fetchGDP();
  }, []);

  // 🔥 AI ECONOMIC CLASSIFIER
  const generateAI = (countryName, gdp) => {
    if (!gdp) {
      setAiSummary("No economic data available.");
      return;
    }

    let level = "";
    let risk = "";

    if (gdp > 10000000000000) {
      level = "Major Economic Superpower";
      risk = "Low Risk";
    } else if (gdp > 1000000000000) {
      level = "Developed Economy";
      risk = "Moderate Risk";
    } else {
      level = "Emerging / Developing Economy";
      risk = "Higher Risk";
    }

    setAiSummary(
      `${countryName} has a GDP of $${gdp.toLocaleString()}. 
      Classified as: ${level}. 
      Economic Risk Profile: ${risk}.`
    );
  };

  return (
    <div
      style={{
        background: "white",
        padding: "20px",
        borderRadius: "12px",
      }}
    >
      <h2 style={{ color: "#c9a227" }}>
        GLOBAL ECONOMIC HEATMAP
      </h2>

      <div style={{ width: "100%", height: "500px" }}>
        <ComposableMap
          projection="geoEqualEarth"
          width={800}
          height={400}
          style={{ width: "100%", height: "100%" }}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const iso = geo.properties.ISO_A3;
                const gdp = gdpData[iso];

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={
                      gdp
                        ? gdp > 10000000000000
                          ? "#003366"
                          : gdp > 1000000000000
                          ? "#3399ff"
                          : "#99ccff"
                        : "#eeeeee"
                    }
                    stroke="#FFF"
                    strokeWidth={0.5}
                    onMouseEnter={() => {
                      const name = geo.properties.NAME;
                      setTooltip(
                        `${name} — GDP: ${
                          gdp
                            ? "$" + gdp.toLocaleString()
                            : "No Data"
                        }`
                      );
                      generateAI(name, gdp);
                    }}
                    onMouseLeave={() => {
                      setTooltip("");
                      setAiSummary("");
                    }}
                    style={{
                      default: { outline: "none" },
                      hover: {
                        fill: "#c9a227",
                        outline: "none",
                        cursor: "pointer",
                      },
                      pressed: { outline: "none" },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          style={{
            marginTop: 15,
            padding: 10,
            background: "#f4f4f4",
            borderRadius: "6px",
          }}
        >
          {tooltip}
        </div>
      )}

      {/* AI SUMMARY */}
      {aiSummary && (
        <div
          style={{
            marginTop: 15,
            padding: 15,
            background: "#f9f9f9",
            borderLeft: "4px solid #c9a227",
          }}
        >
          <h4>🧠 AI Economic Insight</h4>
          <p>{aiSummary}</p>
        </div>
      )}
    </div>
  );
}