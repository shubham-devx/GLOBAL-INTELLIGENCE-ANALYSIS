import { useState } from "react";
import Country from "./pages/Country";
import GlobalHeatmap from "./GlobalHeatmap";
import Crypto from "./Crypto";
import Weather from "./Weather";
import Space from "./Space";

export default function App() {
  const [activeTab, setActiveTab] = useState("country");

  return (
    <div className="terminal-container">
      
      {/* Header */}
      <h1 style={{ marginBottom: "20px" }}>
        GLOBAL INTELLIGENCE TERMINAL
      </h1>

      {/* Navigation */}
      <div style={{ marginBottom: "25px" }}>
        <button
          className="button-primary"
          onClick={() => setActiveTab("country")}
        >
          Economy
        </button>{" "}

        <button
          className="button-primary"
          onClick={() => setActiveTab("heatmap")}
        >
          Heatmap
        </button>{" "}

        <button
          className="button-primary"
          onClick={() => setActiveTab("crypto")}
        >
          Markets
        </button>{" "}

        <button
          className="button-primary"
          onClick={() => setActiveTab("weather")}
        >
          Weather
        </button>{" "}

        <button
          className="button-primary"
          onClick={() => setActiveTab("space")}
        >
          Space
        </button>
      </div>

      {/* Dynamic Content */}
      {activeTab === "country" && <Country />}
      {activeTab === "heatmap" && <GlobalHeatmap />}
      {activeTab === "crypto" && <Crypto />}
      {activeTab === "weather" && <Weather />}
      {activeTab === "space" && <Space />}
      
    </div>
  );
}