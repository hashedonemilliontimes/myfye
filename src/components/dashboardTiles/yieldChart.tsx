import React, {useState, useEffect} from 'react';
import { useSelector } from 'react-redux';
import crypto from '../../helpers/cryptoDataType';
import solanaIconGradient from '../../assets/solanaIconGradient.png';
import usdcSolIcon from '../../assets/usdcSolIcon.png';
import { Line } from 'react-chartjs-2';
import { db } from "../..";
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
import {
    Chart as ChartJS,
    LineElement,
    TimeScale, // x axis
    LinearScale, // y axis 
    PointElement, 
    ChartOptions

} from 'chart.js';
import 'chartjs-adapter-moment';
import { valueAtTime } from '../../helpers/growthPercentage';

ChartJS.register(
    LineElement,
    TimeScale, // x axis
    LinearScale, // y axis 
    PointElement
)

/*
interface GraphProps {
    financialData: financialData | null
}
*/

interface GraphProps {
    screenSize: 'small' | 'large';
  }
  

function YieldingChartComponent({ screenSize }: GraphProps) {

  const isSmallScreen = window.innerWidth <= 768;

  const currentTimeInSeconds = Date.now()/1000;

  
  const [chartDataHour, setChartDataHour] = useState<{
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      fill: boolean;
      borderColor: string;
      cubicInterpolationMode?: 'monotone';
    }[];
  } | null>(null);

  const [chartDataDay, setChartDataDay] = useState<{
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      fill: boolean;
      borderColor: string;
      cubicInterpolationMode?: 'monotone';
    }[];
  } | null>(null);

  const [chartDataWeek, setChartDataWeek] = useState<{
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      fill: boolean;
      borderColor: string;
      cubicInterpolationMode?: 'monotone';
    }[];
  } | null>(null);

  const [chartDataMonth, setChartDataMonth] = useState<{
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      fill: boolean;
      borderColor: string;
      cubicInterpolationMode?: 'monotone';
    }[];
  } | null>(null);

  const [chartDataYear, setChartDataYear] = useState<{
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      fill: boolean;
      borderColor: string;
      cubicInterpolationMode?: 'monotone';
    }[];
  } | null>(null);

  const [chartDataAll, setChartDataAll] = useState<{
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      fill: boolean;
      borderColor: string;
      cubicInterpolationMode?: 'monotone';
    }[];
  } | null>(null);

  const [optionsAll, setOptionsAll] = useState<ChartOptions<'line'>>({});
  const [optionsHour, setOptionsHour] = useState<ChartOptions<'line'>>({});
  const [optionsMonth, setOptionsMonth] = useState<ChartOptions<'line'>>({});
  const [optionsWeek, setOptionsWeek] = useState<ChartOptions<'line'>>({});
  const [optionsDay, setOptionsDay] = useState<ChartOptions<'line'>>({});
  const [optionsYear, setOptionsYear] = useState<ChartOptions<'line'>>({});

  //hard code interest rate in decimal (4.1%)
  const annualInterestRate = 0.041;

  const principalInvested = useSelector((state: any) => state.userWalletData.principalInvested);
  const initialPrincipal = useSelector((state: any) => state.userWalletData.initialPrincipal);
  const initialInvestmentDate = useSelector((state: any) => state.userWalletData.initialInvestmentDate);
  const principalInvestedHistory = useSelector((state: any) => state.userWalletData.principalInvestedHistory);

  const [hourlyChange, setHourlyChange] = useState(0);
  const [dailyChange, setDailyChange] = useState(0);
  const [weeklyChange, setWeeklyChange] = useState(0);
  const [monthlyChange, setMonthlyChange] = useState(0);
  const [yearlyChange, setYearlyChange] = useState(0);


  const currentValue = valueAtTime(currentTimeInSeconds, initialPrincipal, 
  initialInvestmentDate, principalInvestedHistory)

  const [upBy, setUpBy] = useState(currentValue);

  let upByPrecision = 9;


  if (currentValue >= 10) {
      upByPrecision = 8;
  }
  if (currentValue >= 100) {
      upByPrecision = 7;
  }
  if (currentValue >= 1000) {
      upByPrecision = 6;
  }
  if (currentValue >= 10000) {
    upByPrecision = 5;
}

  useEffect(() => {
    const interval = setInterval(() => {
        setUpBy(prevUpBy => prevUpBy + (10 ** -upByPrecision));
    }, 240); // Updates every 200ms

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(interval);
}, [upByPrecision]);


  useEffect(() => {
    if (initialPrincipal) {
        fetchBalanceHistoriesAndSetUpGraph();
    }
    }, []); // Provide an empty dependency array
    
    function fetchBalanceHistoriesAndSetUpGraph() {

        const originationDate = Number(initialInvestmentDate) * 1000; // Multiply by 1000 to convert to milliseconds
        const originationPrice = initialPrincipal as number;
        const priceChanges = principalInvestedHistory as Record<string, number>;
  
        // Combine origination date and price with price changes

        let prices = [];

        if (priceChanges) {
          prices = [
            { time: originationDate, price: originationPrice },
            ...Object.entries(priceChanges).map(([time, price]) => ({
              time: parseInt(time, 10) * 1000,
              price: price,
            })),
          ];
        } else {
          prices = [{ time: originationDate, price: originationPrice }];
        }
  
        // Sort prices by time (ascending order)
        prices.sort((a, b) => a.time - b.time);


  
        //console.log('Retrieved price histories:', prices);
  
        const currentTimeInMilliSeconds = Date.now(); // Current time in milliseconds

        const fiveMinutesAgoInMilliSeconds = currentTimeInMilliSeconds - 300000.0;
        const oneHourAgoInMilliSeconds = currentTimeInMilliSeconds - 3600000.0;
        const oneDayAgoInMilliSeconds = currentTimeInMilliSeconds - 86400000.0;
        const oneWeekAgoInMilliSeconds = currentTimeInMilliSeconds - 604800000.0;
        const oneMonthAgoInMilliSeconds = currentTimeInMilliSeconds - 2592000000.0;
        const oneYearAgoInMilliSeconds = currentTimeInMilliSeconds - 31540000000.0;
    
        //Find the format of the times
        if (fiveMinutesAgoInMilliSeconds <= originationDate) {
          setOptionsAll(optionsMinScale)
          setOptionsMonth(optionsMinScale)
          setOptionsDay(optionsMinScale)
          setOptionsWeek(optionsMinScale)
          setOptionsHour(optionsMinScale)
          setOptionsYear(optionsMinScale)
        } else if (oneDayAgoInMilliSeconds <= originationDate) {
          setOptionsHour(optionsSmallScale)
          setOptionsDay(optionsSmallScale)
          setOptionsWeek(optionsSmallScale)
          setOptionsMonth(optionsSmallScale)
          setOptionsYear(optionsSmallScale)
          setOptionsAll(optionsSmallScale)
        } else if (oneWeekAgoInMilliSeconds <= originationDate) {
          setOptionsHour(optionsSmallScale)
          setOptionsDay(optionsSmallScale)
          setOptionsWeek(optionsMidScale)
          setOptionsMonth(optionsMidScale)
          setOptionsYear(optionsMidScale)
          setOptionsAll(optionsMidScale)
        } else {
          setOptionsHour(optionsSmallScale)
          setOptionsDay(optionsSmallScale)
          setOptionsWeek(optionsMidScale)
          setOptionsMonth(optionsMidScale)
          setOptionsYear(optionsMaxScale)
          setOptionsAll(optionsMaxScale)
        }
        
        //Probe the data to find the first point on the graph
        let hourTimeProbe = 0;
        let dayTimeProbe = 0;
        let weekTimeProbe = 0;
        let monthTimeProbe = 0;
        let yearTimeProbe = 0;


        for (let i = 0; i < prices.length; i++) {
          const time = prices[i].time;
        
          if (time <= oneHourAgoInMilliSeconds && time > hourTimeProbe) {
            hourTimeProbe = time;
          }

          if (time <= oneDayAgoInMilliSeconds && time > dayTimeProbe) {
        
            dayTimeProbe = time;
          }

          if (time <= oneWeekAgoInMilliSeconds && time > weekTimeProbe) {

            weekTimeProbe = time;
          }

          if (time <= oneYearAgoInMilliSeconds && time > yearTimeProbe) {

            yearTimeProbe = time;
          }

          if (time <= oneMonthAgoInMilliSeconds && time > monthTimeProbe) {
        
            monthTimeProbe = time;
          }

        };

        //Hour

        const chartDataForHour = [];
        const labelsHour = [];

        if (hourTimeProbe !== 0) {
          //Get the probe price and the time limit for the first point
          labelsHour.push(new Date(oneHourAgoInMilliSeconds).toISOString());
          
          const beginnigValueForHour = valueAtTime((oneDayAgoInMilliSeconds/1000), initialPrincipal, 
          initialInvestmentDate, principalInvestedHistory)
          chartDataForHour.push(beginnigValueForHour);

          setDailyChange(currentValue-beginnigValueForHour)

        } else {
          // There is no data older than one day, use the origination date and price
          const originationDate = new Date(prices[0].time);
          labelsHour.push(new Date(originationDate).toISOString());
          
          chartDataForHour.push(prices[0].price);
          setDailyChange(currentValue-initialPrincipal);
        }

        //Get every point in between

        const pricesFilteredByHour = prices.filter((entry) => entry.time >= oneHourAgoInMilliSeconds);

        // Add the filtered data to the labels and chart data
        pricesFilteredByHour.forEach((entry) => {
          const date = new Date(entry.time);
          labelsHour.push(date.toISOString());
          chartDataForHour.push(entry.price);
        });

        // Add the current time and price to the labels and chart data

        labelsHour.push(new Date(currentTimeInMilliSeconds).toISOString());
        chartDataForHour.push((currentValue || 0));

        setChartDataHour({
          labels: labelsHour,
          datasets: [
            {
              label: 'Value',
              data: chartDataForHour,
              fill: false,
              borderColor: '#333333',
              cubicInterpolationMode: 'monotone',
            },
          ],
        });


        //Day

        // Find the closest price greater than one hour ago and its corresponding time

        const chartDataForDay = [];
        const labelsDay = [];

        if (dayTimeProbe !== 0) {
          //Get the probe price and the time limit for the first point
          labelsDay.push(new Date(oneDayAgoInMilliSeconds).toISOString());
          
          const beginnigValueForDay = valueAtTime((oneDayAgoInMilliSeconds/1000), initialPrincipal, 
          initialInvestmentDate, principalInvestedHistory)
          chartDataForDay.push(beginnigValueForDay);

          setDailyChange(currentValue-beginnigValueForDay)

        } else {
          // There is no data older than one day, use the origination date and price
          const originationDate = new Date(prices[0].time);
          labelsDay.push(new Date(originationDate).toISOString());
          
          chartDataForDay.push(prices[0].price);
          setDailyChange(currentValue-initialPrincipal);
        }


        
        //Get every point in between
        const pricesFilteredByDay = prices.filter((entry) => entry.time >= oneDayAgoInMilliSeconds);

        // Add the filtered data to the labels and chart data
        pricesFilteredByDay.forEach((entry) => {
          const date = new Date(entry.time);
          labelsDay.push(date.toISOString());
          chartDataForDay.push(entry.price);
        });

        labelsDay.push(new Date(currentTimeInMilliSeconds).toISOString());
        chartDataForDay.push((currentValue || 0));

        setChartDataDay({
          labels: labelsDay,
          datasets: [
            {
              label: 'Value',
              data: chartDataForDay,
              fill: false,
              borderColor: '#333333',
              cubicInterpolationMode: 'monotone',
            },
          ],
        });


        //Week

        // Find the closest price greater than one hour ago and its corresponding time

        const chartDataForWeek = [];
        const labelsWeek = [];

        if (weekTimeProbe !== 0) {
          //Get the probe price and the time limit for the first point
          labelsWeek.push(new Date(oneWeekAgoInMilliSeconds).toISOString());

          const beginnigValueForWeek = valueAtTime((oneWeekAgoInMilliSeconds/1000), initialPrincipal, 
          initialInvestmentDate, principalInvestedHistory)
          chartDataForWeek.push(beginnigValueForWeek);

          setWeeklyChange(currentValue-beginnigValueForWeek)

        } else {
          // There is no data older than one hour, use the origination date and price
          const originationDate = new Date(prices[0].time);
          labelsWeek.push(new Date(originationDate).toISOString());
          chartDataForWeek.push(prices[0].price);
          setWeeklyChange(currentValue-initialPrincipal);
        }

        //Get every point in between
        const pricesFilteredByWeek = prices.filter((entry) => entry.time >= oneWeekAgoInMilliSeconds);

        // Add the filtered data to the labels and chart data
        pricesFilteredByWeek.forEach((entry) => {
          const date = new Date(entry.time);
          labelsWeek.push(date.toISOString());
          chartDataForWeek.push(entry.price);
        });

        labelsWeek.push(new Date(currentTimeInMilliSeconds).toISOString());
        chartDataForWeek.push((currentValue || 0));

        setChartDataWeek({
          labels: labelsWeek,
          datasets: [
            {
              label: 'Value',
              data: chartDataForWeek,
              fill: false,
              borderColor: '#333333',
              cubicInterpolationMode: 'monotone',
            },
          ],
        });


        //Month

        // Find the closest price greater than one hour ago and its corresponding time

        const chartDataForMonth = [];
        const labelsMonth = [];

        if (monthTimeProbe !== 0) {
          //Get the probe price and the time limit for the first point
          labelsMonth.push(new Date(oneMonthAgoInMilliSeconds).toISOString());

          const beginnigValueForMonth = valueAtTime((oneMonthAgoInMilliSeconds/1000), initialPrincipal, 
          initialInvestmentDate, principalInvestedHistory)
          chartDataForMonth.push(beginnigValueForMonth);

          setMonthlyChange(currentValue-beginnigValueForMonth)

        } else {
          // There is no data older than one hour, use the origination date and price
          const originationDate = new Date(prices[0].time);
          labelsMonth.push(new Date(originationDate).toISOString());
          chartDataForMonth.push(prices[0].price);
          setMonthlyChange(currentValue-initialPrincipal);
        }

        //Get every point in between
        const pricesFilteredByMonth = prices.filter((entry) => entry.time >= oneMonthAgoInMilliSeconds);

        // Add the filtered data to the labels and chart data
        pricesFilteredByMonth.forEach((entry) => {
          const date = new Date(entry.time);
          labelsMonth.push(date.toISOString());
          chartDataForMonth.push(entry.price);
        });

        labelsMonth.push(new Date(currentTimeInMilliSeconds).toISOString());
        chartDataForMonth.push((currentValue || 0));

        //console.log('chartDataForMonth ', chartDataForMonth);
        //console.log('labelsMonth ', labelsMonth);

        setChartDataMonth({
          labels: labelsMonth,
          datasets: [
            {
              label: 'Value',
              data: chartDataForMonth,
              fill: false,
              borderColor: '#333333',
              cubicInterpolationMode: 'monotone',
            },
          ],
        });

        //Year

        // Find the closest price greater than one hour ago and its corresponding time

        const chartDataForYear = [];
        const labelsYear = [];

        if (yearTimeProbe !== 0) {
          //Get the probe price and the time limit for the first point
          labelsYear.push(new Date(oneYearAgoInMilliSeconds).toISOString());

          const beginnigValueForYear = valueAtTime((oneYearAgoInMilliSeconds/1000), initialPrincipal, 
          initialInvestmentDate, principalInvestedHistory)
          chartDataForYear.push(beginnigValueForYear);

          setYearlyChange(currentValue-beginnigValueForYear)

        } else {
          // There is no data older than one hour, use the origination date and price
          const originationDate = new Date(prices[0].time);
          labelsYear.push(new Date(originationDate).toISOString());
          chartDataForYear.push(prices[0].price);
          setYearlyChange(currentValue-initialPrincipal);
        }

        //Get every point in between
        const pricesFilteredByYear = prices.filter((entry) => entry.time >= oneYearAgoInMilliSeconds);

        // Add the filtered data to the labels and chart data
        pricesFilteredByYear.forEach((entry) => {
          const date = new Date(entry.time);
          labelsYear.push(date.toISOString());
          chartDataForYear.push(entry.price);
        });

        labelsYear.push(new Date(currentTimeInMilliSeconds).toISOString());
        chartDataForYear.push((currentValue || 0));

        //console.log('chartDataForYear ', chartDataForYear);
        //console.log('labelsYear ', labelsYear);

        setChartDataYear({
          labels: labelsYear,
          datasets: [
            {
              label: 'Value',
              data: chartDataForYear,
              fill: false,
              borderColor: '#333333',
              cubicInterpolationMode: 'monotone',
            },
          ],
        });

        //All
        const labelsAll = prices.map((entry) => {
          const date = new Date(entry.time);
          return date.toISOString();
        });
  
        const chartDataAll = prices.map((entry) => entry.price);
  
        labelsAll.push(new Date(currentTimeInMilliSeconds).toISOString());
        chartDataAll.push((currentValue || 0));

        setChartDataAll({
          labels: labelsAll,
          datasets: [
            {
              label: 'Value',
              data: chartDataAll,
              fill: false,
              borderColor: '#333333',
              cubicInterpolationMode: 'monotone',
            
            },
          ],
        });

  }

  const optionsMaxScale: ChartOptions<'line'> = {
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'month',
          displayFormats: {
            day: 'MMM YYYY',
          },
        },
        ticks: {
          maxTicksLimit: screenSize === 'small' ? 4 : 6,
          color: '#333333',
        },
      },
      y: {
        beginAtZero: false,
        ticks: {
          precision: 13,
          color: '#333333',
        },
      },
    },
    elements:{
      line: {
        tension: 0.5,
        cubicInterpolationMode: 'default',
      },
      point:{
        radius: 0,
      }
    }
  };

  const optionsMidScale: ChartOptions<'line'> = {
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
          displayFormats: {
            day: 'MMM DD',
          },
        },
        ticks: {
          maxTicksLimit: screenSize === 'small' ? 4 : 6,
          color: '#333333',
        },
      },
      y: {
        beginAtZero: false,
        ticks: {
          precision: 10,
          color: '#333333',
        },
      },
    },
    elements:{
      line: {
        tension: 0.5,
        cubicInterpolationMode: 'default',
      },
      point:{
        radius: 0,
      }
    }
  };

  const optionsSmallScale: ChartOptions<'line'> = {
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'minute',
          displayFormats: {
            day: 'h:mm A',
          },
        },
        ticks: {
          maxTicksLimit: screenSize === 'small' ? 4 : 6,
          color: '#333333',
        },
      },
      y: {
        beginAtZero: false,
        ticks: {
          precision: 10,
          color: '#333333',
        },
      },
    },
    elements:{
      line: {
        tension: 0.5,
        cubicInterpolationMode: 'default',
      },
      point:{
        radius: 0,
      }
    }
  };

  const optionsMinScale: ChartOptions<'line'> = {
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'second',
          displayFormats: {
            minute: 'h:mm:ss',
          },
        },
        ticks: {
          maxTicksLimit: screenSize === 'small' ? 4 : 6,
          color: '#333333',
        },
      },
      y: {
        beginAtZero: false,
        ticks: {
          precision: 10,
          color: '#333333',
        },
      },
    },
    elements:{
      line: {
        tension: 0.5,
        cubicInterpolationMode: 'default',
      },
      point:{
        radius: 0,
      }
    }
  };


      const [selectedTimeframeButton, setSelectedTimeframeButton] = useState('all');


      const handleHourButtonClick = () => {
        setSelectedTimeframeButton('hour');
      };
      
      const handleDayButtonClick = () => {
        setSelectedTimeframeButton('day');
      };
      
      const handleWeekButtonClick = () => {
        setSelectedTimeframeButton('week');
      };
      
      const handleMonthButtonClick = () => {
        setSelectedTimeframeButton('month');
      };
      const handleYearButtonClick = () => {
        setSelectedTimeframeButton('year');
      };
      const handleAllButtonClick = () => {
        setSelectedTimeframeButton('all');
      };

      
      const styles = {
        tradeTimeframeButtonRow: {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 10px',
          gap: '10px',
        },
        button: {
          flex: 1,
          padding: '5px',
          paddingTop: (screenSize === 'small') ? '12px' : '0px',
          paddingBottom: (screenSize === 'small') ? '12px' : '0px',
          backgroundColor: 'white',
          color: '#333333',
          border: 'none',
          borderRadius: '4px',
          fontSize: '14px',
          cursor: 'pointer',
        },
        selectedButton: {
          flex: 1,
          padding: '5px',
          paddingTop: (screenSize === 'small') ? '12px' : '0px',
          paddingBottom: (screenSize === 'small') ? '12px' : '0px',
          backgroundColor: '#333333',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontSize: '16px',
        },
      };

   return (
    <div>

<span style={{ fontSize: (screenSize === 'small') ? '17px': '20px', marginLeft: '10px' }}>$</span>
          <span style={{ fontSize: (screenSize === 'small') ? '25px':'36px' }}>
          { 
  upBy.toFixed(upByPrecision).split('.')[0].toLocaleString() + '.' + upBy.toFixed(upByPrecision).split('.')[1]
}
          </span> 

    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', 
    marginBottom: '5px', marginLeft: '10px', marginTop: (screenSize === 'small') ? '2px':'-15px' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ color: '#333333' }}>
            
        {selectedTimeframeButton === 'hour' && (
            <>
              {hourlyChange >= 0 ? (
            <>
            <span style={{ fontSize: '24px', color: '#4CD964' }}>
                            
            +{parseFloat(hourlyChange.toFixed(6)).toString()}
                </span>
                <span style={{ fontSize: '20px', color: '#4CD964', marginLeft: '5px' }}>
                
                ({(((currentValue-(currentValue-hourlyChange))/currentValue)*100).toLocaleString(undefined, {
            minimumFractionDigits: 5,
            maximumFractionDigits: 5,
            })}%)
                </span>
                </>
              ) : (
                <>
                <span style={{ fontSize: '24px', color: '#FF3B30' }}>
                
                {parseFloat(hourlyChange.toFixed(6)).toString()}
                    </span>
                    <span style={{ fontSize: '20px', color: '#FF3B30', marginLeft: '5px' }}>
                    
                    ({((currentValue)/(currentValue+(hourlyChange*-1))*100).toLocaleString(undefined, {
                minimumFractionDigits: 5,
                maximumFractionDigits: 5,
                })}%)
                    </span>
                </>
              ) }
                </>
            )}


          {selectedTimeframeButton === 'day' && (
            <>
              {dailyChange >= 0 ? (
            <>
            <span style={{ fontSize: '24px', color: '#4CD964' }}>
                            
            +{parseFloat(dailyChange.toFixed(6)).toString()}
                </span>
                <span style={{ fontSize: '20px', color: '#4CD964', marginLeft: '5px' }}>
                
                ({(((currentValue-(currentValue-dailyChange))/currentValue)*100).toLocaleString(undefined, {
            minimumFractionDigits: 5,
            maximumFractionDigits: 5,
            })}%)
                </span>
                </>
              ) : (
                <>
                <span style={{ fontSize: '24px', color: '#FF3B30' }}>
                
                {parseFloat(dailyChange.toFixed(6)).toString()}
                    </span>
                    <span style={{ fontSize: '20px', color: '#FF3B30', marginLeft: '5px' }}>
                    
                    ({((currentValue)/(currentValue+(dailyChange*-1))*100).toLocaleString(undefined, {
                minimumFractionDigits: 5,
                maximumFractionDigits: 5,
                })}%)
                    </span>
                </>
              ) }
                </>
            )}


        {selectedTimeframeButton === 'week' && (
            <>
              {weeklyChange >= 0 ? (
            <>
            <span style={{ fontSize: '24px', color: '#4CD964' }}>
                            
            +{parseFloat(weeklyChange.toFixed(6)).toString()}
                </span>
                <span style={{ fontSize: '20px', color: '#4CD964', marginLeft: '5px' }}>
                
                ({(((currentValue-(currentValue-weeklyChange))/currentValue)*100).toLocaleString(undefined, {
            minimumFractionDigits: 5,
            maximumFractionDigits: 5,
            })}%)
                </span>
                </>
              ) : (
                <>
                <span style={{ fontSize: '24px', color: '#FF3B30' }}>
                
                {parseFloat(weeklyChange.toFixed(6)).toString()}
                    </span>
                    <span style={{ fontSize: '20px', color: '#FF3B30', marginLeft: '5px' }}>
                    
                    ({((currentValue)/(currentValue+(weeklyChange*-1))*100).toLocaleString(undefined, {
                minimumFractionDigits: 5,
                maximumFractionDigits: 5,
                })}%)
                    </span>
                </>
              ) }
                </>
            )}

            {selectedTimeframeButton === 'month' && (
            <>
              {monthlyChange >= 0 ? (
            <>
            <span style={{ fontSize: '24px', color: '#4CD964' }}>
                            
            +{parseFloat(monthlyChange.toFixed(6)).toString()}
                </span>
                <span style={{ fontSize: '20px', color: '#4CD964', marginLeft: '5px' }}>
                
                ({(((currentValue-(currentValue-monthlyChange))/currentValue)*100).toLocaleString(undefined, {
            minimumFractionDigits: 5,
            maximumFractionDigits: 5,
            })}%)
                </span>
                </>
              ) : (
                <>
                <span style={{ fontSize: '24px', color: '#FF3B30' }}>
                
                {parseFloat(monthlyChange.toFixed(6)).toString()}
                    </span>
                    <span style={{ fontSize: '20px', color: '#FF3B30', marginLeft: '5px' }}>
                    
                    ({((currentValue)/(currentValue+(monthlyChange*-1))*100).toLocaleString(undefined, {
                minimumFractionDigits: 5,
                maximumFractionDigits: 5,
                })}%)
                    </span>
                </>
              ) }




                </>
            )}

        {selectedTimeframeButton === 'year' && (
            <>
              {yearlyChange >= 0 ? (
            <>
            <span style={{ fontSize: '24px', color: '#4CD964' }}>
                            
            +{parseFloat(yearlyChange.toFixed(6)).toString()}
                </span>
                <span style={{ fontSize: '20px', color: '#4CD964', marginLeft: '5px' }}>
                
                ({(((currentValue-(currentValue-yearlyChange))/currentValue)*100).toLocaleString(undefined, {
            minimumFractionDigits: 5,
            maximumFractionDigits: 5,
            })}%)
                </span>
                </>
              ) : (
                <>
                <span style={{ fontSize: '24px', color: '#FF3B30' }}>
                
                {parseFloat(yearlyChange.toFixed(6)).toString()}
                    </span>
                    <span style={{ fontSize: '20px', color: '#FF3B30', marginLeft: '5px' }}>
                    
                    ({((currentValue)/(currentValue+(yearlyChange*-1))*100).toLocaleString(undefined, {
                minimumFractionDigits: 5,
                maximumFractionDigits: 5,
                })}%)
                    </span>
                </>
              ) }
                </>
            )}




        {selectedTimeframeButton === 'all' && (
            <>
              {yearlyChange >= 0 ? (
            <>
            <span style={{ fontSize: '24px', color: '#4CD964' }}>
                            
            +{parseFloat(yearlyChange.toFixed(6)).toString()}
                </span>
                <span style={{ fontSize: '20px', color: '#4CD964', marginLeft: '5px' }}>
                
                ({(((currentValue-(currentValue-yearlyChange))/currentValue)*100).toLocaleString(undefined, {
            minimumFractionDigits: 5,
            maximumFractionDigits: 5,
            })}%)
                </span>
                </>
              ) : (
                <>
                <span style={{ fontSize: '24px', color: '#FF3B30' }}>
                
                {parseFloat(yearlyChange.toFixed(6)).toString()}
                    </span>
                    <span style={{ fontSize: '20px', color: '#FF3B30', marginLeft: '5px' }}>
                    
                    ({((currentValue)/(currentValue+(yearlyChange*-1))*100).toLocaleString(undefined, {
                minimumFractionDigits: 5,
                maximumFractionDigits: 5,
                })}%)
                    </span>
                </>
              ) }
                </>
            )}

            

          
        </div>
      </div>


      {screenSize==='large' && (          
      <div style={styles.tradeTimeframeButtonRow}>
        <button style={selectedTimeframeButton === 'hour' ? styles.selectedButton : styles.button} onClick={handleHourButtonClick}>1H</button>
        <button style={selectedTimeframeButton === 'day' ? styles.selectedButton : styles.button} onClick={handleDayButtonClick}>1D</button>
        <button style={selectedTimeframeButton === 'week' ? styles.selectedButton : styles.button} onClick={handleWeekButtonClick}>1W</button>
        <button style={selectedTimeframeButton === 'month' ? styles.selectedButton : styles.button} onClick={handleMonthButtonClick}>1M</button>
        <button style={selectedTimeframeButton === 'year' ? styles.selectedButton : styles.button} onClick={handleYearButtonClick}>1Y</button>
        <button style={selectedTimeframeButton === 'all' ? styles.selectedButton : styles.button} onClick={handleAllButtonClick}>All</button>
    </div>)}

    </div>

    {selectedTimeframeButton === 'all' && chartDataAll && (
  <Line data={chartDataAll} options={optionsAll} />
)}

{selectedTimeframeButton === 'hour' && chartDataHour && (
  <Line data={chartDataHour} options={optionsHour} />
)}

{selectedTimeframeButton === 'day' && chartDataDay && (
  <Line data={chartDataDay} options={optionsDay} />
)}

{selectedTimeframeButton === 'week' && chartDataWeek && (
  <Line data={chartDataWeek} options={optionsWeek} />
)}

{selectedTimeframeButton === 'month' && chartDataMonth && (
  <Line data={chartDataMonth} options={optionsMonth} />
)}

{selectedTimeframeButton === 'year' && chartDataYear && (
  <Line data={chartDataYear} options={optionsYear} />
)}

    {screenSize==='small' && ( 
        <div style={{marginTop: '35px'}}>        
      <div style={styles.tradeTimeframeButtonRow} >
        <button style={selectedTimeframeButton === 'hour' ? styles.selectedButton : styles.button} onClick={handleHourButtonClick}>1H</button>
        <button style={selectedTimeframeButton === 'day' ? styles.selectedButton : styles.button} onClick={handleDayButtonClick}>1D</button>
        <button style={selectedTimeframeButton === 'week' ? styles.selectedButton : styles.button} onClick={handleWeekButtonClick}>1W</button>
        <button style={selectedTimeframeButton === 'month' ? styles.selectedButton : styles.button} onClick={handleMonthButtonClick}>1M</button>
        <button style={selectedTimeframeButton === 'year' ? styles.selectedButton : styles.button} onClick={handleYearButtonClick}>1Y</button>
        <button style={selectedTimeframeButton === 'all' ? styles.selectedButton : styles.button} onClick={handleAllButtonClick}>All</button>
      </div>
      </div> 
      )}

</div>
);

};

export default YieldingChartComponent;