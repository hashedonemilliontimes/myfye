import React, {useState} from 'react';
import { LanguageCodeProps } from '../../helpers/languageManager';

import { Pie } from 'react-chartjs-2';
import { Chart } from 'chart.js';
import { ArcElement, CategoryScale, Title, Tooltip } from 'chart.js';

export default function PortfolioBreakdown() {


    const [showPortfolioBreakdown, setshowPortfolioBreakdown] = useState(false);

    const togglePortfolio = () => {
        setshowPortfolioBreakdown(!showPortfolioBreakdown)
      
      };


      let labels = []
      let dataPoints = []
      let backgroundColors = ['#4CD964', '#9945FF',];


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
  
      dataPoints.push(70);
      dataPoints.push(16);
      dataPoints.push(6);
      dataPoints.push(6);
      dataPoints.push(5);
      dataPoints.push(3);
      dataPoints.push(2);
      dataPoints.push(0);
  
      backgroundColors.push('#FFB3BA'); // Pastel red
      backgroundColors.push('#FFDFBA'); // Pastel orange
      backgroundColors.push('#FFFFBA'); // Pastel yellow
      backgroundColors.push('#BAFFC9'); // Pastel green
      backgroundColors.push('#BAE1FF'); // Pastel blue
      backgroundColors.push('#B5BAFF'); // Pastel indigo
      backgroundColors.push('#D9BAFF'); // Pastel violet
      backgroundColors.push('#FFBAF8'); // Pastel pink
     
      

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


const data = {
    labels: labels,
    datasets: [
      {
        label: '%',
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


    return (
        <>


<div style={{ 
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#60A05B',
        maxWidth: '400px', // you can adjust this value as needed
        border: '1px solid white',
        background: 'white',
        padding: '10px',
        borderRadius: '10px', marginTop: '20px',
        textAlign: 'center',
        cursor: 'pointer',
        textDecoration: 'underline'
      }}
      onClick={togglePortfolio}
  >
    How are my deposits invested?

    </div>

    {showPortfolioBreakdown && (
        <div 
        style={{ 
            position: 'fixed',  // Fixed position
            top: 0,             // Starting from the top
            left: 0,            // Starting from the left
            width: '100vw',     // Full viewport width
            height: '100vh',    // Full viewport height
            backgroundColor: 'rgba(0, 0, 0, 0.6)', // Transparent gray
            zIndex: 1000,       // High z-index to be on top of other elements
            cursor: 'pointer'   // Cursor pointer to indicate it's clickable
        }}
        onClick={togglePortfolio}
    >


<div style={{}}>
    <div style={{display: 'flex', justifyContent: 'center',}}>
<div style={{fontSize: '40px', fontWeight: 'bold', 
textAlign: 'center', marginTop: '90px', background: 'rgba(0, 0, 0, 0.6)', padding: '10px',
borderRadius: '5px', width: '650px'}}>How are my deposits invested?</div>
</div>

<div style={{marginTop: '20px', maxHeight: '70vh'}}>

<div style={{display: 'flex', justifyContent: 'center',}}>
    <div style={{display: 'flex', alignItems: 'center', maxWidth: '750px', gap: '40px'}}>
<div style={{ width: '50%', aspectRatio: '1/1', position: 'relative', zIndex: 0 }}>
      <Pie data={data} options={options} />
  </div>





  <div 
      style={{
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'flex-start',
      marginLeft: '15px', 
      fontSize: '25px', background: 'rgba(0, 0, 0, 0.6)', padding: '10px',
      borderRadius: '5px',
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
</div>

</div>


  </div>
  




</div>

        </div>

    )}

        </>
    );
}
