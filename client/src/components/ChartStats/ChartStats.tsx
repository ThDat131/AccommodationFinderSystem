import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ChartStats = ({ stats, statsName, statsLable }) => {
  const monthsLabels = stats[0]?.months?.map(monthData => monthData.month);
  const options: any = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: statsName,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        position: "left",
      },
      x: {
        title: {
          display: true,
          text: 'Tháng',
        },
      },
    },
  };

  const data = {
    labels: monthsLabels,
    datasets: [
      {
        label: statsLable,
        data: stats[0]?.months?.map(monthData => monthData.total),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        yAxisID: "y",
      },
      // {
      //   label: "Số lượng",
      //   data: stats?.map((item) => item.quantity),
      //   backgroundColor: "rgba(53, 162, 235, 0.5)",
      //   yAxisID: "y1",
      // },
    ],
  };

  return (
    <Bar
      style={{
        maxHeight: "500px",
      }}
      // options={options}
      options={options}
      data={data}
    />
  );
};

export default ChartStats;
