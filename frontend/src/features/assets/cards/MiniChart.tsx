import { useEffect, useRef } from "react";
import Highcharts from "highcharts";
import { css } from "@emotion/react";

interface MiniChartProps {
  data: number[];
  isPositive: boolean;
  height?: number;
  width?: number;
}

const MiniChart = ({ data, isPositive, height = 40, width = 80 }: MiniChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<Highcharts.Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current || data.length === 0) return;

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Create new chart
    chartInstance.current = Highcharts.chart(chartRef.current, {
      chart: {
        type: 'line',
        width: width,
        height: height,
        backgroundColor: 'transparent',
        margin: [0, 0, 0, 0],
        spacing: [0, 0, 0, 0],
        animation: false,
      },
      title: {
        text: undefined,
      },
      xAxis: {
        visible: false,
        categories: data.map((_, index) => index),
      },
      yAxis: {
        visible: false,
        gridLineWidth: 0,
      },
      legend: {
        enabled: false,
      },
      plotOptions: {
        line: {
          marker: {
            enabled: false,
            states: {
              hover: {
                enabled: false,
              },
            },
          },
          lineWidth: 2,
          animation: false,
          enableMouseTracking: false,
        },
      },
      series: [{
        name: 'Price',
        data: data,
        color: isPositive ? '#22c55e' : '#ef4444', // green for positive, red for negative
      }] as Highcharts.SeriesOptionsType[],
      credits: {
        enabled: false,
      },
      tooltip: {
        enabled: false,
      },
      exporting: {
        enabled: false,
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, isPositive, height, width]);

  return (
    <div
      ref={chartRef}
      css={css`
        display: inline-block;
        margin-left: auto;
      `}
    />
  );
};

export default MiniChart;