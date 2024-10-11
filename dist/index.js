"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrencyConverter = void 0;
const material_1 = require("@mui/material");
const date_fns_1 = require("date-fns");
const react_1 = require("react");
const icons_material_1 = require("@mui/icons-material");
const currency_converter_1 = __importDefault(require("@m00nbyte/currency-converter"));
const react_2 = __importDefault(require("react"));
const CurrencyConverter = ({ defaultFromCurrency, defaultToCurrency, }) => {
    const [fromAmount, setFromAmount] = (0, react_1.useState)(1.0);
    const [fromCurrency, setFromCurrency] = (0, react_1.useState)(defaultFromCurrency);
    const [toAmount, setToAmount] = (0, react_1.useState)(0);
    const [toCurrency, setToCurrency] = (0, react_1.useState)(defaultToCurrency);
    const [currencyList, setCurrencyList] = (0, react_1.useState)([]);
    const [rate, setRate] = (0, react_1.useState)(0);
    const [lastUpdated, setLastUpdated] = (0, react_1.useState)(new Date());
    // fromCurrencyとtoCurrencyを入れ替える
    const handleSwapCurrencies = () => {
        setFromCurrency(toCurrency);
        setToCurrency(fromCurrency);
        setFromAmount(toAmount);
        setToAmount(fromAmount);
        setRate(parseFloat((1 / rate).toFixed(10)));
    };
    // レートの取得
    const getExchangeRate = () => __awaiter(void 0, void 0, void 0, function* () {
        const rates = yield (0, currency_converter_1.default)();
        const rate = rates[toCurrency] / rates[fromCurrency];
        setRate(rate);
        setLastUpdated(new Date());
        setCurrencyList(Object.keys(rates));
    });
    // 通貨ペア設定時
    (0, react_1.useEffect)(() => {
        getExchangeRate();
    }, [toCurrency, fromCurrency]);
    // レート変更時
    (0, react_1.useEffect)(() => {
        setToAmount(rate * fromAmount);
    }, [rate]);
    // 小数点以下を含めて0を除いて5桁の数字を表示する
    const formatWithSignificantFigures = (num, digits) => {
        return new Intl.NumberFormat("en-US", {
            minimumSignificantDigits: digits,
            maximumSignificantDigits: digits,
        }).format(num);
    };
    return (react_2.default.createElement(material_1.Paper, { sx: { padding: 2 } },
        react_2.default.createElement(material_1.Box, { display: "flex", flexDirection: "row", alignItems: "center", mb: 1 },
            react_2.default.createElement(icons_material_1.CurrencyExchange, null),
            react_2.default.createElement(material_1.Typography, { variant: "h6", flexGrow: 1, marginLeft: 1 }, "Currency Converter"),
            react_2.default.createElement(material_1.IconButton, { onClick: getExchangeRate },
                react_2.default.createElement(icons_material_1.Sync, { color: "primary" }))),
        react_2.default.createElement(material_1.TextField, { type: "number", value: fromAmount, onChange: (e) => {
                setFromAmount(parseInt(e.target.value));
                setToAmount(rate * parseFloat(e.target.value));
            }, required: true, fullWidth: true, InputProps: {
                startAdornment: (react_2.default.createElement(material_1.Avatar, { src: `https://flagsapi.com/${fromCurrency.substring(0, 2)}/flat/64.png`, alt: `${fromCurrency} flag`, sx: { mr: 2, borderRadius: 1, border: "1px solid #ddd" } })),
                endAdornment: (react_2.default.createElement(CurrencySelect, { selectedCurrency: fromCurrency, currencyList: currencyList, handleCurrency: (e) => setFromCurrency(e.target.value) })),
            } }),
        react_2.default.createElement(material_1.Box, { display: "flex", flexDirection: "row", alignItems: "center" },
            react_2.default.createElement(material_1.IconButton, { onClick: handleSwapCurrencies },
                react_2.default.createElement(icons_material_1.SwapVert, null)),
            react_2.default.createElement(material_1.Typography, null,
                "1 ",
                fromCurrency,
                " = ",
                formatWithSignificantFigures(rate, 5),
                " ",
                toCurrency),
            react_2.default.createElement(material_1.Typography, { variant: "body2", flexGrow: 1, align: "right" }, (0, date_fns_1.format)(lastUpdated, "MMM d, h:mm a"))),
        react_2.default.createElement(material_1.TextField, { type: "number", value: toAmount, onChange: (e) => {
                setToAmount(parseInt(e.target.value));
                setFromAmount(parseFloat(e.target.value) / rate);
            }, fullWidth: true, InputProps: {
                startAdornment: (react_2.default.createElement(material_1.Avatar, { src: `https://flagsapi.com/${toCurrency.substring(0, 2)}/flat/64.png`, alt: `${toCurrency} flag`, sx: { mr: 2, borderRadius: 1, border: "1px solid #ddd" } })),
                endAdornment: (react_2.default.createElement(CurrencySelect, { selectedCurrency: toCurrency, currencyList: currencyList, handleCurrency: (e) => setToCurrency(e.target.value) })),
            } })));
};
exports.CurrencyConverter = CurrencyConverter;
const CurrencySelect = ({ selectedCurrency, currencyList, handleCurrency, }) => {
    // Extract the country code from the selected currency code
    return (react_2.default.createElement(material_1.Select, { value: selectedCurrency, onChange: (e) => handleCurrency(e), disableUnderline: true, variant: "standard" }, currencyList.map((currency) => (react_2.default.createElement(material_1.MenuItem, { key: currency, value: currency }, currency)))));
};
