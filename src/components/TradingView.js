// TradingViewWidget.jsx

import React, { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useTheme } from "next-themes";

let tvScriptLoadingPromise;

export default function TradingViewWidget() {
  // router
  const router = useRouter();
  const query = router.query.id;

  const onLoadScriptRef = useRef();

  const { theme, setTheme } = useTheme();

  useEffect(() => {
    onLoadScriptRef.current = createWidget;

    if (!tvScriptLoadingPromise) {
      tvScriptLoadingPromise = new Promise((resolve) => {
        const script = document.createElement("script");
        script.id = "tradingview-widget-loading-script";
        script.src = "https://s3.tradingview.com/tv.js";
        script.type = "text/javascript";
        script.onload = resolve;

        document.head.appendChild(script);
      });
    }

    tvScriptLoadingPromise.then(
      () => onLoadScriptRef.current && onLoadScriptRef.current()
    );

    return () => (onLoadScriptRef.current = null);

    function createWidget() {
      if (
        document.getElementById("tradingview_94a30") &&
        "TradingView" in window
      ) {
        new window.TradingView.widget({
          autosize: false,
          symbol: `${query}`,
          interval: "D",
          width: screen.width - 300,
          height: screen.availHeight * 0.7,
          timezone: "Etc/UTC",
          theme: "dark",
          style: "1",
          locale: "en",
          enable_publishing: true,
          withdateranges: true,
          hide_side_toolbar: false,
          allow_symbol_change: true,
          details: false,
          hotlist: false,
          calendar: false,
          container_id: "tradingview_94a30",
        });
      }
    }
  }, [query]);

  return (
    <div className="tradingview-widget-container z-0 w-full">
      <div id="tradingview_94a30" className="w-full" />
      <div className="tradingview-widget-copyright">
        <a
          href="https://www.tradingview.com/"
          rel="noopener nofollow"
          target="_blank"
        >
          {/* <span className="blue-text">Track all markets on TradingView</span> */}
        </a>
      </div>
    </div>
  );
}
