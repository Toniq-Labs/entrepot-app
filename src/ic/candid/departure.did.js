export default ({ IDL }) => {
  const Property = IDL.Rec();
  const Query = IDL.Rec();
  const Value = IDL.Variant({
    'Int' : IDL.Int,
    'Nat' : IDL.Nat,
    'Empty' : IDL.Null,
    'Bool' : IDL.Bool,
    'Text' : IDL.Text,
    'Float' : IDL.Float64,
    'Principal' : IDL.Principal,
    'Class' : IDL.Vec(Property),
  });
  Property.fill(
    IDL.Record({ 'value' : Value, 'name' : IDL.Text, 'immutable' : IDL.Bool })
  );
  const Properties = IDL.Vec(Property);
  const Error__1 = IDL.Variant({
    'Immutable' : IDL.Null,
    'NotFound' : IDL.Null,
    'Unauthorized' : IDL.Null,
    'InvalidRequest' : IDL.Null,
    'AuthorizedPrincipalLimitReached' : IDL.Nat,
    'FailedToWrite' : IDL.Text,
  });
  const Result_7 = IDL.Variant({ 'ok' : Properties, 'err' : Error__1 });
  const StreamingCallbackToken = IDL.Record({
    'key' : IDL.Text,
    'index' : IDL.Nat,
    'content_encoding' : IDL.Text,
  });
  const StreamingCallbackResponse = IDL.Record({
    'token' : IDL.Opt(StreamingCallbackToken),
    'body' : IDL.Vec(IDL.Nat8),
  });
  const AccessoryMetadata = IDL.Record({
    'id' : IDL.Text,
    'contentType' : IDL.Text,
    'createdAt' : IDL.Int,
    'properties' : Properties,
  });
  const Result_18 = IDL.Variant({ 'ok' : AccessoryMetadata, 'err' : Error__1 });
  const TokenIndex__2 = IDL.Nat;
  const Callback__1 = IDL.Func([], [], []);
  const WriteAsset = IDL.Variant({
    'Init' : IDL.Record({
      'id' : IDL.Text,
      'size' : IDL.Nat,
      'callback' : IDL.Opt(Callback__1),
    }),
    'Chunk' : IDL.Record({
      'id' : IDL.Text,
      'chunk' : IDL.Vec(IDL.Nat8),
      'callback' : IDL.Opt(Callback__1),
    }),
  });
  const AssetRequest = IDL.Variant({
    'Put' : IDL.Record({
      'key' : IDL.Text,
      'contentType' : IDL.Text,
      'callback' : IDL.Opt(Callback__1),
      'payload' : IDL.Variant({
        'StagedData' : IDL.Null,
        'Payload' : IDL.Vec(IDL.Nat8),
      }),
    }),
    'Remove' : IDL.Record({
      'key' : IDL.Text,
      'callback' : IDL.Opt(Callback__1),
    }),
    'StagedWrite' : WriteAsset,
  });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : Error__1 });
  const AuthorizeRequest = IDL.Record({
    'p' : IDL.Principal,
    'id' : IDL.Text,
    'isAuthorized' : IDL.Bool,
  });
  const TokenIndex = IDL.Nat;
  const TransferResponse__1 = IDL.Variant({
    'ok' : TokenIndex,
    'err' : IDL.Variant({
      'ListOnMarketPlace' : IDL.Null,
      'NotAllowTransferToSelf' : IDL.Null,
      'NotOwnerOrNotApprove' : IDL.Null,
      'Other' : IDL.Null,
    }),
  });
  const Result_17 = IDL.Variant({
    'ok' : IDL.Vec(IDL.Tuple(IDL.Text, AccessoryMetadata)),
    'err' : Error__1,
  });
  const Result_16 = IDL.Variant({
    'ok' : IDL.Vec(
      IDL.Tuple(
        IDL.Text,
        IDL.Tuple(IDL.Text, IDL.Vec(IDL.Tuple(IDL.Text, IDL.Int))),
      )
    ),
    'err' : Error__1,
  });
  const Metadata = IDL.Record({
    'id' : IDL.Text,
    'contentType' : IDL.Text,
    'owner' : IDL.Principal,
    'createdAt' : IDL.Int,
    'properties' : Properties,
  });
  const Result_15 = IDL.Variant({
    'ok' : IDL.Vec(IDL.Tuple(IDL.Text, Metadata)),
    'err' : Error__1,
  });
  const AccessoryMintRequest = IDL.Record({
    'to' : IDL.Opt(IDL.Principal),
    'tokenId' : IDL.Text,
    'amount' : IDL.Nat,
  });
  const Result_12 = IDL.Variant({
    'ok' : IDL.Tuple(IDL.Text, IDL.Principal, IDL.Nat),
    'err' : Error__1,
  });
  const BuyRequest = IDL.Record({
    'tokenIndex' : TokenIndex,
    'marketFeeRatio' : IDL.Nat,
    'feeTo' : IDL.Principal,
  });
  const BuyResponse = IDL.Variant({
    'ok' : TokenIndex,
    'err' : IDL.Variant({
      'NotAllowBuySelf' : IDL.Null,
      'InsufficientBalance' : IDL.Null,
      'AlreadyTransferToOther' : IDL.Null,
      'NotFoundIndex' : IDL.Null,
      'Unauthorized' : IDL.Null,
      'Other' : IDL.Null,
      'LessThanFee' : IDL.Null,
      'AllowedInsufficientBalance' : IDL.Null,
    }),
  });
  const ListResponse = IDL.Variant({
    'ok' : TokenIndex,
    'err' : IDL.Variant({
      'NotApprove' : IDL.Null,
      'NotNFT' : IDL.Null,
      'NotFoundIndex' : IDL.Null,
      'SamePrice' : IDL.Null,
      'NotOwner' : IDL.Null,
      'Other' : IDL.Null,
      'AlreadyList' : IDL.Null,
    }),
  });
  const AccessoryEgg = IDL.Record({
    'contentType' : IDL.Text,
    'properties' : Properties,
    'isPrivate' : IDL.Bool,
    'equippable' : IDL.Bool,
    'payload' : IDL.Variant({
      'StagedData' : IDL.Text,
      'Payload' : IDL.Vec(IDL.Nat8),
    }),
  });
  const Result_8 = IDL.Variant({ 'ok' : IDL.Text, 'err' : Error__1 });
  const Result_5 = IDL.Variant({ 'ok' : IDL.Vec(IDL.Nat), 'err' : Error__1 });
  const TopupCallback = IDL.Func([], [IDL.Nat], []);
  const Contract = IDL.Variant({
    'ContractAuthorize' : IDL.Record({
      'isAuthorized' : IDL.Bool,
      'user' : IDL.Principal,
    }),
    'Mint' : IDL.Record({ 'id' : IDL.Text, 'owner' : IDL.Principal }),
  });
  const Error = IDL.Variant({
    'Immutable' : IDL.Null,
    'NotFound' : IDL.Null,
    'Unauthorized' : IDL.Null,
    'InvalidRequest' : IDL.Null,
    'AuthorizedPrincipalLimitReached' : IDL.Nat,
    'FailedToWrite' : IDL.Text,
  });
  const Details = IDL.Variant({ 'ok' : IDL.Text, 'err' : Error });
  const Shop = IDL.Variant({
    'Reserve' : IDL.Record({
      'nftIds' : IDL.Vec(IDL.Nat),
      'wasReserve' : IDL.Bool,
      'from' : IDL.Principal,
      'details' : Details,
    }),
    'Sale' : IDL.Record({
      'from' : IDL.Principal,
      'details' : Details,
      'balanceAfter' : IDL.Int,
      'amount' : IDL.Nat,
    }),
  });
  const Ledger = IDL.Variant({
    'Notify' : IDL.Record({
      'from' : IDL.Principal,
      'nftId' : IDL.Text,
      'details' : Details,
      'balanceAfter' : IDL.Int,
    }),
  });
  const Token = IDL.Variant({
    'AccessoryAuthorize' : IDL.Record({
      'id' : IDL.Text,
      'isAuthorized' : IDL.Bool,
      'owner' : IDL.Principal,
      'user' : IDL.Principal,
    }),
    'Authorize' : IDL.Record({
      'id' : IDL.Text,
      'isAuthorized' : IDL.Bool,
      'user' : IDL.Principal,
    }),
    'Transfer' : IDL.Record({
      'id' : IDL.Text,
      'to' : IDL.Principal,
      'from' : IDL.Principal,
    }),
  });
  const Event = IDL.Variant({
    'ContractEvent' : Contract,
    'ShopEvent' : Shop,
    'LedgerEvent' : Ledger,
    'TokenEvent' : Token,
  });
  const Message = IDL.Record({
    'topupCallback' : TopupCallback,
    'createdAt' : IDL.Int,
    'topupAmount' : IDL.Nat,
    'event' : Event,
  });
  const ICP = IDL.Record({ 'e8s' : IDL.Nat64 });
  const ContractInfo = IDL.Record({
    'nft_payload_size' : IDL.Nat,
    'memory_size' : IDL.Nat,
    'max_live_size' : IDL.Nat,
    'cycles' : IDL.Nat,
    'total_minted' : IDL.Nat,
    'heap_size' : IDL.Nat,
    'authorized_users' : IDL.Vec(IDL.Principal),
  });
  const LogEntry = IDL.Record({
    'createdAt' : IDL.Int,
    'event' : IDL.Variant({ 'Event' : Event, 'Custom' : IDL.Text }),
  });
  const Token__1 = IDL.Record({
    'contentType' : IDL.Text,
    'createdAt' : IDL.Int,
    'properties' : Properties,
    'isPrivate' : IDL.Bool,
    'payload' : IDL.Vec(IDL.Vec(IDL.Nat8)),
  });
  const Callback = IDL.Func([Message], [], []);
  const CallbackStatus = IDL.Record({
    'failedCalls' : IDL.Nat,
    'failedCallsLimit' : IDL.Nat,
    'callback' : IDL.Opt(Callback),
    'noTopupCallLimit' : IDL.Nat,
    'callsSinceLastTopup' : IDL.Nat,
  });
  const NftPhotoStoreCID__1 = IDL.Record({
    'index' : TokenIndex,
    'canisterId' : IDL.Principal,
  });
  const Time = IDL.Int;
  const Listings = IDL.Record({
    'tokenIndex' : TokenIndex,
    'time' : Time,
    'seller' : IDL.Principal,
    'price' : IDL.Nat,
  });
  const ContractMetadata = IDL.Record({
    'name' : IDL.Text,
    'symbol' : IDL.Text,
  });
  const Price = IDL.Int;
  const Result_14 = IDL.Variant({
    'ok' : IDL.Tuple(IDL.Text, IDL.Vec(IDL.Tuple(IDL.Text, IDL.Float64))),
    'err' : Error__1,
  });
  const Result_13 = IDL.Variant({
    'ok' : IDL.Tuple(IDL.Text, IDL.Vec(IDL.Tuple(IDL.Text, IDL.Int))),
    'err' : Error__1,
  });
  const SoldListings = IDL.Record({
    'lastPrice' : IDL.Nat,
    'time' : Time,
    'account' : IDL.Nat,
  });
  const HeaderField = IDL.Tuple(IDL.Text, IDL.Text);
  const Request = IDL.Record({
    'url' : IDL.Text,
    'method' : IDL.Text,
    'body' : IDL.Vec(IDL.Nat8),
    'headers' : IDL.Vec(HeaderField),
  });
  const StreamingCallback = IDL.Func(
      [StreamingCallbackToken],
      [StreamingCallbackResponse],
      ['query'],
    );
  const StreamingStrategy = IDL.Variant({
    'Callback' : IDL.Record({
      'token' : StreamingCallbackToken,
      'callback' : StreamingCallback,
    }),
  });
  const Response = IDL.Record({
    'body' : IDL.Vec(IDL.Nat8),
    'headers' : IDL.Vec(HeaderField),
    'streaming_strategy' : IDL.Opt(StreamingStrategy),
    'status_code' : IDL.Nat16,
  });
  const ListRequest = IDL.Record({
    'tokenIndex' : TokenIndex,
    'price' : IDL.Nat,
  });
  const MutationRequest = IDL.Record({
    'isEquip' : IDL.Bool,
    'accessoryId' : IDL.Text,
  });
  const Result_11 = IDL.Variant({
    'ok' : IDL.Tuple(
      Properties,
      IDL.Vec(IDL.Tuple(IDL.Text, IDL.Int)),
      IDL.Vec(IDL.Tuple(IDL.Text, IDL.Principal, IDL.Nat)),
    ),
    'err' : Error__1,
  });
  const NftInvoice = IDL.Record({
    'from' : IDL.Principal,
    'amount_due' : IDL.Nat,
    'amount' : IDL.Nat,
  });
  const Result_10 = IDL.Variant({
    'ok' : IDL.Tuple(NftInvoice, IDL.Int),
    'err' : Error__1,
  });
  const Result_9 = IDL.Variant({ 'ok' : IDL.Principal, 'err' : Error__1 });
  const Egg = IDL.Record({
    'contentType' : IDL.Text,
    'owner' : IDL.Opt(IDL.Principal),
    'properties' : Properties,
    'isPrivate' : IDL.Bool,
    'payload' : IDL.Variant({
      'StagedData' : IDL.Text,
      'Payload' : IDL.Vec(IDL.Nat8),
    }),
  });
  Query.fill(IDL.Record({ 'name' : IDL.Text, 'next' : IDL.Vec(Query) }));
  const QueryMode = IDL.Variant({ 'All' : IDL.Null, 'Some' : IDL.Vec(Query) });
  const QueryRequest = IDL.Record({ 'id' : IDL.Text, 'mode' : QueryMode });
  const Result_6 = IDL.Variant({
    'ok' : IDL.Tuple(IDL.Vec(IDL.Nat), IDL.Int),
    'err' : Error__1,
  });
  const RarityRequest = IDL.Record({
    'accessoryId' : IDL.Text,
    'rarity' : IDL.Float64,
  });
  const Chunk = IDL.Record({
    'data' : IDL.Vec(IDL.Nat8),
    'totalPages' : IDL.Nat,
    'nextPage' : IDL.Opt(IDL.Nat),
  });
  const PayloadResult = IDL.Variant({
    'Complete' : IDL.Vec(IDL.Nat8),
    'Chunk' : Chunk,
  });
  const PublicToken = IDL.Record({
    'id' : IDL.Text,
    'contentType' : IDL.Text,
    'owner' : IDL.Principal,
    'createdAt' : IDL.Int,
    'properties' : Properties,
    'payload' : PayloadResult,
  });
  const Result_4 = IDL.Variant({ 'ok' : PublicToken, 'err' : Error__1 });
  const Result_3 = IDL.Variant({ 'ok' : Chunk, 'err' : Error__1 });
  const Result_2 = IDL.Variant({ 'ok' : Metadata, 'err' : Error__1 });
  const Result_1 = IDL.Variant({ 'ok' : IDL.Nat, 'err' : Error__1 });
  const UpdateEventCallback = IDL.Variant({
    'Set' : Callback,
    'Remove' : IDL.Null,
  });
  const BlockIndex = IDL.Nat64;
  const TransferError = IDL.Variant({
    'TxTooOld' : IDL.Record({ 'allowed_window_nanos' : IDL.Nat64 }),
    'BadFee' : IDL.Record({ 'expected_fee' : ICP }),
    'TxDuplicate' : IDL.Record({ 'duplicate_of' : BlockIndex }),
    'TxCreatedInFuture' : IDL.Null,
    'InsufficientFunds' : IDL.Record({ 'balance' : ICP }),
  });
  const Balance = IDL.Nat;
  const TransferResponse = IDL.Variant({
    'ok' : Balance,
    'err' : IDL.Variant({
      'InsufficientBalance' : IDL.Null,
      'Unauthorized' : IDL.Null,
      'Other' : IDL.Null,
      'LessThanFee' : IDL.Null,
      'AllowedInsufficientBalance' : IDL.Null,
    }),
  });
  return IDL.Service({
    'accessoryBalanceOf' : IDL.Func(
        [IDL.Principal],
        [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat))],
        ['query'],
      ),
    'accessoryOwnersOf' : IDL.Func(
        [IDL.Text],
        [IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Nat))],
        ['query'],
      ),
    'accessoryProperties' : IDL.Func([IDL.Text], [Result_7], ['query']),
    'accessoryStreamingCallback' : IDL.Func(
        [StreamingCallbackToken],
        [StreamingCallbackResponse],
        ['query'],
      ),
    'accessoryTokenMetadataByIndex' : IDL.Func([IDL.Text], [Result_18], []),
    'addOwner' : IDL.Func([IDL.Principal], [IDL.Vec(IDL.Principal)], []),
    'addPrincipalsToOgs' : IDL.Func(
        [IDL.Vec(IDL.Principal)],
        [IDL.Vec(IDL.Principal)],
        [],
      ),
    'addPrincipalsToWhitelist' : IDL.Func(
        [IDL.Vec(IDL.Principal)],
        [IDL.Vec(IDL.Principal)],
        [],
      ),
    'airDrop' : IDL.Func([], [IDL.Bool], []),
    'approve' : IDL.Func([IDL.Principal, TokenIndex__2], [IDL.Bool], []),
    'assetRequest' : IDL.Func([AssetRequest], [Result], []),
    'authorize' : IDL.Func([AuthorizeRequest], [Result], []),
    'authorizeAccessory' : IDL.Func(
        [AuthorizeRequest, IDL.Principal],
        [Result],
        [],
      ),
    'balanceOf' : IDL.Func([IDL.Principal], [IDL.Vec(IDL.Text)], ['query']),
    'batchTransferFrom' : IDL.Func(
        [IDL.Principal, IDL.Vec(IDL.Principal), IDL.Vec(TokenIndex__2)],
        [TransferResponse__1],
        [],
      ),
    'blocksRedeemed' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Nat64, IDL.Bool))],
        [],
      ),
    'bulkAccessoryTokenMetadataByIndex' : IDL.Func(
        [IDL.Vec(IDL.Text)],
        [Result_17],
        [],
      ),
    'bulkGetNftStats' : IDL.Func([IDL.Vec(IDL.Text)], [Result_16], ['query']),
    'bulkTokenMetadataByIndex' : IDL.Func(
        [IDL.Vec(IDL.Text), IDL.Bool],
        [Result_15],
        ['query'],
      ),
    'burnAccessoryTokens' : IDL.Func([AccessoryMintRequest], [Result_12], []),
    'buyNow' : IDL.Func([BuyRequest], [BuyResponse], []),
    'cancelFavorite' : IDL.Func([TokenIndex__2], [IDL.Bool], []),
    'cancelList' : IDL.Func([TokenIndex__2], [ListResponse], []),
    'createAccessoryToken' : IDL.Func(
        [AccessoryEgg, IDL.Opt(IDL.Nat)],
        [Result_8],
        [],
      ),
    'currTokensOnSale' : IDL.Func([IDL.Nat], [Result_5], ['query']),
    'eventCallback' : IDL.Func([Message], [], []),
    'getAllAccessoryMetadata' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Text, AccessoryMetadata))],
        ['query'],
      ),
    'getAllNFT' : IDL.Func(
        [IDL.Principal],
        [IDL.Vec(IDL.Tuple(TokenIndex__2, IDL.Principal))],
        ['query'],
      ),
    'getAllNftPhotoCanister' : IDL.Func([], [IDL.Principal], []),
    'getApproved' : IDL.Func(
        [TokenIndex__2],
        [IDL.Vec(IDL.Principal)],
        ['query'],
      ),
    'getAuthorized' : IDL.Func([IDL.Text], [IDL.Vec(IDL.Principal)], ['query']),
    'getAuthorizedForAccessory' : IDL.Func(
        [IDL.Text, IDL.Principal],
        [IDL.Vec(IDL.Principal)],
        ['query'],
      ),
    'getAvailableNfts' : IDL.Func([], [IDL.Vec(IDL.Nat)], ['query']),
    'getBalance' : IDL.Func([], [ICP], []),
    'getBlockRedemptions' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Nat64, IDL.Bool))],
        ['query'],
      ),
    'getContractInfo' : IDL.Func([], [ContractInfo], []),
    'getCurrentLog' : IDL.Func([], [IDL.Vec(LogEntry)], ['query']),
    'getCurrentPrices' : IDL.Func([IDL.Nat], [IDL.Int], ['query']),
    'getCycles' : IDL.Func([], [IDL.Nat], ['query']),
    'getEntries' : IDL.Func(
        [],
        [
          IDL.Vec(
            IDL.Tuple(
              IDL.Text,
              IDL.Tuple(IDL.Opt(IDL.Principal), IDL.Vec(IDL.Principal)),
              Token__1,
            )
          ),
        ],
        ['query'],
      ),
    'getEventCallbackStatus' : IDL.Func([], [CallbackStatus], []),
    'getListings' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(NftPhotoStoreCID__1, Listings))],
        ['query'],
      ),
    'getLogHistory' : IDL.Func([IDL.Nat], [IDL.Vec(LogEntry), IDL.Nat], []),
    'getMetadata' : IDL.Func([], [ContractMetadata], ['query']),
    'getNFTUIDsMinted' : IDL.Func([], [IDL.Vec(IDL.Nat)], ['query']),
    'getNftPrice' : IDL.Func([IDL.Nat], [IDL.Int], ['query']),
    'getNftPriceBreakdown' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Nat, Price))],
        [],
      ),
    'getNftRarity' : IDL.Func([IDL.Text, IDL.Bool], [Result_14], ['query']),
    'getNftStats' : IDL.Func([IDL.Text], [Result_13], ['query']),
    'getNumSold' : IDL.Func([], [IDL.Nat], ['query']),
    'getOgs' : IDL.Func([], [IDL.Vec(IDL.Principal)], ['query']),
    'getOwnerToNft' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Vec(IDL.Text)))],
        ['query'],
      ),
    'getPublicSaleStartTime' : IDL.Func([], [Time], ['query']),
    'getRarity' : IDL.Func([IDL.Text], [IDL.Float64], ['query']),
    'getReservedNfts' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Vec(IDL.Nat)))],
        ['query'],
      ),
    'getRoyaltyFeeRatio' : IDL.Func([], [IDL.Nat], ['query']),
    'getSoldListings' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(NftPhotoStoreCID__1, SoldListings))],
        ['query'],
      ),
    'getStorageCanisterId' : IDL.Func([], [IDL.Opt(IDL.Principal)], ['query']),
    'getTotalAccessoryTokensCreated' : IDL.Func([], [IDL.Nat], ['query']),
    'getTotalMinted' : IDL.Func([], [IDL.Nat], ['query']),
    'getUserBalances' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Int))],
        ['query'],
      ),
    'getWICPCanisterId' : IDL.Func([], [IDL.Principal], ['query']),
    'getWhitelist' : IDL.Func([], [IDL.Vec(IDL.Principal)], ['query']),
    'http_request' : IDL.Func([Request], [Response], ['query']),
    'http_request_streaming_callback' : IDL.Func(
        [StreamingCallbackToken],
        [StreamingCallbackResponse],
        ['query'],
      ),
    'init' : IDL.Func([IDL.Vec(IDL.Principal), ContractMetadata], [], []),
    'isAuthorized' : IDL.Func([IDL.Text, IDL.Principal], [IDL.Bool], ['query']),
    'isAuthorizedForAccessory' : IDL.Func(
        [IDL.Text, IDL.Principal, IDL.Principal],
        [IDL.Bool],
        ['query'],
      ),
    'isList' : IDL.Func([TokenIndex__2], [IDL.Opt(Listings)], ['query']),
    'list' : IDL.Func([ListRequest], [ListResponse], []),
    'listAssets' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text, IDL.Nat))],
        ['query'],
      ),
    'mintAccessoryTokens' : IDL.Func([AccessoryMintRequest], [Result_12], []),
    'mutateAccessories' : IDL.Func(
        [IDL.Text, IDL.Vec(MutationRequest)],
        [Result_11],
        [],
      ),
    'myAccountId' : IDL.Func([], [IDL.Text], []),
    'myBalance' : IDL.Func([], [ICP], []),
    'myRole' : IDL.Func([], [IDL.Text], ['query']),
    'myWICPBalance' : IDL.Func([], [IDL.Nat], []),
    'newStorageCanister' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'nftStreamingCallback' : IDL.Func(
        [StreamingCallbackToken],
        [StreamingCallbackResponse],
        ['query'],
      ),
    'notify' : IDL.Func([NftInvoice, IDL.Nat64], [Result_10], []),
    'notifyAndClaim' : IDL.Func([NftInvoice, IDL.Nat64], [Result_5], []),
    'ownerOf' : IDL.Func([TokenIndex__2], [IDL.Opt(IDL.Principal)], ['query']),
    'ownerOfText' : IDL.Func([IDL.Text], [Result_9], ['query']),
    'ownerTokenEntries' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Vec(IDL.Text)))],
        ['query'],
      ),
    'preMint' : IDL.Func([Egg, IDL.Opt(IDL.Nat)], [Result_8], []),
    'pubSell' : IDL.Func([], [IDL.Bool], []),
    'queryProperties' : IDL.Func([QueryRequest], [Result_7], ['query']),
    'reserveNfts' : IDL.Func([IDL.Vec(IDL.Nat)], [Result_6], []),
    'reserveNftsInSale' : IDL.Func([IDL.Nat], [Result_6], []),
    'reservedTimeEntries' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Principal, Time))],
        ['query'],
      ),
    'resetReserved' : IDL.Func([], [Result_5], []),
    'resetSale' : IDL.Func(
        [IDL.Vec(IDL.Tuple(IDL.Nat, IDL.Nat))],
        [IDL.Vec(IDL.Nat)],
        [],
      ),
    'setApprovalForAll' : IDL.Func([IDL.Principal, IDL.Bool], [IDL.Bool], []),
    'setEventCallBack' : IDL.Func([], [], []),
    'setFavorite' : IDL.Func([TokenIndex__2], [IDL.Bool], []),
    'setNftPhotoCanister' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'setOwner' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'setPublicSaleTime' : IDL.Func([IDL.Nat], [Time], []),
    'setRarities' : IDL.Func([IDL.Vec(RarityRequest)], [], ['oneway']),
    'setRoyaltyFeeRatio' : IDL.Func([IDL.Nat], [IDL.Nat], []),
    'setStorageCanisterId' : IDL.Func([IDL.Opt(IDL.Principal)], [IDL.Bool], []),
    'setUpSale' : IDL.Func(
        [IDL.Vec(IDL.Tuple(IDL.Nat, IDL.Nat))],
        [IDL.Vec(IDL.Nat)],
        [],
      ),
    'setWICPCanisterId' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'staticStreamingCallback' : IDL.Func(
        [StreamingCallbackToken],
        [StreamingCallbackResponse],
        ['query'],
      ),
    'testLogging' : IDL.Func([], [IDL.Vec(LogEntry)], []),
    'tokenByIndex' : IDL.Func([IDL.Text], [Result_4], []),
    'tokenChunkByIndex' : IDL.Func([IDL.Text, IDL.Nat], [Result_3], []),
    'tokenMetadataByIndex' : IDL.Func([IDL.Text], [Result_2], []),
    'tokenMetadataByIndexPretty' : IDL.Func(
        [IDL.Text, IDL.Bool],
        [Result_2],
        ['query'],
      ),
    'transfer' : IDL.Func([IDL.Principal, IDL.Text], [Result], []),
    'transferAccessory' : IDL.Func(
        [IDL.Principal, IDL.Text, IDL.Principal, IDL.Nat],
        [Result_1],
        [],
      ),
    'transferFrom' : IDL.Func(
        [IDL.Principal, IDL.Principal, TokenIndex__2],
        [TransferResponse__1],
        [],
      ),
    'unreserveNfts' : IDL.Func([], [IDL.Opt(IDL.Vec(IDL.Nat))], []),
    'updateContractOwners' : IDL.Func([IDL.Principal, IDL.Bool], [Result], []),
    'updateEventCallback' : IDL.Func([UpdateEventCallback], [], []),
    'updateList' : IDL.Func([ListRequest], [ListResponse], []),
    'wallet_receive' : IDL.Func([], [IDL.Nat], []),
    'whoAmI' : IDL.Func([], [IDL.Principal], []),
    'withdrawFunds' : IDL.Func(
        [],
        [IDL.Variant({ 'Ok' : BlockIndex, 'Err' : TransferError })],
        [],
      ),
    'withdrawWICP' : IDL.Func([], [TransferResponse], []),
  });
};
export const init = ({ IDL }) => { return []; };