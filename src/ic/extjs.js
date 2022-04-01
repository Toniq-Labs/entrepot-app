/* global BigInt */
import { Actor, HttpAgent } from "@dfinity/agent";  
import { Principal } from "@dfinity/principal";  
import { LEDGER_CANISTER_ID, GOVERNANCE_CANISTER_ID, NNS_CANISTER_ID, CYCLES_MINTING_CANISTER_ID, getCyclesTopupSubAccount, rosettaApi, principalToAccountIdentifier, toHexString, from32bits, to32bits, isHex, getSubAccountArray, fromHexString, validatePrincipal   } from "./utils.js";

import ledgerIDL from './candid/ledger.did.js';
import governanceIDL from './candid/governance.did.js';
import nnsIDL from './candid/nns.did.js';
import cyclesIDL from './candid/cycles.did.js';
import hzldIDL from './candid/hzld.did.js'; //hardcode to hzld...
import extIDL from './candid/ext.did.js';
import advancedIDL from './candid/advanced.did.js';
import wrapperIDL from './candid/wrapper.did.js';
import icpunksIDL from './candid/icpunks.did.js';
import logIDL from './candid/log.did.js';
import icdripIDL from './candid/icdrip.did.js';
import icpuppy from './candid/icpuppy.js';
import ictuts from './candid/ictuts.js';
import mintregister from './candid/mintregister.did.js';
import nftIDL from './candid/nft.did.js';
import moonwalkerIDL from './candid/moonwalker.did.js';
import saleIDL from './candid/sale.did.js';
import ic3dIDL from './candid/ic3d.did.js';
import pokedIDL from './candid/poked.did.js';
import icapesIDL from './candid/icapes.did.js';
import departureIDL from './candid/departure.did.js';
import imaginationIDL from './candid/imagination.did.js';
import entrepotIDL from './candid/entrepot.did.js';
//import cronicsIDL from './candid/cronics.did.js';

const constructUser = (u) => {
  if (isHex(u) && u.length === 64) {
    return { 'address' : u };
  } else {
    return { 'principal' : Principal.fromText(u) };
  };
};
const tokenIdentifier = (principal, index) => {
  const padding = Buffer("\x0Atid");
  const array = new Uint8Array([
      ...padding,
      ...Principal.fromText(principal).toUint8Array(),
      ...to32bits(index),
  ]);
  return Principal.fromUint8Array(array).toText();
};
const decodeTokenId = (tid) => {
  var p = [...Principal.fromText(tid).toUint8Array()];
  var padding = p.splice(0, 4);
  if (toHexString(padding) !== toHexString(Buffer("\x0Atid"))) {
    return {
      index : 0,
      canister : tid,
      token : tokenIdentifier(tid, 0)
    };
  } else {
    return {
      index : from32bits(p.splice(-4)), 
      canister : Principal.fromUint8Array(p).toText(),
      token : tid
    };
  }
};

//Preload IDLS against a common name
const _preloadedIdls = {
  'governance' : governanceIDL,
  'ledger' : ledgerIDL,
  'hzld' : hzldIDL,
  'nns' : nnsIDL,
  'ext' : extIDL,
  'nft' : nftIDL,
  'sale' : saleIDL,
  'default' : extIDL,
};

var tokensToLoad = {
  "dhiaa-ryaaa-aaaae-qabva-cai" : [0,2015],
  "pk6rk-6aaaa-aaaae-qaazq-cai" : [0,2009],
  "jmuqr-yqaaa-aaaaj-qaicq-cai" : [0,3507],
  "jeghr-iaaaa-aaaah-qco7q-cai" : [0,10000],
  "y3b7h-siaaa-aaaah-qcnwa-cai" : [0,10000],
  "bxdf4-baaaa-aaaah-qaruq-cai" : [1,10000],
  "3db6u-aiaaa-aaaah-qbjbq-cai" : [0,8001],
  "poyn6-dyaaa-aaaah-qcfzq-cai" : [0,30133],
  "nfvlz-jaaaa-aaaah-qcciq-cai" : [0,60000],
};
var loadedTokens = {};
for(const a in tokensToLoad) {
  if (tokensToLoad.hasOwnProperty(a)){
    loadedTokens[a] = [];
    for(var i = tokensToLoad[a][0]; i < (tokensToLoad[a][1]+tokensToLoad[a][0]); i++){
      loadedTokens[a].push([i, {nonfungible: {metadata:[]}}]);
    };
  };
};


class ExtConnection {
  //map known canisters to preloaded IDLs
  _mapIdls = {
    [LEDGER_CANISTER_ID] : _preloadedIdls['ledger'],
    [GOVERNANCE_CANISTER_ID] : _preloadedIdls['governance'],
    [NNS_CANISTER_ID] : _preloadedIdls['nns'],
    "qz7gu-giaaa-aaaaf-qaaka-cai" : _preloadedIdls['hzld'],
    "rkp4c-7iaaa-aaaaa-aaaca-cai" : cyclesIDL,
    "kxh4l-cyaaa-aaaah-qadaq-cai" : advancedIDL,
    "bxdf4-baaaa-aaaah-qaruq-cai" : wrapperIDL,
    "y3b7h-siaaa-aaaah-qcnwa-cai" : wrapperIDL,
    "jeghr-iaaaa-aaaah-qco7q-cai" : wrapperIDL,
    "4nvhy-3qaaa-aaaah-qcnoq-cai" : icpunksIDL,
    "qcg3w-tyaaa-aaaah-qakea-cai" : icpunksIDL,
    "qgsqp-byaaa-aaaah-qbi4q-cai" : logIDL,
    "d3ttm-qaaaa-aaaai-qam4a-cai" : icdripIDL,
    "3db6u-aiaaa-aaaah-qbjbq-cai" : wrapperIDL,
    "bzsui-sqaaa-aaaah-qce2a-cai" : pokedIDL,
    "ctt6t-faaaa-aaaah-qcpbq-cai" : icapesIDL,
    "3mttv-dqaaa-aaaah-qcn6q-cai" : icapesIDL,
    "v3zkd-syaaa-aaaah-qcm5a-cai" : icapesIDL,
    "unssi-hiaaa-aaaah-qcmya-cai" : icapesIDL,
    "zvycl-fyaaa-aaaah-qckmq-cai" : icapesIDL,
    "px5ub-qqaaa-aaaah-qcjxa-cai" : imaginationIDL,
    "njgly-uaaaa-aaaah-qb6pa-cai" : icpuppy,
    "ahl3d-xqaaa-aaaaj-qacca-cai" : ictuts,
    "er7d4-6iaaa-aaaaj-qac2q-cai" : moonwalkerIDL,
    "nfvlz-jaaaa-aaaah-qcciq-cai" : ic3dIDL,
    "xkbqi-2qaaa-aaaah-qbpqq-cai" : icpunksIDL,
    "q6hjz-kyaaa-aaaah-qcama-cai" : wrapperIDL,
    "fl5nr-xiaaa-aaaai-qbjmq-cai" : departureIDL,
    "33uhc-liaaa-aaaah-qcbra-cai" : mintregister,
    "6z5wo-yqaaa-aaaah-qcsfa-cai" : entrepotIDL,
  };
  _metadata = {
    [LEDGER_CANISTER_ID] : {
      name : "ICP",
      symbol : "ICP",
      decimals : 8,
      type : 'fungible',
    },
    "qz7gu-giaaa-aaaaf-qaaka-cai" : {
      name : "HZLD",
      symbol : "HZLD",
      decimals : 0,
      type : 'fungible',
    },
  };
  _identity = false;//new AnonymousIdentity();
  _host = false;
  _agent = false;
  _canisters = {};
  
  constructor(host, identity) {
    if (identity) this._identity = identity;
    if (host) this._host = host;
    this._makeAgent();
  }
  idl(canister, idl) {
    //Map a canister to a preloaded idl
    this._mapIdls[canister] = idl;
  };
  setIdentity(identity) {
    if (identity) this._identity = identity;
    else this._identity = false;
    this._makeAgent();
    return this;
  }
  setHost(host) {
    if (host) this._host = host;
    else this._host = false;
    this._makeAgent();
    return this;
  }
  canister(cid, idl) {
    if (!idl){
      if (this._mapIdls.hasOwnProperty(cid)) {
        idl = this._mapIdls[cid];
      } else {
        idl = _preloadedIdls['default'];
      }
    } else if (typeof idl == 'string') {
      if (_preloadedIdls.hasOwnProperty(idl)) {
        idl = _preloadedIdls[idl];
      } else {
        throw new Error(idl + " is not a preloaded IDL");
      }
    }
    if (!this._canisters.hasOwnProperty(cid)){
      this._canisters[cid] = Actor.createActor(idl, {agent : this._agent, canisterId : cid});        
    }
    return this._canisters[cid];
  }
  token(tid, idl) {
    if (!tid) tid = LEDGER_CANISTER_ID;//defaults to ledger
    var tokenObj = decodeTokenId(tid);
    if (!idl) {
      if (this._mapIdls.hasOwnProperty(tokenObj.canister)) idl = this._mapIdls[tokenObj.canister];
      else idl = _preloadedIdls['ext']; //ext is our token default...
    }
    var api = this.canister(tokenObj.canister, idl);
    return {
      call : api,
      fee : () => {
        return new Promise((resolve, reject) => {
          switch(tokenObj.canister) {
            case LEDGER_CANISTER_ID:
              resolve(10000);
            break;
            case "qz7gu-giaaa-aaaaf-qaaka-cai":
              resolve(1);
            break;
            default:
              //TODO compute fees
              resolve(0);
            break;
          }
        });
      },
      size : async () => {
        if (!loadedTokens.hasOwnProperty(tokenObj.canister)) {
          loadedTokens[tokenObj.canister] = await api.getTokens();
        };
        return loadedTokens[tokenObj.canister].length;
      },
      listings : async () => {
        if (!loadedTokens.hasOwnProperty(tokenObj.canister)) {
          loadedTokens[tokenObj.canister] = await api.getTokens();
        };
        var listings = await api.listings();
        return loadedTokens[tokenObj.canister].map(a => [a[0], (listings.find(b => b[0] == a[0]) ? listings.find(b => b[0] == a[0])[1] : false), a[1]]);
      },
      stats : () => {
        return new Promise((resolve, reject) => {
          try {
            api.stats().then(r => {
              resolve({
                total : (Number(r[0]/1000000n)/100).toFixed(2),
                high : (Number(r[1]/1000000n)/100).toFixed(2),
                low : (Number(r[2]/1000000n)/100).toFixed(2),
                floor : (Number(r[3]/1000000n)/100).toFixed(2),
                listings : Number(r[4]),
                tokens : Number(r[5]),
                sales : Number(r[6]),
                average : (Number(r[6]) ? (Number((r[0]/r[6])/1000000n)/100).toFixed(2) : "-"),
              });
            }).catch(reject);
          } catch(e) {
            reject(e);
          };
        });
      },
      getTokens : (aid, principal) => {
        return new Promise((resolve, reject) => {
          switch(tokenObj.canister) {
            case "4nvhy-3qaaa-aaaah-qcnoq-cai":
            case "qcg3w-tyaaa-aaaah-qakea-cai":
            case "jzg5e-giaaa-aaaah-qaqda-cai":
            case "d3ttm-qaaaa-aaaai-qam4a-cai":
            case "xkbqi-2qaaa-aaaah-qbpqq-cai":
              if (aid !== principalToAccountIdentifier(principal, 0)) {
                resolve([]);
              } else {
                api.user_tokens(Principal.fromText(principal)).then(r => {
                  resolve(r.map(x => {
                    return {
                      id : tokenIdentifier(tokenObj.canister, Number(x)),
                      canister : tokenObj.canister,
                      index : Number(x),
                      listing : false,
                      metadata : false,
                      wrapped : false,
                    }
                  }));
                });
              }
            break;
            //Departure
            case "fl5nr-xiaaa-aaaai-qbjmq-cai":
              if (aid !== principalToAccountIdentifier(principal, 0)) {
                resolve([]);
              } else {
                api.getAllNFT(Principal.fromText(principal)).then(r => {
                  resolve(r.map(x => {
                    return {
                      id : tokenIdentifier(tokenObj.canister, Number(x[0])),
                      canister : tokenObj.canister,
                      index : Number(x[0]),
                      listing : false,
                      metadata : false,
                      wrapped : false,
                    }
                  }));
                });
              }
            break;
            default:
              if (typeof api.tokens_ext == 'undefined') reject("Not supported");
              else {
                try {
                  api.tokens_ext(aid).then(r => {
                    if (typeof r.ok != 'undefined') {
                      var ret = r.ok.map(d => {
                        return {
                          index : d[0],
                          id : tokenIdentifier(tokenObj.canister, d[0]),
                          canister : tokenObj.canister,
                          listing : d[1].length ? d[1][0] : false,
                          metadata : d[2].length ? d[2][0] : false,
                        }
                      });
                      resolve(ret);
                      // var wrappedMap = {
                        // "bxdf4-baaaa-aaaah-qaruq-cai" : "qcg3w-tyaaa-aaaah-qakea-cai",
                        // "y3b7h-siaaa-aaaah-qcnwa-cai" : "4nvhy-3qaaa-aaaah-qcnoq-cai",
                        // "3db6u-aiaaa-aaaah-qbjbq-cai" : "d3ttm-qaaaa-aaaai-qam4a-cai",
                        // "q6hjz-kyaaa-aaaah-qcama-cai" : "xkbqi-2qaaa-aaaah-qbpqq-cai",
                        // "jeghr-iaaaa-aaaah-qco7q-cai" : "fl5nr-xiaaa-aaaai-qbjmq-cai"
                      // };
                      // if (wrappedMap.hasOwnProperty(tokenObj.canister)){
                        // this.token(wrappedMap(tokenObj.canister)).getTokens(aid, principal).then(r => {
                          // var ts = ret.map(a => {a.wrapped = true; return a});
                          // resolve(ts.concat(r));
                        // });
                      // } else {
                        // resolve(ret);
                      // };
                    }else if (typeof r.err != 'undefined') {
                      if (r.err.hasOwnProperty("Other") && r.err.Other === "No tokens") {
                        resolve([]);
                      } else reject(r.err)
                    } else reject(r);
                  }).catch(reject);
                } catch(e) {
                  reject(e);
                };
              };
            break;
          }
        });
      },
      getMetadata : () => {
        return new Promise((resolve, reject) => {
          if (this._metadata.hasOwnProperty(tokenObj.canister)) {
            resolve(this._metadata[tokenObj.canister]);
          } else {
            switch(tokenObj.canister) {
              default:
                api.metadata(tokenObj.token).then(r => {
                  if (typeof r.ok != 'undefined') {
                    if (typeof r.ok.fungible != 'undefined') {
                      resolve({
                        name : r.ok.fungible.name,
                        symbol : r.ok.fungible.symbol,
                        decimals : r.ok.fungible.decimals,
                        metadata : r.ok.fungible.metadata,
                        type : 'fungible'
                      });
                    } else {
                      var md = r.ok.nonfungible.metadata[0];
                      if (typeof md != 'undefined' && md.length > 256) md = md.slice(0, 256);
                      resolve({
                        metadata : [md],
                        type : 'nonfungible'
                      });
                    }
                  } else if (typeof r.err != 'undefined') reject(r.err)
                  else reject(r);
                }).catch(reject);
              break;
            }
          }
        });
      },
      getBearer : () => {
        return new Promise((resolve, reject) => {
          api.bearer(tokenObj.token).then(r => {
            if (typeof r.ok != 'undefined') resolve(r.ok)
            else if (typeof r.err != 'undefined') reject(r.err)
            else reject(r);
          }).catch(reject);    
        });
      },
      getDetails : () => {
        return new Promise((resolve, reject) => {
          api.details(tokenObj.token).then(r => {
            if (typeof r.ok != 'undefined') resolve(r.ok)
            else if (typeof r.err != 'undefined') reject(r.err)
            else reject(r);
          }).catch(reject);    
        });
      },
      getBalance : (address, princpal) => {
        return new Promise((resolve, reject) => {
          var args;
          switch(tokenObj.canister) {
            case LEDGER_CANISTER_ID:
              rosettaApi.getAccountBalance(address).then(b => {       
                resolve(b)
              });
            break;
            case "qz7gu-giaaa-aaaaf-qaaka-cai":
              args = {
                "user" : Principal.fromText(princpal)
              };
              api.getBalanceInsecure(args).then(b => {
                var bal = b.length === 0 ? 0 : b[0];
                resolve(bal);
              }).catch(reject);
            break;
            default:
              args = {
                "user" : constructUser(address),
                'token' : tokenObj.token
              };
              api.balance(args).then(r => {
                if (typeof r.ok != 'undefined') resolve(r.ok)
                else if (typeof r.err != 'undefined') reject(r.err)
                else reject(r);
              }).catch(reject);            
            break;
          }
        });
      },
      getTransactions : (address, princpal) => {
        return new Promise((resolve, reject) => {
          switch(tokenObj.canister) {
            case LEDGER_CANISTER_ID:
              rosettaApi.getTransactionsByAccount(address).then(ts => {    
                if (!Array.isArray(ts)) resolve([]);
                var _ts = [];
                ts.map(_t => {
                  if (_t.type !== "TRANSACTION") return false;
                  if (_t.status !== "COMPLETED") return false;
                  _ts.push({
                    from : _t.account1Address,
                    to :  _t.account2Address,
                    amount : Number(_t.amount/100000000),
                    fee : Number(_t.fee/100000000),
                    hash : _t.hash,
                    timestamp : _t.timestamp,
                    memo : Number(_t.memo),
                  });
                  return true;
                });
                _ts.reverse();
                resolve(_ts);
              }).catch(reject);
            break;
            case "qz7gu-giaaa-aaaaf-qaaka-cai":
            default:
              resolve([]);         
            break;
          }
        });
      },
      /*
        from_principal = principal of account as text
        from_sa = subaccount (to produce hex address). null/0 default as number
        to_user = valid User (address or principal) as text
        amount = valid amount as BigInt
        fee = valid fee as BigInt
        memo = data to be sent as text/hex/number
        notify = if we need to notify TODO
      */
      list : (from_sa, price) => {
        return new Promise((resolve, reject) => {
          var args;
          switch(tokenObj.canister) {
            case LEDGER_CANISTER_ID:
            case "qz7gu-giaaa-aaaaf-qaaka-cai":
              reject("Not supported");
            break;
            default:
              args = {
                'token' : tid,
                'from_subaccount' : [getSubAccountArray(from_sa ?? 0)],
                'price' : (price === 0 ? [] : [price])
              };
              api.list(args).then(b => {
                if (typeof b.ok != 'undefined') {
                  resolve(true);
                } else {
                  reject(JSON.stringify(b.err));
                }
              }).catch(reject);
            break;
          }
        });
      },
      transfer : (from_principal, from_sa, to_user, amount, fee, memo, notify) => {
        return new Promise((resolve, reject) => {
          var args;
          switch(tokenObj.canister) {
            case LEDGER_CANISTER_ID:
              args = {
                "from_subaccount" : [getSubAccountArray(from_sa ?? 0)], 
                "to" : to_user, //Should be an address
                "amount" : { "e8s" : amount },
                "fee" : { "e8s" : fee }, 
                "memo" : memo ? Number(BigInt(memo)) : 0, 
                "created_at_time" : []
              };
              api.send_dfx(args).then(bh => {
                resolve(true);
              }).catch(reject);
              //Notify here
            break;
            case "qcg3w-tyaaa-aaaah-qakea-cai":
            case "4nvhy-3qaaa-aaaah-qcnoq-cai":
            case "jzg5e-giaaa-aaaah-qaqda-cai":
            case "d3ttm-qaaaa-aaaai-qam4a-cai":
            case "xkbqi-2qaaa-aaaah-qbpqq-cai":
              if (!validatePrincipal(to_user)) reject("This does not support traditional addresses, you must use a Principal");
              api.transfer_to(Principal.fromText(to_user), tokenObj.index).then(b => {
                if (b) {          
                  resolve(true);
                } else {
                  reject("Something went wrong");
                }
              }).catch(reject);
            break;
            case "fl5nr-xiaaa-aaaai-qbjmq-cai":
              if (!validatePrincipal(to_user)) reject("This does not support traditional addresses, you must use a Principal");
              api.transferFrom(Principal.fromText(from_principal), Principal.fromText(to_user), tokenObj.index).then(b => {
                if (b.hasOwnProperty('ok')) {          
                  resolve(true);
                } else {
                  reject("Something went wrong");
                }
              }).catch(reject);
            break;
            case "qz7gu-giaaa-aaaaf-qaaka-cai":
              args = {
                "to" : Principal.fromText(to_user), 
                "metadata" : [],
                "from" : Principal.fromText(from_principal),
                "amount" : amount
              };
              api.transfer(args).then(b => {
                if (typeof b.ok != 'undefined') {          
                  resolve(true);
                } else {
                  reject(JSON.stringify(b.err));
                }
              }).catch(reject);
            break;
            default:
              args = {
                'token' : tid,
                'from' : { 'address' : principalToAccountIdentifier(from_principal, from_sa ?? 0) },
                'subaccount' : [getSubAccountArray(from_sa ?? 0)],
                'to' : constructUser(to_user),
                'amount' : amount,
                'fee' : fee,
                'memo' : fromHexString(memo),
                'notify' : notify
              };
              api.transfer(args).then(b => {
                if (typeof b.ok != 'undefined') {
                  resolve(b.ok);
                } else {
                  reject(JSON.stringify(b.err));
                }
              }).catch(reject);
            break;
          }
        });
      },
      mintCycles : (from_principal, from_sa, canister, amount, fee) => {
        return new Promise((resolve, reject) => {
          switch(tokenObj.canister) {
            case LEDGER_CANISTER_ID:
              var _to_sub = getCyclesTopupSubAccount(canister);
              var _to = principalToAccountIdentifier(CYCLES_MINTING_CANISTER_ID, _to_sub);
              var args = {
                "from_subaccount" : [getSubAccountArray(from_sa ?? 0)], 
                "to" : _to, 
                "fee" : { "e8s" : fee }, 
                "memo" : Number(BigInt("0x50555054")), 
                "created_at_time" : [], 
                "amount" : { "e8s" : amount }
              };
              api.send_dfx(args).then(block => {
                var args = {
                  "block_height" : block,
                  "max_fee": {e8s: fee},
                  "from_subaccount": [getSubAccountArray(from_sa ?? 0)],
                  "to_subaccount": [getSubAccountArray(_to_sub)],
                  "to_canister": Principal.fromText(CYCLES_MINTING_CANISTER_ID)
                };
                api.notify_dfx(args).then(resolve).catch(reject);
              }).catch(reject);
            break;
            case "5ymop-yyaaa-aaaah-qaa4q-cai":
              reject("WIP");
            break;
            default:
              reject("Cycle topup is not supported by this token");
            break;
          }
        });
      }
    };
  }
 
  _makeAgent() {
    if (window?.ic?.plug?.agent) {
      this._agent = window.ic.plug.agent;
    } else {
      var args = {};
      if (this._identity) args['identity'] = this._identity;
      if (this._host) args['host'] = this._host;
      this._agent = new HttpAgent(args);
    }
  };
};

const extjs = {
  connect : (host, identity) => new ExtConnection(host ?? "https://boundary.ic0.app/", identity),
  decodeTokenId : decodeTokenId,
  encodeTokenId : tokenIdentifier,
  toAddress : principalToAccountIdentifier,
  toSubaccount : getSubAccountArray,
};
export default extjs;
//window.extjs = extjs.connect;
//window.principalToAccountIdentifier = principalToAccountIdentifier;
//window.fromHexString = fromHexString;