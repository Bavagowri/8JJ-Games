// pages/index.page.jsx
import React from "react";
import App from "../src/App";

export { Page };

function Page({ pageContext }) {
  return <App url={pageContext?.urlPathname || '/'} />;
}