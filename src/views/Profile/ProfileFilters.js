import {
  ToniqToggleButton,
  ToniqSlider,
} from '@toniq-labs/design-system/dist/esm/elements/react-components';
import {toniqColors} from '@toniq-labs/design-system';
import {SelectableNameWithCount} from '../../shared/SelectableNameWithCount';

export const nftFilterStatus = {
  All: 'All',
  Unlisted: 'Unlisted',
  ForSale: 'For Sale',
  OffersReceived: 'Offers Received',
};

export function ProfileFilters(props) {
  return (
    <>
      <div>
        <div className="title">Status</div>
        {Object.values(nftFilterStatus).map(filterStatus => {
          return (
            <ToniqToggleButton
              key={filterStatus}
              text={filterStatus}
              active={props.filters.status == filterStatus}
              onClick={() => {
                props.updateFilters({
                  ...props.filters,
                  status: filterStatus,
                });
              }}
            />
          );
        })}
      </div>
      {props.nftFilterStats.price.min !== props.nftFilterStats.price.max && (
        <div>
          <div className="title">Listing Price</div>
          <ToniqSlider
            min={props.nftFilterStats.price.min}
            max={props.nftFilterStats.price.max}
            suffix="ICP"
            step="0.01"
            double={true}
            value={props.filters.price || props.nftFilterStats.price}
            onValueChange={event => {
              const values = event.detail;
              props.updateFilters({
                ...props.filters,
                price: {
                  ...values,
                },
              });
            }}
          />
        </div>
      )}
      {props.nftFilterStats.rarity.min !== props.nftFilterStats.rarity.max && (
        <div>
          <div className="title">Rarity</div>
          <ToniqSlider
            min={props.nftFilterStats.rarity.min}
            max={props.nftFilterStats.rarity.max}
            suffix="%"
            double={true}
            value={props.filters.rarity || props.nftFilterStats.rarity}
            onValueChange={event => {
              const values = event.detail;
              props.updateFilters({
                ...props.filters,
                rarity: {
                  ...values,
                },
              });
            }}
          />
        </div>
      )}
      {props.nftFilterStats.mintNumber.min !== props.nftFilterStats.mintNumber.max > 1 && (
        <div>
          <div className="title">Mint #</div>
          <ToniqSlider
            min={props.nftFilterStats.mintNumber.min}
            max={props.nftFilterStats.mintNumber.max}
            double={true}
            value={props.filters.mintNumber || props.nftFilterStats.mintNumber}
            onValueChange={event => {
              const values = event.detail;
              props.updateFilters({
                ...props.filters,
                mintNumber: {
                  ...values,
                },
              });
            }}
          />
        </div>
      )}
      {props.userCollections.length > 1 && (
        <div>
          <div className="title">Collections ({props.userCollections.length})</div>
          <div
            style={{
              borderBottom: `1px solid ${String(toniqColors.divider.foregroundColor)}`,
              paddingBottom: '24px',
            }}
          >
            <SelectableNameWithCount
              title="All Collections"
              selected={props.filters.allCollections}
              count={props.userNfts.length}
              onClick={() => {
                props.updateFilters({
                  ...props.filters,
                  allCollections: true,
                  collections: [],
                });
              }}
            />
          </div>
          <div style={{paddingTop: '32px'}}>
            {props.userCollections
              .sort((a, b) => a.name.localeCompare(b.name))
              .map(collection => {
                return (
                  <SelectableNameWithCount
                    key={collection.name}
                    title={collection.name}
                    imageUrl={collection.avatar}
                    selected={props.filters.collections.includes(collection.name)}
                    count={props.nftFilterStats.collections[collection.name]}
                    onClick={() => {
                      const isAlreadyIncluded = props.filters.collections.includes(collection.name);

                      const newCollections = isAlreadyIncluded
                        ? props.filters.collections.filter(collectionName => {
                            return collectionName !== collection.name;
                          })
                        : props.filters.collections.concat(collection.name);

                      props.updateFilters({
                        ...props.filters,
                        allCollections: !newCollections.length,
                        collections: newCollections,
                      });
                    }}
                  />
                );
              })}
          </div>
        </div>
      )}
    </>
  );
}
