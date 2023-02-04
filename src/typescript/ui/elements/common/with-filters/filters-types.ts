import {NestedSequentialKeys} from '@augment-vir/common';

export enum FilterTypeEnum {
    Checkboxes = 'checkboxes',
    Radio = 'radio',
    ExpandingList = 'expanding-list',
    NumericRange = 'numeric-range',
}

export enum BooleanFilterTypeEnum {
    /** For this filter type, string comparison values must match the checkbox value exclusively. */
    Exclusive = 'exclusive',
    /** For this filter type, string comparison values must merely contain the checkbox value. */
    Contains = 'contains',
    /** For this filter type, allow any values. Use this for an "all" filter. */
    Everything = 'everything',
}

export type BooleanFilterEntry = {
    label: string;
    checked: boolean;
    /** If value is not provided, the label is used as the filter. */
    value?: string | boolean;
    /** If filterType is not provided, BooleanFilterTypeEnum.Exclusive is used */
    filterType?: BooleanFilterTypeEnum;
};

type NumericRangeFilterEntry = {
    currentMin: number | undefined;
    currentMax: number | undefined;
} & (
    | {
          types: ReadonlyArray<string>;
          selectedType: string;
      }
    | {
          types?: undefined;
          selectedType?: undefined;
      }
);

export type ExpandingListFilterEntry = {
    name: string;
    key: string;
    expanded: boolean;
    checkboxes: ReadonlyArray<BooleanFilterEntry>;
};

export type SingleFilterDefinition<EntryGeneric extends object> =
    | ((
          | {
                filterType: FilterTypeEnum.Radio;
                radios: ReadonlyArray<Omit<BooleanFilterEntry, 'checked'>>;
                value: string | boolean;
            }
          | {
                filterType: FilterTypeEnum.Checkboxes;
                checkboxes: ReadonlyArray<BooleanFilterEntry>;
            }
          | ({
                filterType: FilterTypeEnum.NumericRange;
            } & NumericRangeFilterEntry)
      ) & {
          filterField: NestedSequentialKeys<EntryGeneric>;
      })
    | {
          filterType: FilterTypeEnum.ExpandingList;
          expanded: boolean;
          entries: ReadonlyArray<ExpandingListFilterEntry>;
          filterField: NestedSequentialKeys<EntryGeneric> | never[];
      };

export type FilterDefinitions<EntryGeneric extends object> = Record<
    string,
    SingleFilterDefinition<EntryGeneric>
>;

export type SortDefinition<EntryGeneric extends object> = {
    sortName: string;
    sortField: NestedSequentialKeys<EntryGeneric>;
};

export type CurrentSort = {
    name: string;
    ascending: boolean;
};
