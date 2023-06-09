// TradingViewWidget.jsx

import React, { useEffect, useRef } from 'react';

let tvScriptLoadingPromise:any;

export default function TradingViewWidget() {
  const onLoadScriptRef:any = useRef();

  useEffect(
    () => {
      onLoadScriptRef.current = createWidget;

      if (!tvScriptLoadingPromise) {
        tvScriptLoadingPromise = new Promise((resolve) => {
          const script = document.createElement('script');
          script.id = 'tradingview-widget-loading-script';
          script.src = 'https://s3.tradingview.com/tv.js';
          script.type = 'text/javascript';
          script.onload = resolve;

          document.head.appendChild(script);
        });
      }

      tvScriptLoadingPromise.then(() => onLoadScriptRef.current && onLoadScriptRef.current());


      function createWidget() {
        if (document.getElementById('tradingview_486ff') && 'TradingView' in window) {
          //@ts-ignore
          new window.TradingView.widget({
            autosize: true,
            symbol: "NASDAQ:AAPL",
            interval: "D",
            timezone: "Etc/UTC",
            theme: "light",
            style: "1",
            locale: "en",
            toolbar_bg: "#f1f3f6",
            enable_publishing: false,
            allow_symbol_change: true,
            calendar: true,
            container_id: "tradingview_486ff",
          });
        }
      }

      return () => {onLoadScriptRef.current = null;}
    },
    []
  );

  return (
    <div className='tradingview-widget-container h-[60vh] p-5'>
      <div id='tradingview_486ff' className='h-full' />
    </div>
  );
}
