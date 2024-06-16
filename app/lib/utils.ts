export const formatRate = (rate: string) =>
  "$ " +
  parseFloat(rate)
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
