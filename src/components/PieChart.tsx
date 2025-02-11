import { useEffect } from "react";

import { ArcElement, CategoryScale, Title, Tooltip } from "chart.js";
import { useSelector } from "react-redux";

// Chart.register(ArcElement, CategoryScale, Title, Tooltip);

// interface CustomArc {
//   _model?: {
//     backgroundColor?: string;
//     borderColor?: string;
//   };
//   _datasetIndex?: number;
//   _index?: number;
//   custom?: {
//     backgroundColor?: string;
//     borderColor?: string;
//   };
// }

const PieChartComponent = () => {
  // Assume data is defined here

  // const cryptoList = useSelector(
  //   (state: any) => state.userWalletData.cryptoList
  // );
  // const publicKey = useSelector((state: any) => state.userWalletData.pubKey);

  // const usdyBalance = useSelector(
  //   (state: any) => state.userWalletData.usdySolBalance
  // );

  // let labels: string[] = [];
  // let dataPoints: number[] = [];
  // let backgroundColors = ["#4CD964", "#9945FF"];

  // useEffect(() => {
  //   let balance = usdyBalance;
  //   for (let i = 0; i < dataPoints.length; i++) {
  //     let balanceIndex = dataPoints[i];
  //     balance = balance + balanceIndex;
  //   }
  // }, [usdyBalance]);

  // labels = [];
  // dataPoints = [];
  // backgroundColors = [];

  // labels.push("First Citizens - Bank Deposits");
  // labels.push("StoneX - US T-Bills");
  // labels.push("Morgan Stanley - Bank Deposits");
  // labels.push("StoneX - Cash & Cash Equivalents");
  // labels.push("Morgan Stanley - US T-Notes");
  // labels.push("StoneX - US T-Notes");
  // labels.push("First Citizens - Cash & Cash Eq.");
  // labels.push("Morgan Stanley - Cash & Cash Eq.");

  // backgroundColors.push("#5d9b26");
  // backgroundColors.push("#74ad2e");
  // backgroundColors.push("#93ed6d");
  // backgroundColors.push("#56e06b");
  // backgroundColors.push("#71dab7");
  // backgroundColors.push("#80c85a");
  // backgroundColors.push("#5ab86a");
  // backgroundColors.push("#7ed785");

  // /*
  //   backgroundColors.push('#FFB3BA'); // Pastel red
  //   backgroundColors.push('#FFDFBA'); // Pastel orange
  //   backgroundColors.push('#FFFFBA'); // Pastel yellow
  //   backgroundColors.push('#BAFFC9'); // Pastel green
  //   backgroundColors.push('#BAE1FF'); // Pastel blue
  //   backgroundColors.push('#B5BAFF'); // Pastel indigo
  //   backgroundColors.push('#D9BAFF'); // Pastel violet
  //   backgroundColors.push('#FFBAF8'); // Pastel pink
  //    */

  // // ondo, openeden, matrixport
  // if (usdyBalance > 0.01) {
  //   dataPoints.push(usdyBalance * 0.7);
  //   dataPoints.push(usdyBalance * 0.16);
  //   dataPoints.push(usdyBalance * 0.06);
  //   dataPoints.push(usdyBalance * 0.06);
  //   dataPoints.push(usdyBalance * 0.05);
  //   dataPoints.push(usdyBalance * 0.03);
  //   dataPoints.push(usdyBalance * 0.02);
  //   dataPoints.push(usdyBalance * 0);
  // } else {
  //   dataPoints.push(1.0 * 0.7);
  //   dataPoints.push(1.0 * 0.16);
  //   dataPoints.push(1.0 * 0.06);
  //   dataPoints.push(1.0 * 0.06);
  //   dataPoints.push(1.0 * 0.05);
  //   dataPoints.push(1.0 * 0.03);
  //   dataPoints.push(1.0 * 0.02);
  //   dataPoints.push(1.0 * 0);
  // }

  // const data = {
  //   labels: labels,
  //   datasets: [
  //     {
  //       label: "$",
  //       data: dataPoints,
  //       backgroundColor: backgroundColors,
  //       borderColor: [
  //         "rgba(255, 99, 132, 0)",
  //         // ... other border colors
  //       ],
  //     },
  //   ],
  // };

  // const options = {
  //   responsive: true,
  //   legend: {
  //     display: true,
  //     position: "right",
  //     labels: {
  //       generateLabels: function (chart: Chart) {
  //         const data = chart.data;
  //         if (data.labels?.length && data.datasets.length) {
  //           return data.labels.map((label, i) => {
  //             const meta = chart.getDatasetMeta(0);
  //             const ds = data.datasets[0];
  //             const arc = meta.data[i] as unknown as CustomArc;
  //             const arcOpts = chart.options.elements!.arc;
  //             const custom = arc?.custom || {};
  //             const fill =
  //               custom.backgroundColor ||
  //               arc?._model?.backgroundColor ||
  //               arcOpts?.backgroundColor ||
  //               "defaultColor";
  //             const stroke =
  //               custom.borderColor ||
  //               arc?._model?.borderColor ||
  //               arcOpts?.borderColor ||
  //               "defaultColor";

  //             // Use nullish coalescing to avoid null/undefined issues
  //             const value =
  //               chart.config.data.datasets[arc?._datasetIndex ?? 0]?.data[
  //                 arc?._index ?? 0
  //               ] ?? 0;

  //             const total = ds.data.reduce(
  //               (acc: number, val: unknown) =>
  //                 acc + (typeof val === "number" ? val : 0),
  //               0
  //             );
  //             const percentage =
  //               (((value as number) / total) * 100).toFixed(2) + "%";

  //             return {
  //               text: `${label} : ${percentage}`,
  //               fillStyle: fill,
  //               strokeStyle: stroke,
  //               lineWidth: 2,
  //               hidden:
  //                 isNaN(ds.data[i] as number) || (meta.data[i] as any).hidden, // Type assertion here
  //               index: i,
  //             };
  //           });
  //         }
  //         return [];
  //       },
  //     },
  //   },
  //   tooltips: {
  //     callbacks: {
  //       label: function (tooltipItem: any, data: any) {
  //         // Type assertion if specific types are not available
  //         const dataset = data.datasets[tooltipItem.datasetIndex];
  //         const total = dataset.data.reduce(
  //           (previousValue: number, currentValue: number) =>
  //             previousValue + currentValue,
  //           0
  //         );
  //         const currentValue = dataset.data[tooltipItem.index];
  //         const percentage = ((currentValue / total) * 100).toFixed(2);
  //         return `${data.labels[tooltipItem.index]} : ${percentage}%`;
  //       },
  //     },
  //   },
  // };

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "5px",
          color: "#333333",
          flexDirection: window.innerWidth < 600 ? "column" : "row",
        }}
      >
        <div
          style={{
            width: "45vw",
            maxWidth: "200px",
            aspectRatio: "1/1",
            position: "relative",
            zIndex: 0,
          }}
        >
          {/* <Pie data={data} options={options} /> */}
        </div>
      </div>
    </div>
  );
};

export default PieChartComponent;
