import {truncateNumber} from '@augment-vir/common';
import {LoaderAnimated24Icon} from '@toniq-labs/design-system';
import {
    cssToReactStyleObject,
    toniqFontStyles,
    Icp16Icon,
    Icp24Icon,
    toniqColors,
} from '@toniq-labs/design-system';
import {ToniqIcon} from '@toniq-labs/design-system/dist/esm/elements/react-components';
import {numberWithCommas} from '../utilities/number-utils';

function getIcpPrice(n) {
    n = Number(n) / 100000000;
    return n.toFixed(8).replace(/0{1,6}$/, '');
}

export function icpToString(priceE8s /* BigNumber */, convertToIcp, truncate) {
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
            {props.price || props.price === 0 ? <ToniqIcon icon={Icp16Icon} /> : ''}
            <span
                style={{
                    display: 'inline-flex',
                    ...cssToReactStyleObject(
                        props.bold === true || props.bold == undefined
                            ? toniqFontStyles.boldParagraphFont
                            : toniqFontStyles.paragraphFont,
                    ),
                    ...cssToReactStyleObject(toniqFontStyles.monospaceFont),
                }}
            >
                {props.text ? props.text : ''}
                {props.price || props.price === 0 ? (
                    <>
                        {icpToString(props.price, !props.clean, props.volume, props.fillAllSpots)}
                        &nbsp;{props.children}
                    </>
                ) : (
                    ''
                )}
                {props.loader ? (
                    <ToniqIcon
                        className="toniq-icon-fit-icon"
                        style={{height: '14px', width: '14px'}}
                        icon={LoaderAnimated24Icon}
                    />
                ) : (
                    ''
                )}
            </span>
        </span>
    );
}
