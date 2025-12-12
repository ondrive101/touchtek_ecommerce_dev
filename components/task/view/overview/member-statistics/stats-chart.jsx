"use client";

import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useThemeStore } from "@/store";
import { useTheme } from "next-themes";
import { themes } from "@/config/thems";

const StatsChart = ({ height = 305, data }) => {
  const { theme: config, setTheme: setConfig, isRtl } = useThemeStore();
  const { theme: mode } = useTheme();
  const theme = themes.find((theme) => theme.name === config);

  const series = data.map(item => item.count);

  const options = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    labels: data.map(item => item.name),
    dataLabels: {
      enabled: false,
      style: {
        fontSize: "14px",
        fontWeight: "500",
      },
    },
    stroke: {
      width: 0,
    },
    colors: data.map(item => item.color),
    tooltip: {
      theme: mode === "dark" ? "dark" : "light",
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            style: {
              fontSize: "12px",
              fontWeight: 500,
              color: `hsl(${theme?.cssVars[mode === "dark" ? "dark" : "light"].chartLabel
                })`,
            },
            value: {
              color: `hsl(${theme?.cssVars[mode === "dark" ? "dark" : "light"].chartLabel
                })`,
            },
            total: {
              show: true,
              color: `hsl(${theme?.cssVars[mode === "dark" ? "dark" : "light"].chartLabel
                })`,
            },
          },
        },
      },
    },
    padding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
    fill: {
      type: "gradient",
    },
    legend: {
      position: "bottom",
      labels: {
        colors: `hsl(${theme?.cssVars[
          mode === "dark" || mode === "system" ? "dark" : "light"
        ].chartLabel
          })`,
      },
      itemMargin: {
        horizontal: 10,
        vertical: 8,
      },
      markers: {
        width: 10,
        height: 10,
        radius: 10,
        offsetX: isRtl ? 5 : -5
      }
    }
  };
  return (
    <Chart
      options={options}
      series={series}
      type="donut"
      height={height}
      width={"100%"}
    />
  );
};

export default StatsChart;
