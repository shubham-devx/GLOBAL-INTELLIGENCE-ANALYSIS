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

export default function LineChart({ labels, values }) {
  const data = {
    labels,
    datasets: [
      {
        label: "GDP (Current US$)",
        data: values,
        borderWidth: 2,
      },
    ],
  };

  return <Line data={data} />;
}