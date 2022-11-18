import {EnvironmentEnum} from './environments';

const devHosts = [
    'localhost',
    '127.0.0.1',
    'deploy-preview',
    'friendly-raman-30db7b',
];

function getEnvironmentByUrl(): EnvironmentEnum {
    const hostName = window.location.hostname;
    if (devHosts.some(devHost => hostName.startsWith(devHost))) {
        return EnvironmentEnum.Dev;
    } else if (hostName.startsWith('deploy-preview') && hostName.endsWith('netlify.app')) {
        return EnvironmentEnum.DeployPreview;
    }

    return EnvironmentEnum.Prod;
}

export const environmentByUrl: EnvironmentEnum = getEnvironmentByUrl();

export const isProd: boolean = environmentByUrl === EnvironmentEnum.Prod;
