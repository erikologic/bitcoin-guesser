const express = require('express');
const _ = require('lodash');
const app = express();
const port = 9000;

let store = {
  data: {
    id: "bitcoin",
    symbol: "BTC",
    currencySymbol: "$",
    type: "crypto",
    rateUsd: Math.floor(Math.random() * 100000),
  },
  timestamp: Date.now(),
}

app.use(express.json());

app.get('/bitcoin', (req, res) => {
  res.send(store);
});

app.post('/bitcoin', (req, res) => {
  const data = req.body;
  const newStore = _.merge(store, data);
  console.log("Setting to ", newStore);
  store = newStore;
  res.send();
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
