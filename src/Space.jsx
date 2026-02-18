import { useEffect, useState } from "react";
import axios from "axios";

export default function Space() {
  const [launches, setLaunches] = useState([]);
  const [issData, setIssData] = useState(null);
  const [aiSummary, setAiSummary] = useState("");

  useEffect(() => {
    fetchLaunches();
    fetchISS();
  }, []);

  const fetchLaunches = async () => {
    try {
      const res = await axios.get(
        "https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=5"
      );
      setLaunches(res.data.results);
      generateAISummary(res.data.results);
    } catch {
      console.log("Launch API error");
    }
  };

  const fetchISS = async () => {
    try {
      const res = await axios.get(
        "https://api.wheretheiss.at/v1/satellites/25544"
      );
      setIssData(res.data);
    } catch {
      console.log("ISS API error");
    }
  };

  const generateAISummary = (launchData) => {
    if (!launchData.length) return;

    const agencies = launchData
      .map((l) => l.launch_service_provider?.name)
      .filter(Boolean);

    const uniqueAgencies = [...new Set(agencies)];

    setAiSummary(
      `There are ${launchData.length} upcoming launches involving ${uniqueAgencies.join(
        ", "
      )}. Space activity remains highly dynamic with increasing commercial and government missions.`
    );
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ color: "#c9a227" }}>🚀 SPACE INTELLIGENCE TERMINAL</h2>

      {/* AI SUMMARY */}
      {aiSummary && (
        <div
          style={{
            background: "#f4f4f4",
            padding: "15px",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          <h4>🤖 AI Space Insight</h4>
          <p>{aiSummary}</p>
        </div>
      )}

      {/* UPCOMING LAUNCHES */}
      <h3>🚀 Upcoming Launches</h3>

      <table>
        <thead>
          <tr>
            <th>Mission</th>
            <th>Agency</th>
            <th>Date</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          {launches.map((launch) => (
            <tr key={launch.id}>
              <td>{launch.name}</td>
              <td>{launch.launch_service_provider?.name}</td>
              <td>
                {new Date(launch.net).toLocaleString()}
              </td>
              <td>{launch.pad?.location?.name}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ISS LIVE DATA */}
      {issData && (
        <>
          <h3 style={{ marginTop: "30px" }}>
            🛰 ISS Current Position
          </h3>

          <div
            style={{
              background: "#f4f4f4",
              padding: "15px",
              borderRadius: "8px",
            }}
          >
            <p><b>Latitude:</b> {issData.latitude.toFixed(2)}</p>
            <p><b>Longitude:</b> {issData.longitude.toFixed(2)}</p>
            <p><b>Altitude:</b> {issData.altitude.toFixed(2)} km</p>
            <p><b>Velocity:</b> {issData.velocity.toFixed(2)} km/h</p>
          </div>
        </>
      )}
    </div>
  );
}