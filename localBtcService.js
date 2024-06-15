const express = require('express');
const app = express();
const port = 9000;

let store = {
    data: {
      id: "bitcoin",
      symbol: "BTC",
      currencySymbol: "$",
      type: "crypto",
      rateUsd: "100000",
    },
    timestamp: Date.now(),
  }

app.use(express.json());

app.get('/bitcoin', (req, res) => {
    res.send(store);
});

app.post('/bitcoin', (req, res) => {
    const data = req.body;
    console.log("Setting to ", data);
    store = data;
    res.send();
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
