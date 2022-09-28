import {truncateNumber} from '../truncation';
import {
  cssToReactStyleObject,
  toniqFontStyles,
  Icp16Icon,
  Icp24Icon,
} from '@toniq-labs/design-system';
import {ToniqIcon} from '@toniq-labs/design-system/dist/esm/elements/react-components';

function getIcpPrice(n) {
  n = Number(n) / 100000000;
  return n.toFixed(8).replace(/0{1,6}$/, '');
}
function numberWithCommas(x) {
  var parts = x.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

export function icpToString(priceE8s /* BigInt */, convertToIcp, truncate) {
  const initialPrice = convertToIcp ? getIcpPrice(priceE8s) : priceE8s;

  if (truncate) {
    return truncateNumber(initialPrice);
  } else {
    return numberWithCommas(initialPrice);
  }
}

export default function PriceICP(props) {
  return (
    <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}>
      <ToniqIcon icon={props.large ? Icp24Icon : Icp16Icon} />
      <span
        style={{
          ...cssToReactStyleObject(toniqFontStyles.boldFont),
          ...cssToReactStyleObject(
            props.large ? toniqFontStyles.h3Font : toniqFontStyles.boldParagraphFont,
            toniqFontStyles.monospaceFont,
          ),
        }}
      >
        {icpToString(props.price, !props.clean, props.volume)}
      </span>
    </span>
  );
}
