import {truncateNumber} from '../truncation';
import {
    cssToReactStyleObject,
    toniqFontStyles,
    Icp16Icon,
    toniqColors,
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

export default function PriceVolt(props) {
    return (
        <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}>
            <span
                style={{
                    ...cssToReactStyleObject(toniqFontStyles.boldParagraphFont),
                    ...cssToReactStyleObject(toniqFontStyles.monospaceFont),
                    fontSize: props.size ?? 10,
                }}
            >
                {icpToString(props.price, !props.clean, props.volume)}
            </span>
        </span>
    );
}
