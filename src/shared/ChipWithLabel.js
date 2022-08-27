import {cssToReactStyleObject, toniqFontStyles} from '@toniq-labs/design-system';
import {ToniqChip} from '@toniq-labs/design-system/dist/esm/elements/react-components';

export function ChipWithLabel(props) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        alignItems: 'stretch',
        textAlign: 'center',
        flexBasis: '0',
        minWidth: '80px',
        flexGrow: 1,
        ...props.style,
      }}
      key={props.label}
    >
      <span
        style={{
          textTransform: 'uppercase',
          ...cssToReactStyleObject(toniqFontStyles.labelFont),
        }}
      >
        {props.label}
      </span>
      <ToniqChip
        style={{
          ...cssToReactStyleObject(toniqFontStyles.boldFont),
          ...cssToReactStyleObject(toniqFontStyles.monospaceFont),
          fontSize: '15px',
        }}
        className="toniq-chip-secondary"
        icon={props.icon}
        text={props.text}
      ></ToniqChip>
    </div>
  );
}
