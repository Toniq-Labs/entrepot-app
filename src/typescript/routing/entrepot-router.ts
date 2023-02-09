import {createSpaRouter, FullRoute} from 'spa-router-vir';

export enum EntrepotRoutePageEnum {
    Home = '',
    Marketplace = 'marketplace',
    Profile = 'profile',
}

export type EntrepotRoutes = [EntrepotRoutePageEnum, ...string[]];

export type EntrepotSearch = {
    search: string;
    filters: string;
    viewType: string;
};

// no route sanitization yet because we don't have all the routes enumerated yet
export const entrepotRouter = createSpaRouter<EntrepotRoutes, EntrepotSearch, undefined>();
