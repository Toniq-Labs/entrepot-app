import {toniqColors, cssToReactStyleObject, toniqFontStyles} from '@toniq-labs/design-system';

export function makeCountIndicator(count, selected) {
    return (
        <div
            style={{
                ...cssToReactStyleObject(toniqFontStyles.boldLabelFont),
                backgroundColor: selected
                    ? String(toniqColors.accentPrimary.backgroundColor)
                    : String(toniqColors.accentSecondary.backgroundColor),
                color: selected
                    ? String(toniqColors.accentPrimary.foregroundColor)
                    : String(toniqColors.accentSecondary.foregroundColor),
                minHeight: '24px',
                minWidth: '24px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '50%',
            }}
        >
            <span>{count}</span>
        </div>
    );
}

export function SelectableNameWithCount(props) {
    if (props.count === 0) {
        return undefined;
    }
    const imageElement = props.imageUrl ? (
        <div
            style={{
                height: '48px',
                width: '48px',
                borderRadius: '8px',
                backgroundSize: 'cover',
                backgroundPosition: `center`,
                marginRight: '16px',
                backgroundRepeat: 'no-repeat',
                backgroundImage: `url('${props.imageUrl}')`,
            }}
        ></div>
    ) : undefined;

    const countElement = props.count ? makeCountIndicator(props.count, props.selected) : undefined;

    return (
        <div
            onClick={props.onClick}
            style={{
                padding: '8px 0',
                minHeight: '48px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                fontWeight: props.selected ? 'bold' : 'normal',
                ...props.style,
            }}
        >
            {imageElement}
            <span
                style={{
                    ...(props.selected
                        ? cssToReactStyleObject(toniqFontStyles.boldParagraphFont)
                        : cssToReactStyleObject(toniqFontStyles.paragraphFont)),
                    flexGrow: 1,
                }}
            >
                {props.title}
            </span>
            {countElement}
            {props.children}
        </div>
    );
}
