import React from "react";
import { Html, Head, Main, NextScript } from "next/document";

const document = () => {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />

        <meta name="theme-color" content="#000000" />
        <link rel="shortcut icon" href="/newfx.png" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&family=Roboto&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body className="text-slate-700 antialiased">
        <div id="page-transition"></div>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default document;
