const _showListingPrice = n => {
    n = Number(n) / 100000000;
    return n.toFixed(8).replace(/0{1,6}$/, '');
};
const numberWithCommas = x => {
    var parts = x.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
};

export function icpToString(price /* BigInt */, clean, volume) {
  const initialPrice = clean
    ? numberWithCommas(price)
    : numberWithCommas(_showListingPrice(price));
  const formattedPrice = volume
    ? Number(initialPrice.replace(',', '')) >= 10000
        ? (Number(initialPrice.replace(',', '')) / 1000).toFixed(1) + 'k'
        : initialPrice
    : initialPrice;
  
  return formattedPrice;
}

export default function PriceICP(props) {
    return (
        <>
            <img
                style={{verticalAlign: 'top'}}
                src={'/currencies/icp.png'}
                height={props.size ?? 18}
                width={props.size ?? 18}
            />{' '}
            {icpToString(props.price, props.clean, props.volume)}
        </>
    );
}
