import React, { useEffect } from "react";
import Button from "@material-ui/core/Button";

var collections = [
  {
    canister: "dknxi-2iaaa-aaaah-qceuq-cai",
    name: "Dfinity Bulls",
    brief : "8888 Dfinity Bulls of the IC",
    description : "The bulls of the IC - P2E game coming soon",
    keywords : "bulls dfinity",
    banner : "/banner/bulls.jpg",
    //discord : "https://discord.gg/mA5cXdAtwe",
    //twitter : "https://twitter.com/IVCNFT",
    //web : "https://www.infernalvampires.com",
    route: "dfinitybulls",
    nftv : false,
    mature: false,
    market : true,
    commission: 0.035,
    comaddress: "7243722b9db43a26170b2bbc065b02f5ca2d1836ddaaee5ef05fc043a01f9ed9",
    blurb: (<><p>The bulls of the IC - P2E game coming soon</p><Button href="/sale/dfinitybulls" variant="outlined" color={"primary"} style={{fontWeight:"bold", cursor:"pointer"}}>Buy from Public Sale</Button></>),
  },
  {
    canister: "gyuaf-kqaaa-aaaah-qceka-cai",
    name: "Infernal Vampire Colony",
    brief : "666 Bloodthirsty Infernal Vampires",
    description : "Infernal Vampires had been in the lair for a long time. They finally managed to get out. Time for them to suck some blood!",
    keywords : "Vampire, Vampires, Infernal, Colony, Blood, Bloodthirsty, 666, Lair",
    banner : "/collections/ivc/banner.jpg",
    avatar : "/collections/ivc/avatar.png",
    collection : "/collections/ivc/collection.jpg",
    discord : "https://discord.gg/mA5cXdAtwe",
    twitter : "https://twitter.com/IVCNFT",
    web : "https://www.infernalvampires.com",
    route: "ivc",
    nftv : true,
    mature: false,
    market : true,
    commission: 0.035,
    comaddress: "7243722b9db43a26170b2bbc065b02f5ca2d1836ddaaee5ef05fc043a01f9ed9",
    blurb: (<><p>Infernal Vampires had been in the lair for a long time. They finally managed to get out. Time for them to suck some blood!</p></>),
  },
  {
    canister: "oeee4-qaaaa-aaaak-qaaeq-cai",
    brief : "10,000 Motokos dropped by DFINITY",
    name: "Motoko Day Drop",
    keywords : "",
    banner : "/banner/motoko2.jpg",
    discord : "https://t.co/fD0VHKGaFu?amp=1",
    twitter : "https://twitter.com/pokedstudiouk",
    route: "motoko",
    nftv : true,
    mature: false,
    market : true,
    commission: 0.035,
    comaddress: "09b739076e074550862930ca17f662485076a6af60cc1b0e9a1f50b058d767c9",
    blurb: (<><p>10,000 Motoko Ghosts designed by Jon Ball of Pokedstudios were distributed to the community on the 1 year birthday of the Motoko Programming language. 7,000 airdropped to DSCVR users and 3000 distributed to in-person attendees of NFT.NYC 2021.</p></>),
  },
  {
    canister: "er7d4-6iaaa-aaaaj-qac2q-cai",
    name: "MoonWalkers",
    brief : "9999 3D MoonWalkers by IC Gallery",
    route: "moonwalkers",
    keywords : "",
    banner : "/banner/icgallery2.jpg",
    nftv : false,
    mature: false,
    market : true,
    commission: 0.035,
    comaddress: "2455059d792289741fb4c3128be9dfcf25474e161923c78c37bd53c457b24e60",
    blurb: (<><p>The MoonWalker's marketplace will open after the completion of the <a href="/sale/moonwalkers">public sale</a>.</p></>),
  },
  {
    canister: "e3izy-jiaaa-aaaah-qacbq-cai",
    name: "Cronic Critters",
    brief : "The first IC NFT by Toniq",
    route: "cronics",
    banner:"https://cronic.toniqlabs.com/banner.png",
    twitter:"https://twitter.com/CronicsP2E",
    telegram:"https://t.me/cronic_talk",
    medium:"https://toniqlabs.medium.com/cronics-breeding-and-supply-604fa374776d",
    keywords : "",
    nftv : true,
    mature: false,
    market : true,
    commission: 0.025,
    comaddress:"c7e461041c0c5800a56b64bb7cefc247abc0bbbb99bd46ff71c64e92d9f5c2f9",
    blurb: (<>Cronics is a Play-to-earn NFT game being developed by ToniqLabs for the Internet Computer. Cronics incorporates breeding mechanics, wearable NFTs and a p2e minigame ecosystem and more.</>),
  },

  {
    canister: "pnpu4-3aaaa-aaaah-qcceq-cai",
    name: "Infinite Chimps",
    brief : "A collaboration of goodness",
    route: "infinite-chimps",
    keywords : "",
    nftv : false,
    mature: false,
    market : true,
    commission: 0.035,
    comaddress: "90d2fd9f8c4005da2ebf73579a4f571763d21ce35ed4c32e83b3158cb68c7c45",
    blurb: (<p>100% of initial sales proceeds and 3% of resales go to Chimpanzee Sanctuary Northwest. The sanctuary provides a 'forever home' for chimpanzees discarded from the entertainment and biomedical testing industries. Every Infinite Chimp in this NFT collection is a portrait of a rescued chimp that now lives peacefully at the sanctuary.</p>),
  },

  {
    canister: "bid2t-gyaaa-aaaah-qcdea-cai",
    name: "Haunted Hamsters",
    brief : "6666 Haunted and spooky Hamsters",
    route: "hauntedhamsters",
    banner : "/banner/hauntedhamsters.jpg",
    keywords : "",
    nftv : false,
    mature: false,
    market : false,
    commission: 0.035,
    comaddress: "35b902472e845179b3d6ad9ff7079fee6bcadb4e0ca870230ba7a79757fa88fb",
    blurb: (<><p>The Haunted Hamters marketplace will open after the completion of the <a href="/sale/hauntedhamsters">public sale</a>.</p></>),
  },
  {
    canister: "ahl3d-xqaaa-aaaaj-qacca-cai",
    name: "ICTuTs",
    brief : "10,000 NFTs based on King TuT",
    route: "ictuts",
    banner : "/banner/ictuts.png",
    keywords : "",
    nftv : true,
    mature: false,
    market : true,
    commission: 0.025,
    comaddress:
      "b53a735c40994ddbc7bb4f6dbfbf9b2c67052842241f1c445f2255bdf4bd8982",
    blurb: false,
  },
  {
    canister: "sr4qi-vaaaa-aaaah-qcaaq-cai",
    name: "Internet Astronauts - IASC",
    brief : "10,000 Internet Astronauts given to top ICP users",
    description : "Internet Astronauts is a collection of 10,000 collectibles only found on the Internet Computer! Internet Astronauts can have small privileges on various dApps on ICP.",
    route: "interastrosc",
    keywords : "internet astronaut, astronaut nft, iasc, astronaut,",
    banner : "/collections/iasc/banner.jpg",
    avatar : "/collections/iasc/avatar.png",
    collection : "/collections/iasc/collection.jpg",
    discord : "https://discord.gg/cnEafbxb",
    twitter : "https://twitter.com/interastrosc",
    web : "",
    nftv : true,
    mature: false,
    market : true,
    commission: 0.035,
    comaddress:
      "2be01f5e8f081c6e8784b087fb1a88dac92fdd29203c1e456a6e90950c6e6e21",
    blurb: (<>Internet Astronauts given to top active users of ICP for zero cost.<br /><br/>Various dApps on IC agreed to collab on IASC for future perks. NFT authenticators will lead willing dApps can accept pre-existing NFT's and offer some benefits. However, at this point, IASC is the first of its kind and third-generation NFT set and cannot sure on future so think IASC as collectible art pieces!
</>),
  },
  {
    canister: "nfvlz-jaaaa-aaaah-qcciq-cai",
    name: "IC3D",
    brief : "10,000 3D Scenes made of 60,000 NFTs",
    route: "ic3d",
    keywords : "",
    banner : "/banner/ic3d.jpg",
    nftv : false,
    mature: false,
    market : false,
    commission: 0.035,
    comaddress: "b29f5dc935f0457df12c9f91a58d77e192a0acb00694ca473d342063d375656c",
    blurb: (<><p>The IC3D marketplace will open after the completion of the <a href="/sale/ic3d">public sale</a>.</p></>),
  },
  {
    canister: "nbg4r-saaaa-aaaah-qap7a-cai",
    name: "Starverse",
    brief : "The first free NFT airdrop",
    route: "starverse",
    keywords : "",
    nftv : true,
    mature: false,
    market : true,
    commission: 0.025,
    comaddress:
      "c7e461041c0c5800a56b64bb7cefc247abc0bbbb99bd46ff71c64e92d9f5c2f9",
    blurb: false,
  },
  {
    canister: "njgly-uaaaa-aaaah-qb6pa-cai",
    name: "ICPuppies",
    brief : "10,000 8-bit Puppies",
    route: "icpuppies",
    keywords : "",
    nftv : true,
    mature: false,
    market : true,
    commission: 0.035,
    comaddress:
      "9f76290b181807c5fa3c7cfcfca2525d578a3770f40ae8b14a03a4a3530368e2",
    blurb: (
      <>
        10,000 randomly generated 8-bit puppy NFTs. Join the{" "}
        <a href="discord.gg/A3rmDSjBaJ" target="_blank" rel="noreferrer">
          Discord
        </a>{" "}
        or follow us on{" "}
        <a
          href="https://twitter.com/ICPuppies"
          target="_blank"
          rel="noreferrer"
        >
          Twitter
        </a>
      </>
    ),
  },
  {
    canister: "bxdf4-baaaa-aaaah-qaruq-cai",
    name: "ICPunks",
    brief : "10,000 ICPunks - 2nd NFT on the IC",
    route: "icpunks",
    keywords : "",
    nftv : true,
    mature: false,
    market : true,
    commission: 0.035,
    comaddress:
      "c47942416fa8e7151f679d57a6b2d2e01a92fecd5e6f9ac99f6db548ea4f37aa",
    blurb: (
      <>
        Are you down with the clown? Get your hands on the latest NFT to hit the
        Internet Computer! You can wrap and trade them on the Marketplace!{" "}
        <strong>
          Wrapped ICPunks are 1:1 wrapped versions of actual ICPunks
        </strong>{" "}
        - you can read more about how to wrap, unwrap, and how safe it is{" "}
        <a
          href="https://medium.com/@toniqlabs/wrapped-nfts-8c91fd3a4c1"
          target="_blank"
          rel="noreferrer"
        >
          here
        </a>
      </>
    ),
  },
  {
    canister: "3db6u-aiaaa-aaaah-qbjbq-cai",
    name: "IC Drip",
    brief : "Drip on the IC",
    route: "icdrip",
    keywords : "",
    nftv : true,
    mature: false,
    market : true,
    commission: 0.025,
    comaddress:
      "c7e461041c0c5800a56b64bb7cefc247abc0bbbb99bd46ff71c64e92d9f5c2f9",
    blurb: (
      <>
        IC Drip are randomly generated meta-commerce shopping carts for outfits
        and personas stored on chain. Stats, images, and other functionality are
        intentionally omitted for others to interpret. Feel free to use IC Drip
        in any way you want.{" "}
        <a
          href="https://dvr6e-lqaaa-aaaai-qam5a-cai.raw.ic0.app/"
          target="_blank"
          rel="noreferrer"
        >
          IC Drip Website
        </a>
      </>
    ),
  },
  {
    canister: "b5el6-hqaaa-aaaah-qcdhq-cai",
    name: "Wild and West",
    brief : "Collection by the Wild and West team",
    route: "wildwest",
    banner:"/banner/ww.png",
    keywords : "",
    nftv : false,
    mature: false,
    market : true,
    commission: 0.035,
    comaddress:
      "9616e04724bd990eda94a848cbfe0dab273d6d663dee7e40e6e314fb34395dcd",
    blurb: (
      <>
        <p>Wild and West: The Journey Begins. We're excited to have you! Here are some of the amazing perks you get for participating in our pre-sale: access to the "Maverick" role in Discord along with its very own exclusive channel, daily NFT updates, and the chance to help us decide rarity. You will also be granted access to Keak the moment it launches, the chance to learn how genesis works, and any first glimpses at all future projects (collaborations and other). For more information <a href="https://t.co/v7Gy1l1ILi" target="_blank">click here</a>. We can't thank you enough for all of your support. Welcome to the Wild and West!</p>
        <strong>Important: These NFTs are placeholder NFTs, holders will receive the real Minted NFTs on December 1st. All placeholders are equal.</strong>
      </>
    ),
  },
  {
    canister: "btggw-4aaaa-aaaah-qcdgq-cai",
    name: "IC Pumpkins",
    brief : "Halloween themed pumpkins",
    route: "icpumpkins",
    keywords : "",
    nftv : false,
    mature: false,
    market : true,
    commission: 0.035,
    comaddress:
      "9616e04724bd990eda94a848cbfe0dab273d6d663dee7e40e6e314fb34395dcd",
    blurb: (
      <>
        <p>Halloween lovers only! ICPumpkin is 2222 unique pumpkins! The collection consists of 20 really different cool characters, each with their own mood and costume for this holiday. Halloween isn't just for candy anymore!
Specially for internet computer. Follow us on twitter: <a href="https://twitter.com/ICPumpkin" target="_blank">@ICPumpkin</a></p>
      </>
    ),
  },
  {
    canister: "73xld-saaaa-aaaah-qbjya-cai",
    name: "Wing",
    keywords : "",
    route: "wing",
    brief : "Photos by Oli and Wing",
    nftv : false,
    mature: true,
    market : true,
    commission: 0.025,
    comaddress:
      "1d978f4f38d19dca4218832e856c956678de0aa470cd492f5d8ac4377db6f2a2",
    blurb: (
      <>
        To escape from containment and restriction, releasing the stressors held
        so long in the body, Wings's ego is jettisoned as she explores a more
        fundamental form of existence, expressing her humanity in this elemental
        piece.
        <br />
        She is framed within the themes of air, water, to take flight on chalky
        cliff tops overlooking distant horizons, to express the existential
        freedom that lives within. No borders.
        <br />
        And so through this series I invite the viewer to celebrate their own
        sovereignty of consciousness; to be bold as we emerge from our cocoons
        and open ourselves up to the world and each other again.
      </>
    ),
  },
  {
    canister: "kss7i-hqaaa-aaaah-qbvmq-cai",
    name: "ICelebrity",
    brief : "100 Handrawn celeberities",
    route: "icelebrity",
    keywords : "",
    nftv : false,
    mature: false,
    market : true,
    commission: 0.035,
    comaddress:
      "8b6840cb0e67738e69dbb6d79a3963f7bd93c35f593a393be5cc39cd59ed993e",
    blurb: false,
  },
  {
    canister: "k4qsa-4aaaa-aaaah-qbvnq-cai",
    name: "Faceted Meninas",
    brief : "Unique 3D Meninas",
    route: "faceted-meninas",
    keywords : "",
    nftv : false,
    mature: false,
    market : true,
    commission: 0.02,
    comaddress:
      "12692014390fbdbb2f0a1ecd440f02d29962601a782553b45bb1a744f167f13b",
    blurb: (
      <>
        Faceted Meninas is a creature species that holds the power of the
        universe to act as a magic pillar giving their allies the essence of
        outer worlds to maximize their powers.
      </>
    ),
  },
  {
    canister: "uzhxd-ziaaa-aaaah-qanaq-cai",
    name: "ICP News",
    brief : "Art by ICP News",
    nftv : false,
    keywords : "",
    mature: false,
    market : true,
    route: "icp-news",
    commission: 0.02,
    comaddress:
      "c7e461041c0c5800a56b64bb7cefc247abc0bbbb99bd46ff71c64e92d9f5c2f9",
    blurb: false,
  },
  {
    canister: "tde7l-3qaaa-aaaah-qansa-cai",
    name: "Cronic Wearables",
    brief : "Wearables for your Cronic",
    route: "wearables",
    nftv : false,
    keywords : "",
    mature: false,
    market : true,
    commission: 0.025,
    comaddress:
      "c7e461041c0c5800a56b64bb7cefc247abc0bbbb99bd46ff71c64e92d9f5c2f9",
    blurb: false,
  },
  {
    canister: "gevsk-tqaaa-aaaah-qaoca-cai",
    name: "ICmojis",
    route: "icmojis",
    brief : "Unique emojis on the IC",
    nftv : false,
    mature: false,
    market : true,
    keywords : "",
    commission: 0.02,
    comaddress:
      "df13f7ef228d7213c452edc3e52854bc17dd4189dfc0468d8cb77403e52b5a69",
    blurb: (<>ICmojis are playable characters in ICmoji Origins - a multiplayer strategy game built on the Internet Computer. Learn more at our <a href="https://icmoji.com/" target="_blank">website</a></>),
  },
  {
    canister: "owuqd-dyaaa-aaaah-qapxq-cai",
    name: "ICPuzzle",
    brief : "Find where you fit in the puzzle",
    route: "icpuzzle",
    nftv : false,
    keywords : "",
    mature: true,
    market : true,
    commission: 0.02,
    comaddress:
      "12692014390fbdbb2f0a1ecd440f02d29962601a782553b45bb1a744f167f13b",
    blurb: false,
  },
  {
    canister: "q6hjz-kyaaa-aaaah-qcama-cai",
    name: "ICPBunny",
    brief : "10,000 ICBunnies on the IC",
    route: "icpbunny",
    nftv : false,
    mature: false,
    market : true,
    commission: 0.025,
    comaddress:
      "9f04077bd8ef834f7bcca5177f28fb655a7e68d8f2da9c1e6441c4f567f5dce7",
    blurb: false,
  },
  {
    canister: "eb7r3-myaaa-aaaah-qcdya-cai",
    name: "Iconic2021",
    brief : "The Iconic 2021 curated collection",
    route: "iconic2021",
    nftv : false,
    mature: false,
    market : true,
    keywords : "",
    commission: 0.035,
    comaddress:
      "c7e461041c0c5800a56b64bb7cefc247abc0bbbb99bd46ff71c64e92d9f5c2f9",
    blurb: false,
  },
  
  
  {
    canister: "dv6u3-vqaaa-aaaah-qcdlq-cai",
    name: "Tyler & Dakota",
    route: "tylerdakota",
    brief : "An Iconic 2021 Collection",
    nftv : false,
    keywords : "",
    mature: false,
    market : true,
    commission: 0.1,
    comaddress:
      "f9deb8b1752f6230f1f86c9ca0b7c613120733acadd3a3279ea843523f22d974",
    blurb: (<>Tyler and Dakota are a writer / designer team interested in semiotics and altered states. This is a video series in which common phrases become hypnotic mantras.<br /><br /><Button data-paperform-id="inconic21tylerdak" data-popup-button="1" variant="outlined" color={"primary"} style={{fontWeight:"bold", cursor:"pointer"}}>Subcribe for Updates!</Button></>),
  },
  
  {
    canister: "crt3j-mqaaa-aaaah-qcdnq-cai",
    name: "Neil White",
    route: "neilwhite",
    brief : "An Iconic 2021 Collection",
    nftv : false,
    keywords : "",
    mature: false,
    market : true,
    commission: 0.1,
    comaddress:
      "6d4aba3426e332add7b55d88a005805b436e98bec092f42e89510596a3ac8ee5",
    blurb: (<>Neil White is a Miami-based contemporary artist. His work focuses on ironic portraits of historical icons and social commentary in the form of robots. He employs both digital art and studio painting mediums in a hyperrealistic pop art style.<br /><br /><Button data-paperform-id="5bxwhthj" data-popup-button="1" variant="outlined" color={"primary"} style={{fontWeight:"bold", cursor:"pointer"}}>Subcribe for Updates!</Button></>),
  },
  
  {
    canister: "cnxby-3qaaa-aaaah-qcdpq-cai",
    name: "Andre Wee",
    route: "andrewee",
    brief : "An Iconic 2021 Collection",
    nftv : false,
    keywords : "",
    mature: false,
    market : true,
    commission: 0.1,
    comaddress:
      "ccac00c36859008eb9d33597f2c51ff8778dc4d3146d992b453eb330dee3f41c",
    blurb: (<>André Wee, a newcomer to the NFT Art scene, is an experimental illustrator that jumps between both the virtual and physical world when he creates his craft. The works that he creates blend Technology with Art as André discovers newer ways of engaging with his viewers with creative storytelling and imagery. Aside from putting pencil to paper and pushing digital paint across a virtual canvas, André also works with animated layers hidden within the physical world through Augmented reality where he embeds narratives within his illustrations.<br /><br /><Button data-paperform-id="nunweq3r" data-popup-button="1" variant="outlined" color={"primary"} style={{fontWeight:"bold", cursor:"pointer"}}>Subcribe for Updates!</Button></>),
  },
  
  {
    canister: "ludo",
    name: "Ludo",
    route: "ludo",
    brief : "An Iconic 2021 Collection",
    nftv : false,
    keywords : "",
    mature: false,
    market : false,
    commission: 0.1,
    comaddress:
      "60879ff49717bfef81b15288d6359a96b5705e2d3918d1f14bba1441ea84a539",
    blurb: (<>The work of Paris-based Ludo (Ludovic Vernhet) explores a world where biotechnological chimeras offer to merge plants and animals with our technological universe. Through his work, Ludo aims to reveal the opposites that cohabit our world, often taking unlikely pairings to absurd lengths. These dualities are reconciled by the artist through the creation of hybrid organisms.
Drawn with the precision of botanical illustrations, this new order of hybrid organisms is both elegant and ferocious, simple & sometimes caustic. Butterflies become brass knuckles; carnivorous plants bare rows of hunting-knife teeth; bees hover hidden behind gas masks and goggles; automatic weapons crown the head of sunflowers; human skulls cluster together like grapes.<br /><br /><strong>Art will be on sale after BTC integration</strong><br /><br /><Button data-paperform-id="iconic21ludo" data-popup-button="1" variant="outlined" color={"primary"} style={{fontWeight:"bold", cursor:"pointer"}}>Subcribe for Updates!</Button></>),
  },
  
  {
    canister: "ckwhm-wiaaa-aaaah-qcdpa-cai",
    name: "PatternBased",
    route: "patternbased",
    brief : "An Iconic 2021 Collection",
    nftv : false,
    mature: false,
    market : true,
    keywords : "",
    commission: 0.1,
    comaddress:
      "fa603565b08636498f83d493c33b8cab22ddeb59eae7ffde782a5f3f35634c6d",
    blurb: (<>PatternBased is a boutique creative label at the intersection of art and technology. PatternBased is Siori Kitajima and Joseph Minadeo. Siori Kitajima is a multimedia visual artist who explores complexity and abstraction through a variety of mediums: from canvas painting to coding. Joseph Minadeo is a film composer and multimedia artist inspired by nature and technology. Both are the characters in a film that the protagonist visits to accomplish a technical task: the geek helpers. As technical artists, they celebrate the potential of generative / procedural art and are currently exploring the world of decentralization including NFTs.<br /><br /><Button data-paperform-id="iconic21pattern" data-popup-button="1" variant="outlined" color={"primary"} style={{fontWeight:"bold", cursor:"pointer"}}>Subcribe for Updates!</Button></>),
  },
  
  {
    canister: "cdvmq-aaaaa-aaaah-qcdoq-cai",
    name: "Selay Karasu",
    route: "selaykarasu",
    brief : "An Iconic 2021 Collection",
    nftv : false,
    mature: false,
    market : true,
    keywords : "",
    commission: 0.1,
    comaddress:
      "b4e5130404276e730dbf04515621ccae616f6665a451c0ad57daa6d2c668b62e",
    blurb: (<>Selay Karasu is a multidisciplinary artist and creative director based in Istanbul.
10 years in the industry she did numerous projection mapping and public art installations. Her A/V performances were exhibited on substantial platforms around the globe such as CERN Particle Physics Laboratory, Society For Arts And Technology [SAT], MOMA NY, Burning Man Festival (USA), WIRED, Fubiz, Vimeo(Staff Pick), Prix Ars Electronica, Signal Light Festival (CZ), IX Immersion Experience Symposium (CAN).<br /><br /><Button data-paperform-id="inconic2021selay" data-popup-button="1" variant="outlined" color={"primary"} style={{fontWeight:"bold", cursor:"pointer"}}>Subcribe for Updates!</Button></>),
  },
  
  {
    canister: "ryanpgriffin",
    name: "Ryan P. Griffin",
    route: "ryanpgriffin",
    brief : "An Iconic 2021 Collection",
    nftv : false,
    mature: false,
    market : false,
    keywords : "",
    commission: 0.1,
    comaddress:
      "3e3dc266e28772960518ceb5a263606e0d21a2fb5ec8c68c98740ca78b1bb60a",
    blurb: (<>Ryan P. Griffin is a visual artist based out of Los Angeles, CA. Griffin uses projected light as a vehicle to activate the environment in a poetic, performative and public way.  The artist's practice incorporates drawing, painting, photography, animation and video, while extending these traditions through contemporary digital media tools to share unique experiences. The artist organizes frequent happenings thru his ongoing project at Projected Visions, using projected light to radically repurpose place.<br /><br /><strong>Art will be ready soon for minting</strong><br /><br /><Button data-paperform-id="iconic21pattern" data-popup-button="1" variant="outlined" color={"primary"} style={{fontWeight:"bold", cursor:"pointer"}}>Subcribe for Updates!</Button></>),
  },
  
  {
    canister: "chloeyeemay",
    name: "Chloe Yee May",
    route: "chloeyeemay",
    brief : "An Iconic 2021 Collection",
    nftv : false,
    mature: false,
    market : false,
    keywords : "",
    commission: 0.1,
    comaddress:
      "ad7027bba25b9e97a865ead26d7367de958278a0ea758d5f80f75ecf6b185516",
    blurb: (<>An illustrator, artist currently based in New York City, Chloe tackles visual storytelling through illustration with experience in branding, concept art, character design, editorial, NFTs, as well as her own private practice. She graduated with a BFA from the Rhode Island School of Design and has since been honored most recently by the Art Directors Club with a Silver Cube in their 100th Annual Awards, one of the most prestigious design accolades. She also does collaborations overseas in Asia and has had solo shows in Shanghai and Wuhan.<br /><br /><strong>Art for display only</strong></>),
  },
];
export default collections;