import {EnvironmentEnum} from './environments';

const devHosts = [
    'localhost',
    '127.0.0.1',
];

function getEnvironmentByUrl(): EnvironmentEnum {
    if (devHosts.some(devHost => window.location.hostname.startsWith(devHost))) {
        return EnvironmentEnum.Dev;
    }

    return EnvironmentEnum.Prod;
}

export const environmentByUrl: EnvironmentEnum = getEnvironmentByUrl();
