import {
  cssToReactStyleObject,
  toniqFontStyles,
  toniqColors,
  Search24Icon,
  LayoutGrid24Icon,
  ListDetails24Icon,
} from '@toniq-labs/design-system';
import {ChipWithLabel} from '../../shared/ChipWithLabel';
import {ToniqInput, ToniqIcon} from '@toniq-labs/design-system/dist/esm/elements/react-components';
import {ProfileViewType, TabTitles} from './ProfileTabs';

const selectedColor = String(toniqColors.brandPrimary.foregroundColor);

export function ProfileHeader(props) {
  return (
    <div style={{display: 'flex', flexDirection: 'column'}}>
      <h1 className={props.classes.heading}>My Profile</h1>
      <div style={{display: 'flex', gap: '16px'}}>
        {props.profileDetails.map(profileDetail => {
          return (
            <ChipWithLabel
              key={profileDetail.label}
              style={{flexGrow: 0}}
              label={profileDetail.label}
              text={profileDetail.text}
              icon={profileDetail.icon}
            />
          );
        })}
      </div>
      <div className={props.classes.tabList} style={{display: 'flex'}}>
        {Object.values(props.tabs).map(profileTab => {
          const selectedStyles =
            props.currentTab === profileTab
              ? {
                  ...cssToReactStyleObject(toniqFontStyles.boldFont),
                  color: selectedColor,
                  borderColor: selectedColor,
                  borderWidth: '2px',
                }
              : {};

          return (
            <div
              key={profileTab}
              onClick={() => {
                props.onCurrentTabChange(profileTab);
              }}
              style={{
                cursor: 'pointer',
                ...selectedStyles,
              }}
              className={props.classes.profileTab}
            >
              {TabTitles[profileTab]}
            </div>
          );
        })}
        <div className={props.classes.profileTab} style={{flexGrow: 1}}></div>
      </div>
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <ToniqInput
          value={props.query}
          style={{
            '--toniq-accent-tertiary-background-color': 'transparent',
            marginBottom: '16px',
            width: '500px',
            maxWidth: '100%',
            boxSizing: 'border-box',
          }}
          placeholder="Search for collections..."
          icon={Search24Icon}
          onValueChange={event => {
            const search = event.detail;
            props.onQueryChange(search);
          }}
        />
        <div style={{display: 'flex', marginLeft: '8px'}}>
          <ToniqIcon
            style={{
              cursor: 'pointer',
              color: props.viewType === ProfileViewType.Grid ? selectedColor : 'unset',
            }}
            onClick={() => {
              props.onViewTypeChange(ProfileViewType.Grid);
            }}
            icon={LayoutGrid24Icon}
          />
          <ToniqIcon
            style={{
              cursor: 'pointer',
              color: props.viewType === ProfileViewType.List ? selectedColor : 'unset',
            }}
            onClick={() => {
              props.onViewTypeChange(ProfileViewType.List);
            }}
            icon={ListDetails24Icon}
          />
        </div>
      </div>
    </div>
  );
}
