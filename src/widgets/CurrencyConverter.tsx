/* eslint-disable react-hooks/exhaustive-deps */
import {
  Typography,
  Box,
  TextField,
  IconButton,
  Avatar,
  Select,
  MenuItem,
} from "@mui/material";
import { format } from "date-fns";
import { ChangeEvent, useEffect, useState } from "react";
import currencyCodes from "../assets/CurrencyList.json";
import { CurrencyExchange, SwapVert, Sync } from "@mui/icons-material";
import fx from "@m00nbyte/currency-converter";

interface CurrencyConverterProps {
  initialFromCurrency?: string;
  initialToCurrency?: string;
}

const CurrencyConverter: React.FC<CurrencyConverterProps> = ({
  initialFromCurrency = "USD",
  initialToCurrency = "JPY",
}) => {
  const [fromAmount, setFromAmount] = useState<number>(1);
  const [fromCurrency, setFromCurrency] = useState<string>(initialFromCurrency);
  const [toCurrency, setToCurrency] = useState<string>(initialToCurrency);
  const [rate, setRate] = useState<number>(0);
  const [toAmount, setToAmount] = useState<number>(0);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Swap the values of fromCurrency and toCurrency
  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
    setRate(parseFloat((1 / rate).toFixed(10)));
  };

  // Fetch currency rate
  const getExchangeRate = async () => {
    const rate = await fx(1, fromCurrency, toCurrency);
    setRate(rate);
    setToAmount(rate * fromAmount);
    setLastUpdated(new Date());
  };

  useEffect(() => {
    getExchangeRate();
  }, [fromCurrency, toCurrency]); // fromCurrencyとtoCurrencyの変更をトリガーにする

  const formatWithSignificantFigures = (
    num: number,
    digits: number
  ): string => {
    return new Intl.NumberFormat("en-US", {
      minimumSignificantDigits: digits,
      maximumSignificantDigits: digits,
    }).format(num);
  };

  return (
    <Box>
      <Box display="flex" flexDirection="row" alignItems="center" mb={1}>
        <CurrencyExchange />
        <Typography variant="h6" flexGrow={1} marginLeft={1}>
          Currency Converter
        </Typography>
        <IconButton>
          <Sync color="primary" onClick={getExchangeRate} />
        </IconButton>
      </Box>

      <TextField
        type="number"
        value={fromAmount}
        onChange={(e: ChangeEvent<{ value: string }>) => {
          setFromAmount(parseInt(e.target.value));
          setToAmount(rate * parseFloat(e.target.value));
        }}
        required
        fullWidth
        InputProps={{
          startAdornment: (
            <Avatar
              src={`https://flagsapi.com/${fromCurrency.substring(
                0,
                2
              )}/flat/64.png`}
              alt={`${fromCurrency} flag`}
              sx={{ mr: 2, borderRadius: 1, border: "1px solid #ddd" }}
            />
          ),
          endAdornment: (
            <CurrencySelect
              selectedCurrency={fromCurrency}
              handleCurrency={(e: ChangeEvent<{ value: string }>) =>
                setFromCurrency(e.target.value)
              }
            />
          ),
        }}
      />

      <Box display="flex" flexDirection="row" alignItems="center">
        <IconButton onClick={handleSwapCurrencies}>
          <SwapVert />
        </IconButton>
        <Typography>
          1 {fromCurrency} = {formatWithSignificantFigures(rate, 5)}{" "}
          {toCurrency}
        </Typography>
        <Typography variant="body2" flexGrow={1} align="right">
          {format(lastUpdated, "MMM d, h:mm a")}
        </Typography>
      </Box>

      <TextField
        type="number"
        value={toAmount}
        onChange={(e: ChangeEvent<{ value: string }>) => {
          setToAmount(parseInt(e.target.value));
          setFromAmount(parseFloat(e.target.value) / rate);
        }}
        fullWidth
        InputProps={{
          startAdornment: (
            <Avatar
              src={`https://flagsapi.com/${toCurrency.substring(
                0,
                2
              )}/flat/64.png`}
              alt={`${toCurrency} flag`}
              sx={{ mr: 2, borderRadius: 1, border: "1px solid #ddd" }}
            />
          ),
          endAdornment: (
            <CurrencySelect
              selectedCurrency={toCurrency}
              handleCurrency={(e: ChangeEvent<{ value: string }>) =>
                setToCurrency(e.target.value)
              }
            />
          ),
        }}
      />
    </Box>
  );
};

interface CurrencySelectProps {
  selectedCurrency: string;
  handleCurrency: (event: React.ChangeEvent<{ value: string }>) => void;
}

const CurrencySelect: React.FC<CurrencySelectProps> = ({
  selectedCurrency,
  handleCurrency,
}) => {
  return (
    <Select
      value={selectedCurrency}
      onChange={() => handleCurrency}
      disableUnderline={true}
      variant="standard"
    >
      {currencyCodes.map((currency) => (
        <MenuItem key={currency} value={currency}>
          {currency}
        </MenuItem>
      ))}
    </Select>
  );
};

export default CurrencyConverter;
