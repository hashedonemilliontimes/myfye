import React, {useState, useEffect} from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart } from 'chart.js';
import { ArcElement, CategoryScale, Title, Tooltip } from 'chart.js';
import { useSelector } from 'react-redux';
import crypto from '../../helpers/cryptoDataType';
import { valueAtTime } from '../../helpers/growthPercentage';

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
  const principalInvested = useSelector((state: any) => state.userWalletData.principalInvested);
  const initialPrincipal = useSelector((state: any) => state.userWalletData.initialPrincipal);
  const initialInvestmentDate = useSelector((state: any) => state.userWalletData.initialInvestmentDate);
  const principalHistory = useSelector((state: any) => state.userWalletData.principalInvestedHistory);

  const currentTimeInSeconds = Date.now()/1000;
  const currentValue = valueAtTime(currentTimeInSeconds, initialPrincipal, 
    initialInvestmentDate, principalHistory)

  let labels = cryptoList.map((crypto: any) => crypto.type);
  let dataPoints = cryptoList.map((crypto: any) => crypto.balanceUSD);
  let backgroundColors = ['#4CD964', '#9945FF',];

  const [isEmptyAccount, setIsEmptyAccount] = useState(true);
  
  useEffect(() => {
    let balance = currentValue;
    for (let i = 0; i < dataPoints.length; i++) {
      let balanceIndex = dataPoints[i];
      balance = balance + balanceIndex;
    }

    console.log("BALANCE FOR IS EMPTY ACCOUNT CHECK: ", balance);
    if (balance < 0.10) {
      setIsEmptyAccount(true);
    } else {
      setIsEmptyAccount(false);
    }
  }, [cryptoList]);
 
  // ondo, openeden, matrixport
  if (principalInvested > 0.9) {
    labels = [];
    dataPoints = [];
    backgroundColors = [];

    labels.push("First Citizens - Bank Deposits");
    labels.push("StoneX - US T-Bills");
    labels.push("Morgan Stanley - Bank Deposits");
    labels.push("StoneX - Cash & Cash Equivalents");
    labels.push("Morgan Stanley - US T-Notes");
    labels.push("StoneX - US T-Notes");
    labels.push("First Citizens - Cash & Cash Eq.");
    labels.push("Morgan Stanley - Cash & Cash Eq.");

    dataPoints.push(currentValue*.70);
    dataPoints.push(currentValue*.16);
    dataPoints.push(currentValue*.06);
    dataPoints.push(currentValue*.06);
    dataPoints.push(currentValue*0.05);
    dataPoints.push(currentValue*0.03);
    dataPoints.push(currentValue*0.02);
    dataPoints.push(currentValue*0);

    backgroundColors.push('#FFB3BA'); // Pastel red
    backgroundColors.push('#FFDFBA'); // Pastel orange
    backgroundColors.push('#FFFFBA'); // Pastel yellow
    backgroundColors.push('#BAFFC9'); // Pastel green
    backgroundColors.push('#BAE1FF'); // Pastel blue
    backgroundColors.push('#B5BAFF'); // Pastel indigo
    backgroundColors.push('#D9BAFF'); // Pastel violet
    backgroundColors.push('#FFBAF8'); // Pastel pink
     

    

} else {
  labels = [];
  dataPoints = [];
  backgroundColors = [];

  labels = cryptoList.map((crypto: any) => crypto.type);
  dataPoints = cryptoList.map((crypto: any) => crypto.balanceUSD);
  backgroundColors = ['#4CD964', '#9945FF',];
}

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


    { isEmptyAccount ? (
      <div>

      </div>

    ) : (

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',
      marginTop: '13px',color: '#333333', flexDirection: window.innerWidth < 600 ? 'column' : 'row' }}>
  <div style={{ width: '50%', aspectRatio: '1/1', position: 'relative', zIndex: 0 }}>
      <Pie data={data} options={options} />
  </div>


  { (principalInvested > 0.9) ? (
      <>
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
    <span style={{ display: 'inline-block', width: '12px', height: '12px', backgroundColor: '#FFB3BA', marginRight: '4px' }}></span>
    <span style={{ fontSize: '15px' }}>First Citizens - Bank Deposits</span>
</div>

<div style={{alignItems: 'center'}}>
    <span style={{ display: 'inline-block', width: '12px', height: '12px', backgroundColor: '#FFDFBA', marginRight: '4px' }}></span>
    <span style={{ fontSize: '15px' }}>StoneX - US T-Bills</span>
</div>

<div style={{alignItems: 'center'}}>
    <span style={{ display: 'inline-block', width: '12px', height: '12px', backgroundColor: '#FFFFBA', marginRight: '4px' }}></span>
    <span style={{ fontSize: '15px' }}>Morgan Stanley - Bank Deposits</span>
</div>

<div style={{alignItems: 'center'}}>
    <span style={{ display: 'inline-block', width: '12px', height: '12px', backgroundColor: '#BAFFC9', marginRight: '4px' }}></span>
    <span style={{ fontSize: '15px' }}>StoneX - Cash & Cash Equivalents</span>
</div>

<div style={{alignItems: 'center'}}>
    <span style={{ display: 'inline-block', width: '12px', height: '12px', backgroundColor: '#BAE1FF', marginRight: '4px' }}></span>
    <span style={{ fontSize: '15px' }}>Morgan Stanley - US T-Notes</span>
</div>

<div style={{alignItems: 'center'}}>
    <span style={{ display: 'inline-block', width: '12px', height: '12px', backgroundColor: '#B5BAFF', marginRight: '4px' }}></span>
    <span style={{ fontSize: '15px' }}>StoneX - US T-Notes</span>
</div>

<div style={{alignItems: 'center'}}>
    <span style={{ display: 'inline-block', width: '12px', height: '12px', backgroundColor: '#D9BAFF', marginRight: '4px' }}></span>
    <span style={{ fontSize: '15px' }}>First Citizens - Cash & Cash Eq.</span>
</div>

<div style={{alignItems: 'center'}}>
    <span style={{ display: 'inline-block', width: '12px', height: '12px', backgroundColor: '#FFBAF8', marginRight: '4px' }}></span>
    <span style={{ fontSize: '15px' }}>Morgan Stanley - Cash & Cash Eq.</span>
</div>


  </div>
      </>
    ) : (
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
    <span style={{ display: 'inline-block', width: '12px', height: '12px', backgroundColor: '#4CD964', marginRight: '4px' }}></span>
    <span style={{ fontSize: '15px' }}>USDC</span>
  </div>

  <div style={{alignItems: 'center'}}>
    <span style={{ display: 'inline-block', width: '12px', height: '12px', backgroundColor: '#9945FF', marginRight: '4px' }}></span>
    <span style={{ fontSize: '15px' }}>Solana</span>
  </div>
  </div>
    )}
  </div>

    ) }


    </div>);
};

export default PieChartComponent;