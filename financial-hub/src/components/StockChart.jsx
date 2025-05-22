import React, { useEffect, useRef } from 'react';
import axios from 'axios';
import { createChart } from 'lightweight-charts';
import styles from './StockChart.module.css';

const StockChart = ({ symbol, chartType }) => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRef = useRef(null);
  const resizeObserverRef = useRef(null);

  useEffect(() => {
    const container = chartContainerRef.current;
    if (!container) return;

    // Clean up previous chart
    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
    }
    if (resizeObserverRef.current) {
      resizeObserverRef.current.disconnect();
      resizeObserverRef.current = null;
    }

    const chart = createChart(container, {
      width: container.clientWidth,
      height: container.clientHeight,
      layout: {
        background: { color: '#1e1e1e' },
        textColor: '#e1e1e1',
      },
      grid: {
        vertLines: { color: '#444' },
        horzLines: { color: '#444' },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
      crosshair: {
        mode: 0,
      },
      priceScale: {
        borderColor: '#71649C',
      },
    });
    chartRef.current = chart;

    let series;
    if (chartType === 'candlestick') {
      series = chart.addCandlestickSeries({
        upColor: '#26a69a',
        downColor: '#ef5350',
        borderVisible: false,
        wickUpColor: '#26a69a',
        wickDownColor: '#ef5350',
      });
    } else if (chartType === 'bar') {
      series = chart.addBarSeries({
        upColor: '#26a69a',
        downColor: '#ef5350',
        thinBars: false,
      });
    } else if (chartType === 'line') {
      series = chart.addLineSeries({
        color: '#26a69a',
        lineWidth: 2,
      });
    } else if (chartType === 'area') {
      series = chart.addAreaSeries({
        topColor: 'rgba(38, 166, 154, 0.56)',
        bottomColor: 'rgba(38, 166, 154, 0.04)',
        lineColor: '#26a69a',
        lineWidth: 2,
      });
    } else if (chartType === 'baseline') {
      series = chart.addBaselineSeries({
        topLineColor: '#26a69a',
        topFillColor1: 'rgba(38, 166, 154, 0.33)',
        topFillColor2: 'rgba(38, 166, 154, 0.01)',
        bottomLineColor: '#ef5350',
        bottomFillColor1: 'rgba(239, 83, 80, 0.33)',
        bottomFillColor2: 'rgba(239, 83, 80, 0.01)',
        lineWidth: 2,
        baseValue: { type: 'price', price: 0 },
      });
    } else {
      series = chart.addCandlestickSeries();
    }
    seriesRef.current = series;

    axios
      .get(`http://localhost:5000/api/candle/${symbol}`)
      .then(({ data }) => {
        if (
          !data ||
          !Array.isArray(data.o) ||
          !Array.isArray(data.h) ||
          !Array.isArray(data.l) ||
          !Array.isArray(data.c) ||
          !Array.isArray(data.t)
        ) {
          throw new Error('Invalid or missing candle data');
        }
        if (
          data.o.length === 0 ||
          data.h.length === 0 ||
          data.l.length === 0 ||
          data.c.length === 0 ||
          data.t.length === 0
        ) {
          throw new Error('Candle data arrays are empty');
        }

        if (chartType === 'line' || chartType === 'area' || chartType === 'baseline') {
          // For these, use close price only
          const chartData = data.t.map((t, i) => ({
            time: t,
            value: data.c[i],
          }));
          series.setData(chartData);
        } else {
          // For candlestick/bar, use OHLC
          const chartData = data.t.map((t, i) => ({
            time: t,
            open: data.o[i],
            high: data.h[i],
            low: data.l[i],
            close: data.c[i],
          }));
          series.setData(chartData);
        }
      })
      .catch((err) => {
        console.error('Chart data error:', err.message);
      });

    const resizeObserver = new ResizeObserver(() => {
      if (container && chart) {
        chart.applyOptions({
          width: container.clientWidth,
          height: container.clientHeight,
        });
      }
    });
    resizeObserver.observe(container);
    resizeObserverRef.current = resizeObserver;

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
        resizeObserverRef.current = null;
      }
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [symbol, chartType]);

  return (
    <div
      ref={chartContainerRef}
      className={styles['chart-container']}
    />
  );
};

export default StockChart;
