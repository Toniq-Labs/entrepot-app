/* global BigInt */
import React, { useEffect } from "react";
import extjs from "../ic/extjs.js";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Listings from "../components/Listings";
import Wallet from "../components/Wallet";
import Moonwalkers from "../components/sale/Moonwalkers";
import IC3D from "../components/sale/IC3D";
import HauntedHamsters from "../components/sale/HauntedHamsters";
import Button from "@material-ui/core/Button";
import { StoicIdentity } from "ic-stoic-identity";
import Sidebar from "../components/Sidebar";
import { useParams } from "react-router";
import Navbar from "../containers/Navbar.js";
const api = extjs.connect("https://boundary.ic0.app/");
const txfee = 10000;
const txmin = 100000;
const collections = [
  {
    canister: "er7d4-6iaaa-aaaaj-qac2q-cai",
    name: "MoonWalkers",
    route: "moonwalkers",
    nftv : false,
    mature: false,
    commission: 0.035,
    comaddress: "2455059d792289741fb4c3128be9dfcf25474e161923c78c37bd53c457b24e60",
    blurb: (<><p>The MoonWalker's marketplace will open after the completion of the <a href="/sale/moonwalkers">public sale</a>.</p>
        <a href="/sale/moonwalkers"><img style={{maxWidth:800}} src="https://entrepot.app/banner/icgallery2.jpg" /></a></>),
  },
  {
    canister: "e3izy-jiaaa-aaaah-qacbq-cai",
    name: "Cronic Critters",
    route: "cronics",
    nftv : true,
    mature: false,
    commission: 0.025,
    comaddress:
      "c7e461041c0c5800a56b64bb7cefc247abc0bbbb99bd46ff71c64e92d9f5c2f9",
    blurb: (
      <>
        <p style={{display:"none"}}><strong>The Cronic's Marketplace is offline during our Public Sale (starting 18.10 3PM UTC). Please head over to the <a href="https://cronic.toniqlabs.com/" target="_blank">Cronic Dashboard</a> if you would like to participate. The marketplace will be online as soon as the sales conclude. You can still delist your Cronics during this time</strong></p>
        <a style={{display:"none"}} href="https://cronic.toniqlabs.com/" target="_blank"><img style={{maxWidth:800}} src="https://cronic.toniqlabs.com/banner.png" /></a>
        Cronics is a Play-to-earn NFT game being developed by ToniqLabs for the
        Internet Computer. Cronics incorporates breeding mechanics, wearable
        NFTs and a p2e minigame ecosystem and more. Join the{" "}
        <a href="https://t.me/cronic_fun" target="_blank" rel="noreferrer">
          Telegram group
        </a>{" "}
        or read more on{" "}
        <a
          href="https://toniqlabs.medium.com/cronics-breeding-and-supply-604fa374776d"
          target="_blank"
          rel="noreferrer"
        >
          Medium
        </a>
      </>
    ),
  },

  {
    canister: "pnpu4-3aaaa-aaaah-qcceq-cai",
    name: "Infinite Chimps",
    route: "infinite-chimps",
    nftv : false,
    mature: false,
    commission: 0.035,
    comaddress: "90d2fd9f8c4005da2ebf73579a4f571763d21ce35ed4c32e83b3158cb68c7c45",
    blurb: (<p>100% of initial sales proceeds and 3% of resales go to Chimpanzee Sanctuary Northwest. The sanctuary provides a 'forever home' for chimpanzees discarded from the entertainment and biomedical testing industries. Every Infinite Chimp in this NFT collection is a portrait of a rescued chimp that now lives peacefully at the sanctuary.</p>),
  },

  {
    canister: "oeee4-qaaaa-aaaak-qaaeq-cai",
    name: "Motoko Drop",
    route: "motokodrop",
    nftv : false,
    mature: false,
    commission: 0.035,
    comaddress: "09b739076e074550862930ca17f662485076a6af60cc1b0e9a1f50b058d767c9",
    blurb: false,
  },
  {
    canister: "bid2t-gyaaa-aaaah-qcdea-cai",
    name: "Haunted Hamsters",
    route: "hauntedhamsters",
    nftv : false,
    mature: false,
    commission: 0.035,
    comaddress: "35b902472e845179b3d6ad9ff7079fee6bcadb4e0ca870230ba7a79757fa88fb",
    blurb: (<><p>The Haunted Hamters marketplace will open after the completion of the <a href="/sale/hauntedhamsters">public sale</a>.</p>
        <a href="/sale/hauntedhamsters"><img style={{maxWidth:800}} src="/banner/hauntedhamsters.jpg" /></a></>),
  },
  {
    canister: "ahl3d-xqaaa-aaaaj-qacca-cai",
    name: "ICTuTs",
    route: "ictuts",
    nftv : true,
    mature: false,
    commission: 0.025,
    comaddress:
      "b53a735c40994ddbc7bb4f6dbfbf9b2c67052842241f1c445f2255bdf4bd8982",
    blurb: false,
  },
  {
    canister: "sr4qi-vaaaa-aaaah-qcaaq-cai",
    name: "Internet Astronauts",
    route: "interastrosc",
    nftv : true,
    mature: false,
    commission: 0.035,
    comaddress:
      "2be01f5e8f081c6e8784b087fb1a88dac92fdd29203c1e456a6e90950c6e6e21",
    blurb: (<>Internet Astronauts is a collection of 10,000 unique digital NFT collectibles only found on the Internet Computer! Internet Astronauts can have advantages for various dapps on the Internet Computer Protocol(ICP) since all dapps on-chain.<br /><br />Holders will receive the Space Center membership where they can have fun. It lives on the Internet Computer Platform!</>),
  },
  {
    canister: "nfvlz-jaaaa-aaaah-qcciq-cai",
    name: "IC3D",
    route: "ic3d",
    nftv : false,
    mature: false,
    commission: 0.035,
    comaddress: "b29f5dc935f0457df12c9f91a58d77e192a0acb00694ca473d342063d375656c",
    blurb: (<><p>The IC3D marketplace will open after the completion of the <a href="/sale/ic3d">public sale</a>.</p>
        <a href="/sale/ic3d"><img style={{maxWidth:800}} src="https://entrepot.app/banner/ic3d.jpg" /></a></>),
  },
  {
    canister: "nbg4r-saaaa-aaaah-qap7a-cai",
    name: "Starverse",
    route: "starverse",
    nftv : true,
    mature: false,
    commission: 0.025,
    comaddress:
      "c7e461041c0c5800a56b64bb7cefc247abc0bbbb99bd46ff71c64e92d9f5c2f9",
    blurb: false,
  },
  {
    canister: "njgly-uaaaa-aaaah-qb6pa-cai",
    name: "ICPuppies",
    route: "icpuppies",
    nftv : true,
    mature: false,
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
    route: "icpunks",
    nftv : true,
    mature: false,
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
    route: "icdrip",
    nftv : true,
    mature: false,
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
    name: "Wild & West",
    route: "wildwest",
    nftv : false,
    mature: false,
    commission: 0.035,
    comaddress:
      "9616e04724bd990eda94a848cbfe0dab273d6d663dee7e40e6e314fb34395dcd",
    blurb: (
      <>
        <p>Wild and West: The Journey Begins. We’re excited to have you! Here are some of the amazing perks you get for participating in our pre-sale: access to the "Maverick" role in Discord along with its very own exclusive channel, daily NFT updates, and the chance to help us decide rarity. You will also be granted access to Keak the moment it launches, the chance to learn how genesis works, and any first glimpses at all future projects (collaborations and other). For more information <a href="https://t.co/v7Gy1l1ILi" target="_blank">click here</a>. We can’t thank you enough for all of your support. Welcome to the Wild and West!</p>
        <strong>Important: These NFTs are placeholder NFTs, holders will receive the real Minted NFTs on December 1st. All placeholders are equal.</strong>
      </>
    ),
  },
  {
    canister: "btggw-4aaaa-aaaah-qcdgq-cai",
    name: "IC Pumpkins",
    route: "icpumpkins",
    nftv : false,
    mature: false,
    commission: 0.035,
    comaddress:
      "9616e04724bd990eda94a848cbfe0dab273d6d663dee7e40e6e314fb34395dcd",
    blurb: (
      <>
        <p>Halloween lovers only! ICPumpkin is 2222 unique pumpkins! The collection consists of 20 really different cool characters, each with their own mood and costume for this holiday. Halloween isn’t just for candy anymore!
Specially for internet computer. Follow us on twitter: <a href="https://twitter.com/ICPumpkin" target="_blank">@ICPumpkin</a></p>
      </>
    ),
  },
  {
    canister: "73xld-saaaa-aaaah-qbjya-cai",
    name: "Wing",
    route: "wing",
    nftv : false,
    mature: true,
    commission: 0.025,
    comaddress:
      "1d978f4f38d19dca4218832e856c956678de0aa470cd492f5d8ac4377db6f2a2",
    blurb: (
      <>
        To escape from containment and restriction, releasing the stressors held
        so long in the body, Wings’s ego is jettisoned as she explores a more
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
    route: "icelebrity",
    nftv : false,
    mature: false,
    commission: 0.035,
    comaddress:
      "8b6840cb0e67738e69dbb6d79a3963f7bd93c35f593a393be5cc39cd59ed993e",
    blurb: false,
  },
  {
    canister: "k4qsa-4aaaa-aaaah-qbvnq-cai",
    name: "Faceted Meninas",
    route: "faceted-meninas",
    nftv : false,
    mature: false,
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
    nftv : false,
    mature: false,
    route: "icp-news",
    commission: 0.02,
    comaddress:
      "c7e461041c0c5800a56b64bb7cefc247abc0bbbb99bd46ff71c64e92d9f5c2f9",
    blurb: false,
  },
  {
    canister: "tde7l-3qaaa-aaaah-qansa-cai",
    name: "Cronic Wearables",
    route: "wearables",
    nftv : false,
    mature: false,
    commission: 0.025,
    comaddress:
      "c7e461041c0c5800a56b64bb7cefc247abc0bbbb99bd46ff71c64e92d9f5c2f9",
    blurb: false,
  },
  {
    canister: "gevsk-tqaaa-aaaah-qaoca-cai",
    name: "ICmojis",
    route: "icmojis",
    nftv : false,
    mature: false,
    commission: 0.02,
    comaddress:
      "df13f7ef228d7213c452edc3e52854bc17dd4189dfc0468d8cb77403e52b5a69",
    blurb: (<>ICmojis are playable characters in ICmoji Origins - a multiplayer strategy game built on the Internet Computer. Learn more at our <a href="https://icmoji.com/" target="_blank">website</a></>),
  },
  {
    canister: "owuqd-dyaaa-aaaah-qapxq-cai",
    name: "ICPuzzle",
    route: "icpuzzle",
    nftv : false,
    mature: true,
    commission: 0.02,
    comaddress:
      "12692014390fbdbb2f0a1ecd440f02d29962601a782553b45bb1a744f167f13b",
    blurb: false,
  },
  {
    canister: "q6hjz-kyaaa-aaaah-qcama-cai",
    name: "ICPBunny",
    route: "icpbunny",
    nftv : false,
    mature: false,
    commission: 0.025,
    comaddress:
      "9f04077bd8ef834f7bcca5177f28fb655a7e68d8f2da9c1e6441c4f567f5dce7",
    blurb: false,
  },
  
  
  {
    canister: "dv6u3-vqaaa-aaaah-qcdlq-cai",
    name: "Tyler Monsein & Dakota Light-Smith",
    route: "tylerdakota",
    nftv : false,
    mature: false,
    commission: 0.1,
    comaddress:
      "f9deb8b1752f6230f1f86c9ca0b7c613120733acadd3a3279ea843523f22d974",
    blurb: (<>Tyler and Dakota are a writer / designer team interested in semiotics and altered states. This is a video series in which common phrases become hypnotic mantras.</>),
  },
  
  {
    canister: "crt3j-mqaaa-aaaah-qcdnq-cai",
    name: "Neil White",
    route: "neilwhite",
    nftv : false,
    mature: false,
    commission: 0.1,
    comaddress:
      "6d4aba3426e332add7b55d88a005805b436e98bec092f42e89510596a3ac8ee5",
    blurb: (<>Neil White is a Miami-based contemporary artist. His work focuses on ironic portraits of historical icons and social commentary in the form of robots. He employs both digital art and studio painting mediums in a hyperrealistic pop art style.</>),
  },
  
  {
    canister: "cnxby-3qaaa-aaaah-qcdpq-cai",
    name: "André Wee",
    route: "andrewee",
    nftv : false,
    mature: false,
    commission: 0.1,
    comaddress:
      "ccac00c36859008eb9d33597f2c51ff8778dc4d3146d992b453eb330dee3f41c",
    blurb: (<>André Wee, a newcomer to the NFT Art scene, is an experimental illustrator
that jumps between both the virtual and physical world when he creates
his craft. The works that he creates blend Technology with Art as André
discovers newer ways of engaging with his viewers with creative
storytelling and imagery. Aside from putting pencil to paper and pushing
digital paint across a virtual canvas, André also works with animated layers
hidden within the physical world through Augmented reality where he
embeds narratives within his illustrations.
</>),
  },
  
  {
    canister: "ludo",
    name: "Ludo",
    route: "ludo",
    nftv : false,
    mature: false,
    commission: 0.1,
    comaddress:
      "60879ff49717bfef81b15288d6359a96b5705e2d3918d1f14bba1441ea84a539",
    blurb: (<>The work of Paris-based Ludo (Ludovic Vernhet) explores a world where biotechnological chimeras offer to merge plants and animals with our technological universe. Through his work, Ludo aims to reveal the opposites that cohabit our world, often taking unlikely pairings to absurd lengths. These dualities are reconciled by the artist through the creation of hybrid organisms.
Drawn with the precision of botanical illustrations, this new order of hybrid organisms is both elegant and ferocious, simple & sometimes caustic. Butterflies become brass knuckles; carnivorous plants bare rows of hunting-knife teeth; bees hover hidden behind gas masks and goggles; automatic weapons crown the head of sunflowers; human skulls cluster together like grapes.<br /><div data-paperform-id="iconic21ludo"></div>
</>),
  },
  
  {
    canister: "ckwhm-wiaaa-aaaah-qcdpa-cai",
    name: "PatternBased",
    route: "patternbased",
    nftv : false,
    mature: false,
    commission: 0.1,
    comaddress:
      "fa603565b08636498f83d493c33b8cab22ddeb59eae7ffde782a5f3f35634c6d",
    blurb: (<>PatternBased is a boutique creative label at the intersection of art and technology. PatternBased is Siori Kitajima and Joseph Minadeo. Siori Kitajima is a multimedia visual artist who explores complexity and abstraction through a variety of mediums: from canvas painting to coding. Joseph Minadeo is a film composer and multimedia artist inspired by nature and technology. Both are the characters in a film that the protagonist visits to accomplish a technical task: the geek helpers. As technical artists, they celebrate the potential of generative / procedural art and are currently exploring the world of decentralization including NFTs.</>),
  },
  
  {
    canister: "cdvmq-aaaaa-aaaah-qcdoq-cai",
    name: "Selay Karasu",
    route: "selaykarasu",
    nftv : false,
    mature: false,
    commission: 0.1,
    comaddress:
      "b4e5130404276e730dbf04515621ccae616f6665a451c0ad57daa6d2c668b62e",
    blurb: (<>Selay Karasu is a multidisciplinary artist and creative director based in Istanbul.
10 years in the industry she did numerous projection mapping and public art installations. Her A/V performances were exhibited on substantial platforms around the globe such as CERN Particle Physics Laboratory, Society For Arts And Technology [SAT], MOMA NY, Burning Man Festival (USA), WIRED, Fubiz, Vimeo(Staff Pick), Prix Ars Electronica, Signal Light Festival (CZ), IX Immersion Experience Symposium (CAN).	</>),
  },
  
  {
    canister: "ryanpgriffin",
    name: "Ryan P. Griffin",
    route: "ryanpgriffin",
    nftv : false,
    mature: false,
    commission: 0.1,
    comaddress:
      "3e3dc266e28772960518ceb5a263606e0d21a2fb5ec8c68c98740ca78b1bb60a",
    blurb: (<>Ryan P. Griffin is a visual artist based out of Los Angeles, CA. Griffin uses projected light as a vehicle to activate the environment in a poetic, performative and public way.  The artist's practice incorporates drawing, painting, photography, animation and video, while extending these traditions through contemporary digital media tools to share unique experiences. The artist organizes frequent happenings thru his ongoing project at Projected Visions, using projected light to radically repurpose place.</>),
  },
  
  {
    canister: "chloeyeemay",
    name: "Chloe Yee May",
    route: "chloeyeemay",
    nftv : false,
    mature: false,
    commission: 0.1,
    comaddress:
      "ad7027bba25b9e97a865ead26d7367de958278a0ea758d5f80f75ecf6b185516",
    blurb: (<>An illustrator, artist currently based in New York City, Chloe tackles visual storytelling through illustration with experience in branding, concept art, character design, editorial, NFTs, as well as her own private practice. She graduated with a BFA from the Rhode Island School of Design and has since been honored most recently by the Art Directors Club with a Silver Cube in their 100th Annual Awards, one of the most prestigious design accolades. She also does collaborations overseas in Asia and has had solo shows in Shanghai and Wuhan. Her most recent collaborative project with Bored Ape Yacht Club NFTs sold at Sothebys for 24 million.</>),
  },
];
function useInterval(callback, delay) {
  const savedCallback = React.useRef();
  // Remember the latest callback.
  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  React.useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

var processingPayments = false;

export default function Marketplace(props) {
  const [identity, setIdentity] = React.useState(false);
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [address, setAddress] = React.useState(false);
  const [balance, setBalance] = React.useState(0);
  const [accounts, setAccounts] = React.useState(false);
  const [currentAccount, setCurrentAccount] = React.useState(0);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const params = useParams();
  const [collection, setCollection] = React.useState(collections.find(e => e.route === params?.route));
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const _updates = async () => {
    await processPayments();
  };
  const _isCanister = c => {
    console.log(c);
    return c.length == 27 && c.split("-").length == 5;
  };
  const processPayments = async () => {
    if (!identity) return;
    if (processingPayments) return;
    processingPayments = true;
    const _api = extjs.connect("https://boundary.ic0.app/", identity);
    for (var j = 0; j < collections.length; j++) {
      if (!_isCanister(collections[j].canister)) continue;
      var payments = await _api.canister(collections[j].canister).payments();
      if (payments.length === 0) continue;
      if (payments[0].length === 0) continue;
      console.log("Payments found: " + payments[0].length);
      var a, b, c, payment;
      for (var i = 0; i < payments[0].length; i++) {
        payment = payments[0][i];
        a = extjs.toAddress(identity.getPrincipal().toText(), payment);
        b = Number(await api.token().getBalance(a));
        c = Math.round(b * collections[j].commission);
        try {
          var txs = [];
          if (b > txmin) {
            txs.push(
              _api
                .token()
                .transfer(
                  identity.getPrincipal().toText(),
                  payment,
                  address,
                  BigInt(b - (txfee + c)),
                  BigInt(txfee)
                )
            );
            txs.push(
              _api
                .token()
                .transfer(
                  identity.getPrincipal().toText(),
                  payment,
                  collections[j].comaddress,
                  BigInt(c - txfee),
                  BigInt(txfee)
                )
            );
          }
          await Promise.all(txs);
          console.log("Payment extracted successfully");
        } catch (e) {
          console.log(e);
        }
      }
    }
    processingPayments = false;
  };
  const theme = useTheme();
  const classes = useStyles();
  const styles = {
    root: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },

    empty: {
      maxWidth: 800,
      margin: "0 auto",
      textAlign: "center",
    },
    grid: {
      flexGrow: 1,
      padding: theme.spacing(2),
    },

    largeIcon: {
      width: 60,
      height: 60,
    },
  };

  const logout = async () => {
    localStorage.removeItem("_loginType");
    StoicIdentity.disconnect();
    setIdentity(false);
    setAccounts([]);
    setBalance(0);
  };
  const login = async (t) => {
    props.loader(true, "Connecting your wallet...");
    try {
      var id;
      switch (t) {
        case "stoic":
          id = await StoicIdentity.connect();
          if (id) {
            setIdentity(id);
            id.accounts().then((accs) => {
              setAccounts(JSON.parse(accs));
            });
            setCurrentAccount(0);
            localStorage.setItem("_loginType", t);
          } else {
            throw new Error("Failed to connect to your wallet");
          }
          break;
        case "plug":
          const result = await window.ic.plug.requestConnect({
            whitelist: [
              ...collections.map((a) => a.canister),
              "xkbqi-2qaaa-aaaah-qbpqq-cai",
              "d3ttm-qaaaa-aaaai-qam4a-cai",
              "qcg3w-tyaaa-aaaah-qakea-cai",
              "ryjl3-tyaaa-aaaaa-aaaba-cai",
              "qgsqp-byaaa-aaaah-qbi4q-cai",
            ],
          });
          if (result) {
            id = await window.ic.plug.agent._identity;
            setIdentity(id);
            setAccounts([
              {
                name: "PlugWallet",
                address: extjs.toAddress(id.getPrincipal().toText(), 0),
              },
            ]);
            setCurrentAccount(0);
            localStorage.setItem("_loginType", t);
          } else {
            throw new Error("Failed to connect to your wallet");
          }
          break;
        default:
          break;
      }
    } catch (e) {
      props.error(e);
    }
    props.loader(false);
  };

  useInterval(_updates, 60 * 1000);
  React.useEffect(() => {
    console.log(params?.route);
    setCollection(collections.find(e => e.route === params?.route));
  }, [params.route]);
  React.useEffect(() => {
    var t = localStorage.getItem("_loginType");
    if (t) {
      switch (t) {
        case "stoic":
          StoicIdentity.load().then(async (identity) => {
            if (identity !== false) {
              //ID is a already connected wallet!
              setIdentity(identity);
              identity.accounts().then((accs) => {
                setAccounts(JSON.parse(accs));
              });
            }
          });
          break;
        case "plug":
          (async () => {
            const connected = await window.ic.plug.isConnected();
            if (connected) {
              if (!window.ic.plug.agent) {
                await window.ic.plug.createAgent({
                  whitelist: [
                    ...collections.map((a) => a.canister),
                    "xkbqi-2qaaa-aaaah-qbpqq-cai",
                    "d3ttm-qaaaa-aaaai-qam4a-cai",
                    "qcg3w-tyaaa-aaaah-qakea-cai",
                    "ryjl3-tyaaa-aaaaa-aaaba-cai",
                    "qgsqp-byaaa-aaaah-qbi4q-cai",
                  ],
                });
              }
              var id = await window.ic.plug.agent._identity;
              setIdentity(id);
              setAccounts([
                {
                  name: "PlugWallet",
                  address: extjs.toAddress(id.getPrincipal().toText(), 0),
                },
              ]);
            }
          })();
          break;
        default:
          break;
      }
    }
    _updates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  React.useEffect(() => {
    if (identity) {
      extjs
        .connect("https://boundary.ic0.app/", identity)
        .canister("qgsqp-byaaa-aaaah-qbi4q-cai")
        .log();
      setLoggedIn(true);
      setAddress(extjs.toAddress(identity.getPrincipal().toText(), 0));
    } else {
      setLoggedIn(false);
      setAddress(false);
      setAccounts(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [identity]);

  return (
    <>
      <Navbar />
      <Sidebar
        view={props.view}
        setBalance={setBalance}
        identity={identity}
        account={accounts.length > 0 ? accounts[currentAccount] : false}
        loader={props.loader}
        logout={logout}
        login={login}
        collections={collections}
        collection={collection}
        currentAccount={currentAccount}
        changeAccount={setCurrentAccount}
        accounts={accounts}
        onClose={handleDrawerToggle}
        open={mobileOpen}
      />
      <main className={classes.content}>
        <div style={styles.root}>
          <Button
            className={classes.walletBtn}
            fullWidth
            variant={"contained"}
            onClick={handleDrawerToggle}
            color={"primary"}
            style={{ fontWeight: "bold", margin: "0 auto" }}
          >
            View Wallet
          </Button>
          {props.view === "listings" ? (
            <Listings
              view={"listings"}
              balance={balance}
              identity={identity}
              confirm={props.confirm}
              currentAccount={currentAccount}
              account={accounts.length > 0 ? accounts[currentAccount] : false}
              loggedIn={loggedIn}
              collections={collections}
              collection={collection}
              loader={props.loader}
              alert={props.alert}
              error={props.error}
            />
          ) : (
            ""
          )}
          {props.view === "wallet" ? (
            <Wallet
              view={"wallet"}
              identity={identity}
              confirm={props.confirm}
              currentAccount={currentAccount}
              account={accounts.length > 0 ? accounts[currentAccount] : false}
              loggedIn={loggedIn}
              collections={collections}
              collection={collection}
              loader={props.loader}
              alert={props.alert}
              error={props.error}
            />
          ) : (
            ""
          )}
          {props.view === "sale" ? 
            <>{props.sale === "moonwalkers" ? 
              <Moonwalkers
                view={"wallet"}
                identity={identity}
                balance={balance}
                confirm={props.confirm}
                currentAccount={currentAccount}
                account={accounts.length > 0 ? accounts[currentAccount] : false}
                loggedIn={loggedIn}
                collections={collections}
                collection={collection}
                loader={props.loader}
                alert={props.alert}
                error={props.error}
            /> : ""}</>
           : ""}
          {props.view === "sale" ? 
            <>{props.sale === "ic3d" ? 
              <IC3D
                view={"wallet"}
                identity={identity}
                balance={balance}
                confirm={props.confirm}
                currentAccount={currentAccount}
                account={accounts.length > 0 ? accounts[currentAccount] : false}
                loggedIn={loggedIn}
                collections={collections}
                collection={collection}
                loader={props.loader}
                alert={props.alert}
                error={props.error}
            /> : ""}</>
           : ""}
           
          {props.view === "sale" ? 
            <>{props.sale === "hauntedhamsters" ? 
              <HauntedHamsters
                view={"wallet"}
                identity={identity}
                balance={balance}
                confirm={props.confirm}
                currentAccount={currentAccount}
                account={accounts.length > 0 ? accounts[currentAccount] : false}
                loggedIn={loggedIn}
                collections={collections}
                collection={collection}
                loader={props.loader}
                alert={props.alert}
                error={props.error}
            /> : ""}</>
           : ""}
        </div>
      </main>
    </>
  );
}

const useStyles = makeStyles((theme) => ({
  walletBtn: {
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  content: {
    flexGrow: 1,
    marginTop: 73,
    marginLeft: 0,
    [theme.breakpoints.up("sm")]: {
      marginLeft: 300,
    },
  },
}));
