import {
    Typography,
    Box,
    TextField,
    IconButton,
    Paper,
    Avatar,
    Select,
    MenuItem,
    SelectChangeEvent,
  } from "@mui/material";
  import { format } from "date-fns";
  import { useEffect, useState } from "react";
  import { CurrencyExchange, SwapVert, Sync } from "@mui/icons-material";
  import fx from "@m00nbyte/currency-converter";
  import React from "react";
  
  interface CurrencyConverterProps {
    
  }
  
  export const CurrencyConverter: React.FC<CurrencyConverterProps> = () => {
    const [fromAmount, setFromAmount] = useState(1.0);
    const [fromCurrency, setFromCurrency] = useState<string>("USD");
    const [toAmount, setToAmount] = useState<number>(0);
    const [toCurrency, setToCurrency] = useState<string>("JPY");
    const [currencyList, setCurrencyList] = useState<string[]>([]);
    const [rate, setRate] = useState(0);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
    // fromCurrencyとtoCurrencyを入れ替える
    const handleSwapCurrencies = () => {
      setFromCurrency(toCurrency);
      setToCurrency(fromCurrency);
      setFromAmount(toAmount);
      setToAmount(fromAmount);
      setRate(parseFloat((1 / rate).toFixed(10)));
    };
  
    // レートの取得
    const getExchangeRate = async () => {
      const rates = await fx();
      const rate = rates[toCurrency] / rates[fromCurrency];
      setRate(rate);
      setLastUpdated(new Date());
      setCurrencyList(Object.keys(rates));
    };
  
    // 通貨ペア設定時
    useEffect(() => {
      getExchangeRate();
    }, [toCurrency, fromCurrency]);
  
    // レート変更時
    useEffect(() => {
      setToAmount(rate * fromAmount);
    }, [rate]);
  
    // 小数点以下を含めて0を除いて5桁の数字を表示する
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
      <Paper sx={{ padding: 2 }}>
        <Box display="flex" flexDirection="row" alignItems="center" mb={1}>
          <CurrencyExchange />
          <Typography variant="h6" flexGrow={1} marginLeft={1}>
            Currency Converter
          </Typography>
          <IconButton onClick={getExchangeRate}>
            <Sync color="primary" />
          </IconButton>
        </Box>
  
        <TextField
          type="number"
          value={fromAmount}
          onChange={(e) => {
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
                currencyList={currencyList}
                handleCurrency={(e) => setFromCurrency(e.target.value)}
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
          onChange={(e) => {
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
                currencyList={currencyList}
                handleCurrency={(e) => setToCurrency(e.target.value)}
              />
            ),
          }}
        />
      </Paper>
    );
  };
  
  interface CurrencySelectProps {
    selectedCurrency: string;
    currencyList: string[];
    handleCurrency: (event: SelectChangeEvent<string>) => void;
  }
  
  const CurrencySelect: React.FC<CurrencySelectProps> = ({
    selectedCurrency,
    currencyList,
    handleCurrency,
  }) => {
    // Extract the country code from the selected currency code
  
    return (
      <Select
        value={selectedCurrency}
        onChange={(e) => handleCurrency(e)}
        disableUnderline={true}
        variant="standard"
      >
        {currencyList.map((currency) => (
          <MenuItem key={currency} value={currency}>
            {currency}
          </MenuItem>
        ))}
      </Select>
    );
  };