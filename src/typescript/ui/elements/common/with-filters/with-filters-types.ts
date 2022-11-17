import {NestedKeys} from '../../../../augments/object';

export enum FilterTypeEnum {
    Checkboxes = 'checkboxes',
    ExpandingList = 'expanding-list',
    NumericRange = 'numeric-range',
}

export type BooleanFilterEntry = {
    label: string;
    checked: boolean;
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
    expanded: boolean;
    includeAllToggle: boolean;
    imageUrl?: string | undefined;
} & (
    | {
          children: ReadonlyArray<ExpandingListFilterEntry>;
          checkboxes?: undefined;
      }
    | {
          checkboxes: ReadonlyArray<BooleanFilterEntry>;
          children?: undefined;
      }
);

export type SingleFilterDefinition<EntryGeneric extends object> = (
    | {
          filterType: FilterTypeEnum.Checkboxes;
          checkboxes: ReadonlyArray<BooleanFilterEntry>;
      }
    | {
          filterType: FilterTypeEnum.ExpandingList;
          entries: ReadonlyArray<ExpandingListFilterEntry>;
      }
    | ({
          filterType: FilterTypeEnum.NumericRange;
      } & NumericRangeFilterEntry)
) & {
    filterField: Readonly<NestedKeys<EntryGeneric>>;
};

export type FilterDefinitions<EntryGeneric extends object> = Readonly<
    Record<string, SingleFilterDefinition<EntryGeneric>>
>;

export type SortDefinition<EntryGeneric extends object> = {
    sortName: string;
    sortField: Readonly<NestedKeys<EntryGeneric>>;
};

export type CurrentSort = {
    name: string;
    ascending: boolean;
};
