import {SignIdentity} from '@dfinity/agent';
// @ts-ignore
import {StoicIdentity as StoicInput} from 'ic-stoic-identity';

const StoicIdentity = StoicInput;
type StoicIdentity = SignIdentity & {
    connect(): Promise<StoicIdentity>;
    load(): Promise<StoicIdentity | undefined>;
    disconnect(): Promise<void>;
};

// what's the shape of a plug identity?
type PlugIdentity = StoicIdentity;

export type UserIdentity = StoicIdentity | PlugIdentity;
