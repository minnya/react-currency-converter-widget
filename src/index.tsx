import React from "react";
import ReactDOM from "react-dom/client";
import CurrencyConverter from "./widgets/CurrencyConverter";
import { Box } from "@mui/material";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Box sx={{ width: "450px" }}>
      <CurrencyConverter initialFromCurrency="USD" initialToCurrency="JPY" />
    </Box>
  </React.StrictMode>
);
