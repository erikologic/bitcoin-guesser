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
    rateUsd: 100000,
  },
  // timestamp: falsy will be filled with Date.now()
}

app.use(express.json());

app.get('/bitcoin', (req, res) => {
  if (!store.timestamp) {
    const withCurrentTimestamp = { timestamp: Date.now() }
    res.send({ ...store, ...withCurrentTimestamp });
  } else {
    res.send(store);
  }
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
