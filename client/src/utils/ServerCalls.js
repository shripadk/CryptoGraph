import { format } from 'date-fns'

// Get current ETH price in USD
// Payload received: {status: string, message: string, result: {ethbtc: string, ethbtc_timestamp: string, ethusd: string, ethusd_timestamp: string}}}
// Action: set ethPrice state as number
const getEthPriceUSD = (func) => {
  fetch('/api/info/ethprice', {
    method: 'GET',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((data) => {
      func(data.data.result.ethusd)
    })
    .catch((err) => console.log(err))
}

// Get current BTC price in USD
// Payload received: number
const getBtcPriceUSD = (func) => {
  fetch('/api/info/btcprice', {
    method: 'GET',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((data) => {
      func(parseFloat(data.data).toFixed(2))
    })
    .catch((err) => console.log(err))
}

// Get exhange rates based on USD
// Payload received: {USD_CAD: number}
// Action: set exhangeRate state as number
// FREE API LIMITS
// Currency Pairs per Request: 2
// Number of Requests per Hour: 100
// Date Range in History: 8 Days
// Allowed Back in History: 1 Year(s)
const getExchangeRate = (func) => {
  fetch('/api/info/exchangerate', {
    method: 'GET',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((data) => {
      func(data.data.USD_CAD)
    })
    .catch((err) => console.log(err))
}

const getPairs = (currency, func) => {
  fetch(`/api/graph/getpairs/${currency}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((data) => {
      func(data.data)
    })
    .catch((err) => console.log(err))
}

// Get ticker data on selected symbol from server
// Payload received: {symbol: string, exchangeData: [array of objects {timestamp: number, closingPrice: number}] OR null }
// Action: set graphData state as object {symbol: string, data: [array of objects {timestamp: string, closingPrice: number}]}
const getGraphData = (symbol, pairSymbol, func, timeRange, increment) => {
  fetch(
    `/api/graph/getgraphdata/${symbol}/${pairSymbol}/${timeRange}/${increment}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
    }
  )
    .then((res) => res.json())
    .then((data) => {
      // console.log(data)
      const binanceProcessedData = data.data.binanceData
        ? data.data.binanceData.map((obj) => {
            return { ...obj, timestamp: format(obj.timestamp, 'MMM dd yyyy') }
          })
        : null
      const kucoinProcessedData = data.data.kucoinData
        ? data.data.kucoinData.map((obj) => {
            return { ...obj, timestamp: format(obj.timestamp, 'MMM dd yyyy') }
          })
        : null
      func({
        symbol: data.data.symbol,
        pairSymbol: pairSymbol,
        binanceData: binanceProcessedData,
        kucoinData: kucoinProcessedData,
      })
    })
    .catch((err) => console.log(err))
}

// Get general info and USD conversion data on the requested currency
// Payload received {conversionData: {object}, generalData: {object}}
const getCurrencyData = (symbol, func) => {
  fetch(`/api/info/currencydata/${symbol}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((data) => {
      // console.log(data)
      func(data)
    })
    .catch((err) => console.log(err))
}

// Get all available currencies on the exchange
// Payload received [array of 'string']
// Action: set allCurrencies state as array of strings containing currency codes
const getCurrencies = (func) => {
  fetch('/api/graph/getcurrencies', {
    method: 'GET',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((data) => {
      func(data.data)
    })
}

export {
  getEthPriceUSD,
  getBtcPriceUSD,
  getExchangeRate,
  getPairs,
  getGraphData,
  getCurrencies,
  getCurrencyData,
}
