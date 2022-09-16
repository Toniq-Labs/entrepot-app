const oneMinute = 60_000;
const oneHour = oneMinute * 60;
const oneDay = 24 * oneHour;
const oneMonth = 30 * oneDay;
const oneYear = 365 * oneDay;

const quantities = [
  {
    single: oneYear,
    term: 'Year',
  },
  {
    single: oneMonth,
    term: 'Month',
  },
  {
    single: oneDay,
    term: 'Day',
  },
  {
    single: oneMinute,
    term: 'Minute',
  },
];

export function getRelativeDate(input) {
  const nowNumber = Date.now();
  const thenNumber = Number(input);
  const diff = nowNumber - thenNumber;

  const matched = quantities.find(quantity => diff >= quantity.single);

  if (matched) {
    const relativeAmount = Math.floor(diff / matched.single);
    const relativeTerm = `${matched.term}${relativeAmount > 1 ? 's' : ''}`;
    return `${relativeAmount} ${relativeTerm} Ago`;
  } else {
    return 'Just Now';
  }
}
