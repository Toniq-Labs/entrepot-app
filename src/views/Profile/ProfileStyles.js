import {makeStyles} from '@material-ui/core/styles';
import {cssToReactStyleObject, toniqFontStyles, toniqColors} from '@toniq-labs/design-system';

const filterOnTopBreakPoint = '@media (max-width: 800px)';

export const profileStyles = makeStyles(() => ({
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 960,
            lg: 1280,
            xl: 1920,
        },
    },
    collectionContainer: {
        marginBottom: 20,
        maxWidth: '100%',
    },
    root: {
        maxWidth: 345,
    },
    heading: {
        ...cssToReactStyleObject(toniqFontStyles.h1Font),
        ...cssToReactStyleObject(toniqFontStyles.extraBoldFont),
        // 8px here plus 24px padding on wrapper makes 32px total between this and the nav bar
        marginTop: '8px',
        marginBottom: '24px',
    },
    profileTab: {
        ...cssToReactStyleObject(toniqFontStyles.paragraphFont),
        borderBottom: `1px solid ${String(toniqColors.divider.foregroundColor)}`,
        padding: '16px 8px',
    },
    filterSortRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        ...cssToReactStyleObject(toniqFontStyles.boldParagraphFont),
        [filterOnTopBreakPoint]: {
            flexDirection: 'column',
            alignItems: 'unset',
        },
    },
    filtersTrigger: {
        display: 'flex',
        gap: '16px',
    },
    filtersDotThing: {
        [filterOnTopBreakPoint]: {
            opacity: 0,
        },
    },
    collectionsAndSort: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexGrow: 1,
        [filterOnTopBreakPoint]: {
            marginLeft: '16px',
        },
    },
    marketplaceControls: {
        marginBottom: '32px',
    },
    filterAndIcon: {
        cursor: 'pointer',
        marginLeft: '16px',
        gap: '8px',
        flexShrink: 0,
    },
    media: {
        cursor: 'pointer',
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    collectionCard: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: 480,
        '@media (max-width: 400px)': {
            height: 'unset',
        },
    },
    collectionCardBottomHalf: {
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        alignItems: 'stretch',
    },
    collectionCardCollectionName: {
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        alignSelf: 'stretch',
        ...cssToReactStyleObject(toniqFontStyles.h3Font),
        marginBottom: 0,
        marginTop: '16px',
        display: '-webkit-box',
        '-webkit-line-clamp': 2,
        '-webkit-box-orient': 'vertical',
        overflow: 'hidden',
    },
    collectionCardBrief: {
        margin: 0,
        display: '-webkit-box',
        '-webkit-line-clamp': 3,
        '-webkit-box-orient': 'vertical',
        overflow: 'hidden',
        textOverflow: 'clip',
        padding: '4px 0',
        ...cssToReactStyleObject(toniqFontStyles.paragraphFont),
        color: String(toniqColors.pageSecondary.foregroundColor),
    },
    tabList: {
        marginTop: '16px',
        marginBottom: '16px',
    },
    collectionCardBriefWrapper: {
        display: 'flex',
        flexDirection: 'column',
        flexBasis: 0,
        flexGrow: 1,
        minHeight: '54px',
        justifyContent: 'center',
        flexDirection: 'column',
        alignSelf: 'stretch',
    },
    collectionDetailsWrapper: {
        display: 'flex',
        flexWrap: 'wrap',
        flexShrink: 1,
        justifyContent: 'center',
        gap: '16px',
    },
    collectionDetailsCell: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        alignItems: 'stretch',
        textAlign: 'center',
        flexBasis: '0',
        minWidth: '80px',
        flexGrow: 1,
    },
    collectionDetailsChip: {
        ...cssToReactStyleObject(toniqFontStyles.boldFont),
        ...cssToReactStyleObject(toniqFontStyles.monospaceFont),
        fontSize: '15px',
    },
}));
