import React, {useState, useEffect} from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart } from 'chart.js';
import { ArcElement, CategoryScale, Title, Tooltip } from 'chart.js';
import { useSelector } from 'react-redux';

Chart.register(ArcElement, CategoryScale, Title, Tooltip);


interface CustomArc {
  _model?: {
    backgroundColor?: string;
    borderColor?: string;
  };
  _datasetIndex?: number;
  _index?: number;
  custom?: {
    backgroundColor?: string;
    borderColor?: string;
  };
}

const PieChartComponent = () => {
  // Assume data is defined here

  const cryptoList = useSelector((state: any) => state.userWalletData.cryptoList);
  const publicKey = useSelector((state: any) => state.userWalletData.pubKey);

  const usdyBalance = useSelector((state: any) => state.userWalletData.usdySolBalance);

  let labels = cryptoList.map((crypto: any) => crypto.type);
  let dataPoints = cryptoList.map((crypto: any) => crypto.balanceUSD);
  let backgroundColors = ['#4CD964', '#9945FF',];
  
  useEffect(() => {
    let balance = usdyBalance;
    for (let i = 0; i < dataPoints.length; i++) {
      let balanceIndex = dataPoints[i];
      balance = balance + balanceIndex;
    }



    
  }, [usdyBalance]);
 

  labels = [];
  dataPoints = [];
  backgroundColors = [];
  
  labels.push("Bitcoin");

  backgroundColors.push('#60A05B');

    /*
    backgroundColors.push('#FFB3BA'); // Pastel red
    backgroundColors.push('#FFDFBA'); // Pastel orange
    backgroundColors.push('#FFFFBA'); // Pastel yellow
    backgroundColors.push('#BAFFC9'); // Pastel green
    backgroundColors.push('#BAE1FF'); // Pastel blue
    backgroundColors.push('#B5BAFF'); // Pastel indigo
    backgroundColors.push('#D9BAFF'); // Pastel violet
    backgroundColors.push('#FFBAF8'); // Pastel pink
     */

  dataPoints.push(1.0);
  const data = {
    labels: labels,
    datasets: [
      {
        label: '$',
        data: dataPoints,
        backgroundColor: backgroundColors,
        borderColor: [
          'rgba(255, 99, 132, 0)',
          // ... other border colors
        ]
      }
    ]
  };
  

  const options = {
    responsive: true,
    legend: {
      display: true,
      position: 'right',
      labels: {
        generateLabels: function (chart: Chart) {
          const data = chart.data;
          if (data.labels?.length && data.datasets.length) {
            return data.labels.map((label, i) => {
              const meta = chart.getDatasetMeta(0);
              const ds = data.datasets[0];
              const arc = meta.data[i] as unknown as CustomArc;
              const arcOpts = chart.options.elements!.arc;
              const custom = arc?.custom || {};
              const fill = custom.backgroundColor || arc?._model?.backgroundColor || arcOpts?.backgroundColor || 'defaultColor';
              const stroke = custom.borderColor || arc?._model?.borderColor || arcOpts?.borderColor || 'defaultColor';

              // Use nullish coalescing to avoid null/undefined issues
              const value = chart.config.data.datasets[arc?._datasetIndex ?? 0]?.data[arc?._index ?? 0] ?? 0;

              const total = ds.data.reduce((acc: number, val: unknown) => acc + (typeof val === 'number' ? val : 0), 0);
              const percentage = ((value as number / total) * 100).toFixed(2) + '%';

              return {
                text: `${label} : ${percentage}`,
                fillStyle: fill,
                strokeStyle: stroke,
                lineWidth: 2,
                hidden: isNaN(ds.data[i] as number) || (meta.data[i] as any).hidden, // Type assertion here
                index: i
              };
            });
          }
          return [];
        }
      }
    },
    tooltips: {
      callbacks: {
        label: function (tooltipItem: any, data: any) {  // Type assertion if specific types are not available
          const dataset = data.datasets[tooltipItem.datasetIndex];
          const total = dataset.data.reduce((previousValue: number, currentValue: number) => previousValue + currentValue, 0);
          const currentValue = dataset.data[tooltipItem.index];
          const percentage = ((currentValue / total) * 100).toFixed(2);
          return `${data.labels[tooltipItem.index]} : ${percentage}%`;
        }
      }
    }
  };

  return (<div>


      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',
      marginTop: '5px',color: '#333333', flexDirection: window.innerWidth < 600 ? 'column' : 'row' }}>
<div style={{ width: '45vw', maxWidth: '200px', aspectRatio: '1/1', position: 'relative', zIndex: 0 }}>
  {/* Pie Chart */}
  <Pie data={data} options={options} />

  {/* Overlay Text */}
  <div
    style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 1,
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: '1rem',
      color: 'white',
    }}
  >
    100% Bitcoin
  </div>
</div>
{/*
        <div 
      style={{
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'flex-start',
      marginLeft: '15px', 
      fontSize: '25px'
      }}
  >
  

  <div style={{alignItems: 'center'}}>
    <span style={{ display: 'inline-block', width: '12px', height: '12px', backgroundColor: `${backgroundColors[0]}`, marginRight: '4px' }}></span>
    <span style={{ fontSize: '15px' }}>First Citizens - Bank Deposits</span>
</div>

<div style={{alignItems: 'center'}}>
    <span style={{ display: 'inline-block', width: '12px', height: '12px', backgroundColor: `${backgroundColors[1]}`, marginRight: '4px' }}></span>
    <span style={{ fontSize: '15px' }}>StoneX - US T-Bills</span>
</div>

<div style={{alignItems: 'center'}}>
    <span style={{ display: 'inline-block', width: '12px', height: '12px', backgroundColor: `${backgroundColors[2]}`, marginRight: '4px' }}></span>
    <span style={{ fontSize: '15px' }}>Morgan Stanley - Bank Deposits</span>
</div>

<div style={{alignItems: 'center'}}>
    <span style={{ display: 'inline-block', width: '12px', height: '12px', backgroundColor: `${backgroundColors[3]}`, marginRight: '4px' }}></span>
    <span style={{ fontSize: '15px' }}>StoneX - Cash & Cash Equivalents</span>
</div>

<div style={{alignItems: 'center'}}>
    <span style={{ display: 'inline-block', width: '12px', height: '12px', backgroundColor: `${backgroundColors[4]}`, marginRight: '4px' }}></span>
    <span style={{ fontSize: '15px' }}>Morgan Stanley - US T-Notes</span>
</div>

<div style={{alignItems: 'center'}}>
    <span style={{ display: 'inline-block', width: '12px', height: '12px', backgroundColor: `${backgroundColors[5]}`, marginRight: '4px' }}></span>
    <span style={{ fontSize: '15px' }}>StoneX - US T-Notes</span>
</div>

<div style={{alignItems: 'center'}}>
    <span style={{ display: 'inline-block', width: '12px', height: '12px', backgroundColor: `${backgroundColors[6]}`, marginRight: '4px' }}></span>
    <span style={{ fontSize: '15px' }}>First Citizens - Cash & Cash Eq.</span>
</div>

<div style={{alignItems: 'center'}}>
    <span style={{ display: 'inline-block', width: '12px', height: '12px', backgroundColor: `${backgroundColors[7]}`, marginRight: '4px' }}></span>
    <span style={{ fontSize: '15px' }}>Morgan Stanley - Cash & Cash Eq.</span>
</div>


  </div>

  */}
  </div>



    </div>);
};

export default PieChartComponent;