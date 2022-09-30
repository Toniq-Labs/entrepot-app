import OldSaleComponent from './OldSaleComponent';
import V2SaleComponent from './V2SaleComponent';
import {useParams} from 'react-router';
export default function GeneralSaleComponent(props) {
    const getCollectionFromRoute = r => {
        return props.collections.find(e => e.route === r);
    };
    const params = useParams();
    var collection = getCollectionFromRoute(params?.route);
    if (collection.saletype == 'v1') {
        return (
            <>
                <OldSaleComponent {...props} />
            </>
        );
    } else {
        return (
            <>
                <V2SaleComponent {...props} />
            </>
        );
    }
}
