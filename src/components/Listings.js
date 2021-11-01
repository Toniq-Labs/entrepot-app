import React, { useEffect, useState } from "react";
import Typography from "@material-ui/core/Typography";
import MenuItem from "@material-ui/core/MenuItem";
import Chip from "@material-ui/core/Chip";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Box from "@material-ui/core/Box";
import Collapse from "@material-ui/core/Collapse";
import Slider from "@material-ui/core/Slider";
import Button from "@material-ui/core/Button";
import InputLabel from "@material-ui/core/InputLabel";
import { Grid, makeStyles } from "@material-ui/core";
import Pagination from "@material-ui/lab/Pagination";
import getGenes from "./CronicStats.js";
import extjs from "../ic/extjs.js";
import getNri from "../ic/nftv.js";
import { useTheme } from "@material-ui/core/styles";
import Listing from "./Listing";
import Sold from "./Sold";
import BuyForm from "./BuyForm";
import { useHistory } from "react-router";
const api = extjs.connect("https://boundary.ic0.app/");
const perPage = 60;
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

const _getRandomBytes = () => {
  var bs = [];
  for (var i = 0; i < 32; i++) {
    bs.push(Math.floor(Math.random() * 256));
  }
  return bs;
};
const _showListingPrice = (n) => {
  n = Number(n) / 100000000;
  return n.toFixed(8).replace(/0{1,6}$/, "");
};

const emptyListing = {
  pricing: "",
  img: "",
};

export default function Listings(props) {
  const classes = useStyles();
  const [listings, setListings] = useState(false);
  const [allListings, setAllListings] = useState(false);
  const [transactions, setTransactions] = useState(false);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("price_asc");
  const [collapseOpen, setCollapseOpen] = useState(false);
  const [healthDominantValue, setHealthDominantValue] = React.useState([0, 63]);
  const [healthRecessiveValue, setHealthRecessiveValue] = React.useState([0, 63]);
  const [speedDominantValue, setSpeedDominantValue] = React.useState([0, 63]);
  const [speedRecessiveValue, setSpeedRecessiveValue] = React.useState([0, 63]);
  const [attackDominantValue, setAttackDominantValue] = React.useState([0, 63]);
  const [attackRecessiveValue, setAttackRecessiveValue] = React.useState([0, 63]);
  const [rangeDominantValue, setRangeDominantValue] = React.useState([0, 63]);
  const [rangeRecessiveValue, setRangeRecessiveValue] = React.useState([0, 63]);
  const [magicDominantValue, setMagicDominantValue] = React.useState([0, 63]);
  const [magicRecessiveValue, setMagicRecessiveValue] = React.useState([0, 63]);
  const [defenseDominantValue, setDefenseDominantValue] = React.useState([0, 63]);
  const [defenseRecessiveValue, setDefenseRecessiveValue] = React.useState([0, 63]);
  const [resistanceDominantValue, setResistanceDominantValue] = React.useState([0, 63]);
  const [resistanceRecessiveValue, setResistanceRecessiveValue] = React.useState([0, 63]);
  const [basicDominantValue, setBasicDominantValue] = React.useState([0, 63]);
  const [basicRecessiveValue, setBasicRecessiveValue] = React.useState([0, 63]);
  const [specialDominantValue, setSpecialDominantValue] = React.useState([0, 63]);
  const [specialRecessiveValue, setSpecialRecessiveValue] = React.useState([0, 63]);
  const [baseDominantValue, setBaseDominantValue] = React.useState([0, 63]);
  const [baseRecessiveValue, setBaseRecessiveValue] = React.useState([0, 63]);
  const [showing, setShowing] = useState("all");
  const [wearableFilter, setWearableFilter] = useState("all");
  //const [collection, setCollection] = useState('nbg4r-saaaa-aaaah-qap7a-cai');
  const [collection, setCollection] = useState(props.collection);
  const [buyFormData, setBuyFormData] = useState(emptyListing);
  const [showBuyForm, setShowBuyForm] = useState(false);
  const [listingDialogOpen, setListingDialogOpen] = useState(false);
  const history = useHistory();

  const changeWearableFilter = async (event) => {
    setPage(1);
    setWearableFilter(event.target.value);
  };
  useEffect(() => {
    if (props.collection) _changeCollection(props.collection);
  }, [props.collection]);

  const changeCollection = async (event) => {
    const _collection = props.collections.find(e => e.canister === event.target.value);
    history.push(`/marketplace/${_collection.route}`);
    event.preventDefault();
    _changeCollection(_collection);
  };

  const _changeCollection = async c => {
    setWearableFilter("all");
    setSort("price_asc");
    setShowing("all");
    setCollection(c);
    setListings(false);
    setTransactions(false);
    setPage(1);
    props.loader(true);
    await refresh("all", c.canister);
    props.loader(false);
  };
  const changeSort = (event) => {
    setPage(1);
    setSort(event.target.value);
  };

  const changeListingDialogOpen = (dialogOpen) => {
    setListingDialogOpen(dialogOpen);
  };

  const handleHealthDominantValueChange = (event, newHealthDominantValue) => {
    setHealthDominantValue(newHealthDominantValue);
  };

  const handleHealthRecessiveValueChange = (event, newHealthRecessiveValue) => {
    setHealthRecessiveValue(newHealthRecessiveValue);
  };

  const handleSpeedDominantValueChange = (event, newSpeedDominantValue) => {
    setSpeedDominantValue(newSpeedDominantValue);
  };

  const handleSpeedRecessiveValueChange = (event, newSpeedRecessiveValue) => {
    setSpeedRecessiveValue(newSpeedRecessiveValue);
  };

  const handleAttackDominantValueChange = (event, newAttackDominantValue) => {
    setAttackDominantValue(newAttackDominantValue);
  };

  const handleAttackRecessiveValueChange = (event, newAttackRecessiveValue) => {
    setAttackRecessiveValue(newAttackRecessiveValue);
  };

  const handleRangeDominantValueChange = (event, newRangeDominantValue) => {
    setRangeDominantValue(newRangeDominantValue);
  };

  const handleRangeRecessiveValueChange = (event, newRangeRecessiveValue) => {
    setRangeRecessiveValue(newRangeRecessiveValue);
  };

  const handleMagicDominantValueChange = (event, newMagicDominantValue) => {
    setMagicDominantValue(newMagicDominantValue);
  };

  const handleMagicRecessiveValueChange = (event, newMagicRecessiveValue) => {
    setMagicRecessiveValue(newMagicRecessiveValue);
  };

  const handleDefenseDominantValueChange = (event, newDefenseDominantValue) => {
    setDefenseDominantValue(newDefenseDominantValue);
  };

  const handleDefenseRecessiveValueChange = (event, newDefenseRecessiveValue) => {
    setDefenseRecessiveValue(newDefenseRecessiveValue);
  };

  const handleResistanceDominantValueChange = (event, newResistanceDominantValue) => {
    setResistanceDominantValue(newResistanceDominantValue);
  };

  const handleResistanceRecessiveValueChange = (event, newResistanceRecessiveValue) => {
    setResistanceRecessiveValue(newResistanceRecessiveValue);
  };

  const handleBasicDominantValueChange = (event, newBasicDominantValue) => {
    setBasicDominantValue(newBasicDominantValue);
  };

  const handleBasicRecessiveValueChange = (event, newBasicRecessiveValue) => {
    setBasicRecessiveValue(newBasicRecessiveValue);
  };

  const handleSpecialDominantValueChange = (event, newSpecialDominantValue) => {
    setSpecialDominantValue(newSpecialDominantValue);
  };

  const handleSpecialRecessiveValueChange = (event, newSpecialRecessiveValue) => {
    setSpecialRecessiveValue(newSpecialRecessiveValue);
  };

  const handleBaseDominantValueChange = (event, newBaseDominantValue) => {
    setBaseDominantValue(newBaseDominantValue);
  };

  const handleBaseRecessiveValueChange = (event, newBaseRecessiveValue) => {
    setBaseRecessiveValue(newBaseRecessiveValue);
  };

  const handleFiltersChange = () => {
    setListings(applyAdvancedFilters(listings));
  };

  const applyAdvancedFilters = (a) => {
    return a.filter(
      (_a) => healthDominantValue[0] <= getGenes(_a[2].nonfungible.metadata[0]).battle.health.dominant
              && healthDominantValue[1] >= getGenes(_a[2].nonfungible.metadata[0]).battle.health.dominant
              && healthRecessiveValue[0] <= getGenes(_a[2].nonfungible.metadata[0]).battle.health.recessive
              && healthRecessiveValue[1] >= getGenes(_a[2].nonfungible.metadata[0]).battle.health.recessive
              && speedDominantValue[0] <= getGenes(_a[2].nonfungible.metadata[0]).battle.speed.dominant
              && speedDominantValue[1] >= getGenes(_a[2].nonfungible.metadata[0]).battle.speed.dominant
              && speedRecessiveValue[0] <= getGenes(_a[2].nonfungible.metadata[0]).battle.speed.recessive
              && speedRecessiveValue[1] >= getGenes(_a[2].nonfungible.metadata[0]).battle.speed.recessive
              && attackDominantValue[0] <= getGenes(_a[2].nonfungible.metadata[0]).battle.attack.dominant
              && attackDominantValue[1] >= getGenes(_a[2].nonfungible.metadata[0]).battle.attack.dominant
              && attackRecessiveValue[0] <= getGenes(_a[2].nonfungible.metadata[0]).battle.attack.recessive
              && attackRecessiveValue[1] >= getGenes(_a[2].nonfungible.metadata[0]).battle.attack.recessive
              && rangeDominantValue[0] <= getGenes(_a[2].nonfungible.metadata[0]).battle.range.dominant
              && rangeDominantValue[1] >= getGenes(_a[2].nonfungible.metadata[0]).battle.range.dominant
              && rangeRecessiveValue[0] <= getGenes(_a[2].nonfungible.metadata[0]).battle.range.recessive
              && rangeRecessiveValue[1] >= getGenes(_a[2].nonfungible.metadata[0]).battle.range.recessive
              && magicDominantValue[0] <= getGenes(_a[2].nonfungible.metadata[0]).battle.magic.dominant
              && magicDominantValue[1] >= getGenes(_a[2].nonfungible.metadata[0]).battle.magic.dominant
              && magicRecessiveValue[0] <= getGenes(_a[2].nonfungible.metadata[0]).battle.magic.recessive
              && magicRecessiveValue[1] >= getGenes(_a[2].nonfungible.metadata[0]).battle.magic.recessive
              && defenseDominantValue[0] <= getGenes(_a[2].nonfungible.metadata[0]).battle.defense.dominant
              && defenseDominantValue[1] >= getGenes(_a[2].nonfungible.metadata[0]).battle.defense.dominant
              && defenseRecessiveValue[0] <= getGenes(_a[2].nonfungible.metadata[0]).battle.defense.recessive
              && defenseRecessiveValue[1] >= getGenes(_a[2].nonfungible.metadata[0]).battle.defense.recessive
              && resistanceDominantValue[0] <= getGenes(_a[2].nonfungible.metadata[0]).battle.resistance.dominant
              && resistanceDominantValue[1] >= getGenes(_a[2].nonfungible.metadata[0]).battle.resistance.dominant
              && resistanceRecessiveValue[0] <= getGenes(_a[2].nonfungible.metadata[0]).battle.resistance.recessive
              && resistanceRecessiveValue[1] >= getGenes(_a[2].nonfungible.metadata[0]).battle.resistance.recessive
              && basicDominantValue[0] <= getGenes(_a[2].nonfungible.metadata[0]).battle.basic.dominant
              && basicDominantValue[1] >= getGenes(_a[2].nonfungible.metadata[0]).battle.basic.dominant
              && basicRecessiveValue[0] <= getGenes(_a[2].nonfungible.metadata[0]).battle.basic.recessive
              && basicRecessiveValue[1] >= getGenes(_a[2].nonfungible.metadata[0]).battle.basic.recessive
              && specialDominantValue[0] <= getGenes(_a[2].nonfungible.metadata[0]).battle.special.dominant
              && specialDominantValue[1] >= getGenes(_a[2].nonfungible.metadata[0]).battle.special.dominant
              && specialRecessiveValue[0] <= getGenes(_a[2].nonfungible.metadata[0]).battle.special.recessive
              && specialRecessiveValue[1] >= getGenes(_a[2].nonfungible.metadata[0]).battle.special.recessive
              && baseDominantValue[0] <= getGenes(_a[2].nonfungible.metadata[0]).battle.base.dominant
              && baseDominantValue[1] >= getGenes(_a[2].nonfungible.metadata[0]).battle.base.dominant
              && baseRecessiveValue[0] <= getGenes(_a[2].nonfungible.metadata[0]).battle.base.recessive
              && baseRecessiveValue[1] >= getGenes(_a[2].nonfungible.metadata[0]).battle.base.recessive
            )
  };

  const buyForm = (price, img) => {
    return new Promise(async (resolve, reject) => {
      setBuyFormData({
        price: price,
        img: img,
        handler: (v) => {
          setShowBuyForm(false);
          resolve(v);
          setTimeout(() => setBuyFormData(emptyListing), 100);
        },
      });
      setShowBuyForm(true);
    });
  };

  const changeShowing = (event) => {
    setWearableFilter("all");
    setPage(1);
    setShowing(event.target.value);
    if (event.target.value === "all") {
      setSort("price_asc");
    } else {
      setSort("recent");
    }
    refresh(event.target.value);
  };
  const buy = async (canisterId, listing) => {
    if (props.balance < listing[1].price + 10000n)
      return props.alert(
        "There was an error",
        "Your balance is insufficient to complete this transaction"
      );
    var tokenid = extjs.encodeTokenId(canisterId, listing[0]);
    try {
      var img =
        canisterId === "bxdf4-baaaa-aaaah-qaruq-cai"
          ? "https://qcg3w-tyaaa-aaaah-qakea-cai.raw.ic0.app/Token/" +
            listing[0]
          : "https://" + canisterId + ".raw.ic0.app/?type=thumbnail&tokenid=" + tokenid;
      var answer = await buyForm(_showListingPrice(listing[1].price), img);
      if (!answer) {
        return props.loader(false);
      }
      props.loader(true, "Locking NFT...");
      const _api = extjs.connect("https://boundary.ic0.app/", props.identity);
      var r = await _api
        .canister(canisterId)
        .lock(
          tokenid,
          listing[1].price,
          props.account.address,
          _getRandomBytes()
        );
      if (r.hasOwnProperty("err")) throw r.err;
      var paytoaddress = r.ok;
      props.loader(true, "Transferring ICP...");
      await _api
        .token()
        .transfer(
          props.identity.getPrincipal(),
          props.currentAccount,
          paytoaddress,
          listing[1].price,
          10000
        );
      var r3;
      while (true) {
        try {
          props.loader(true, "Settling purchase...");
          r3 = await _api.canister(canisterId).settle(tokenid);
          if (r3.hasOwnProperty("ok")) break;
        } catch (e) {}
      }
      props.loader(false);
      props.alert(
        "Transaction complete",
        "Your purchase was made successfully - your NFT will be sent to your address shortly"
      );
      refresh();
    } catch (e) {
      props.loader(false);
      console.log(e);
      props.alert(
        "There was an error",
        e.Other ?? "You may need to enable cookies or try a different browser"
      );
    }
  };

  const applyFilters = (a, s, c) => {
    if (
      c === "tde7l-3qaaa-aaaah-qansa-cai" &&
      wearableFilter !== "all"
    ) {
      var map = ["accessories", "hats", "eyewear", "pets"];
      a = a.filter(
        (_a) => map[_a[2].nonfungible.metadata[0][0]] === wearableFilter
      );
    } else if (
      c === "e3izy-jiaaa-aaaah-qacbq-cai" &&
      s === "all"
    ) {
      a = applyAdvancedFilters(a);
    }
    return a;
  };
  const _updates = async () => {
    await refresh();
  };

  const refresh = async (s, c) => {
    if (!listingDialogOpen) {
      s = s ?? showing;
      c = c ?? collection?.canister;
      if (s === "all") {
        try{
          if (c === "e3izy-jiaaa-aaaah-qacbq-cai") {
            var txs = await api.canister(c).transactions();
            setTransactions(txs.slice(82));
          }
          var listings = await api.canister(c).listings();
          setAllListings(listings);
          setListings(applyFilters(listings, s, c));
        } catch(e) {};
      } else {
        var txs = await api.canister(c).transactions();
        var nt = txs;
        if (c === "e3izy-jiaaa-aaaah-qacbq-cai") {
          nt = txs.slice(82);
        }
        setTransactions(applyFilters(nt, s, c));
      }
    }
  };
  const theme = useTheme();
  const styles = {
    empty: {
      maxWidth: 800,
      margin: "0 auto",
      textAlign: "center",
    },
    grid: {
      flexGrow: 1,
      padding: theme.spacing(2),
    },
  };

  useInterval(_updates, 10 * 1000);
  React.useEffect(() => {
    props.loader(true);
    _updates().then(() => {
      props.loader(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    props.loader(true);
    refresh().finally(() => props.loader(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wearableFilter]);
  return (
    <>
      <div style={styles.empty}>
        <h1>
          Browse Collections:
          <FormControl>
            <Select
              style={{
                marginLeft: 10,
                fontSize: "0.95em",
                fontWeight: "bold",
                paddingBottom: 0,
                color: "#00d092",
              }}
              value={typeof collection?.canister == "undefined" ? "er7d4-6iaaa-aaaaj-qac2q-cai" : collection.canister}
              onChange={changeCollection}
            >
              {props.collections.map((_collection) => {
                return (
                  <MenuItem
                    key={_collection.canister}
                    value={_collection.canister}
                  >
                    {_collection.name}
                    {_collection.mature ? (
                      <Chip
                        style={{ marginLeft: "10px" }}
                        variant="outlined"
                        size="small"
                        label="Mature"
                      />
                    ) : (
                      ""
                    )}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </h1>

        <p style={{ fontSize: "1.2em" }}>
          {collection?.blurb}
        </p>
      </div>
      <>
        <div style={{ marginLeft: "20px", marginTop: "10px" }}>
          <FormControl style={{ marginRight: 20 }}>
            <InputLabel>Showing</InputLabel>
            <Select value={showing} onChange={changeShowing}>
              <MenuItem value={"all"}>Current Listings</MenuItem>
              <MenuItem value={"sold"}>Sold Listings</MenuItem>
            </Select>
          </FormControl>

          <FormControl style={{ marginRight: 20 }}>
            <InputLabel>Sort by</InputLabel>
            <Select value={sort} onChange={changeSort}>
              {/*showing === "all" ? <MenuItem value={"recent"}>Recently Listed</MenuItem> : ""*/}
              {showing === "sold" ? (
                <MenuItem value={"recent"}>Recently Sold</MenuItem>
              ) : (
                ""
              )}
              <MenuItem value={"price_asc"}>Price: Low to High</MenuItem>
              <MenuItem value={"price_desc"}>Price: High to Low</MenuItem>
              <MenuItem value={"mint_number"}>Minting #</MenuItem>
              {showing === "all" &&
              [
                "e3izy-jiaaa-aaaah-qacbq-cai",
                "nbg4r-saaaa-aaaah-qap7a-cai",
              ].indexOf(collection?.canister) >= 0 ? (
                <MenuItem value={"type"}>Rare Type</MenuItem>
              ) : (
                ""
              )}
              {collection?.nftv ? (
                <MenuItem value={"gri"}>NFT Rarity Index</MenuItem>
              ) : (
                ""
              )}
              {/*showing === "all" ? <MenuItem value={"oldest"}>Oldest</MenuItem> : ""*/}
              {showing === "sold" ? (
                <MenuItem value={"oldest"}>Oldest</MenuItem>
              ) : (
                ""
              )}
            </Select>
          </FormControl>
          {showing === "all" &&
          ["e3izy-jiaaa-aaaah-qacbq-cai"].indexOf(collection?.canister) >= 0 ? (
            <div style={{ display: "inline" }}>
              <Button style={{ marginTop: "10px" }}
                variant={"outlined"}
                onClick={() => setCollapseOpen(!collapseOpen)}
                aria-expanded={collapseOpen}>
                Advanced Filters
              </Button>
            </div>
          ) : (
            ""
          )}
          {showing === "all" &&
          ["e3izy-jiaaa-aaaah-qacbq-cai"].indexOf(collection?.canister) >= 0 ? (
            <div style={{ marginTop: "20px" }}>
              <Collapse in={collapseOpen}>
                <form style={{ "flex-flow": "row wrap", display: "flex" }}>
                  <div style={{ marginTop: "20px", marginLeft: "30px" }}>
                    <InputLabel style={{fontWeight:"bold"}}>Base:</InputLabel>
                    <br/>
                    <InputLabel>Dominant:</InputLabel>
                    <Box sx={{ width: 150 }}>
                      <Slider
                        value={baseDominantValue}
                        onChange={handleBaseDominantValueChange}
                        min={0}
                        step={1}
                        max={63}
                        valueLabelDisplay="auto"
                      />
                    </Box>
                    <InputLabel>Recessive:</InputLabel>
                    <Box sx={{ width: 150 }}>
                      <Slider
                        value={baseRecessiveValue}
                        onChange={handleBaseRecessiveValueChange}
                        min={0}
                        step={1}
                        max={63}
                        valueLabelDisplay="auto"
                      />
                    </Box>
                  </div>
                  <div style={{ marginTop: "20px", marginLeft: "30px" }}>
                    <InputLabel style={{fontWeight:"bold"}}>Health:</InputLabel>
                    <br/>
                    <InputLabel>Dominant:</InputLabel>
                    <Box sx={{ width: 150 }}>
                      <Slider
                        value={healthDominantValue}
                        onChange={handleHealthDominantValueChange}
                        min={0}
                        step={1}
                        max={63}
                        valueLabelDisplay="auto"
                      />
                    </Box>
                    <InputLabel>Recessive:</InputLabel>
                    <Box sx={{ width: 150 }}>
                      <Slider
                        value={healthRecessiveValue}
                        onChange={handleHealthRecessiveValueChange}
                        min={0}
                        step={1}
                        max={63}
                        valueLabelDisplay="auto"
                      />
                    </Box>
                  </div>
                  <div style={{ marginTop: "20px", marginLeft: "30px" }}>
                    <InputLabel style={{fontWeight:"bold"}}>Speed:</InputLabel>
                    <br/>
                    <InputLabel>Dominant:</InputLabel>
                    <Box sx={{ width: 150 }}>
                      <Slider
                        value={speedDominantValue}
                        onChange={handleSpeedDominantValueChange}
                        min={0}
                        step={1}
                        max={63}
                        valueLabelDisplay="auto"
                      />
                    </Box>
                    <InputLabel>Recessive:</InputLabel>
                    <Box sx={{ width: 150 }}>
                      <Slider
                        value={speedRecessiveValue}
                        onChange={handleSpeedRecessiveValueChange}
                        min={0}
                        step={1}
                        max={63}
                        valueLabelDisplay="auto"
                      />
                    </Box>
                  </div>
                  <div style={{ marginTop: "20px", marginLeft: "30px" }}>
                    <InputLabel style={{fontWeight:"bold"}}>Attack:</InputLabel>
                    <br/>
                    <InputLabel>Dominant:</InputLabel>
                    <Box sx={{ width: 150 }}>
                      <Slider
                        value={attackDominantValue}
                        onChange={handleAttackDominantValueChange}
                        min={0}
                        step={1}
                        max={63}
                        valueLabelDisplay="auto"
                      />
                    </Box>
                    <InputLabel>Recessive:</InputLabel>
                    <Box sx={{ width: 150 }}>
                      <Slider
                        value={attackRecessiveValue}
                        onChange={handleAttackRecessiveValueChange}
                        min={0}
                        step={1}
                        max={63}
                        valueLabelDisplay="auto"
                      />
                    </Box>
                  </div>
                  <div style={{ marginTop: "20px", marginLeft: "30px" }}>
                    <InputLabel style={{fontWeight:"bold"}}>Range:</InputLabel>
                    <br/>
                    <InputLabel>Dominant:</InputLabel>
                    <Box sx={{ width: 150 }}>
                      <Slider
                        value={rangeDominantValue}
                        onChange={handleRangeDominantValueChange}
                        min={0}
                        step={1}
                        max={63}
                        valueLabelDisplay="auto"
                      />
                    </Box>
                    <InputLabel>Recessive:</InputLabel>
                    <Box sx={{ width: 150 }}>
                      <Slider
                        value={rangeRecessiveValue}
                        onChange={handleRangeRecessiveValueChange}
                        min={0}
                        step={1}
                        max={63}
                        valueLabelDisplay="auto"
                      />
                    </Box>
                  </div>
                  <div style={{ marginTop: "20px", marginLeft: "30px" }}>
                    <InputLabel style={{fontWeight:"bold"}}>Magic:</InputLabel>
                    <br/>
                    <InputLabel>Dominant:</InputLabel>
                    <Box sx={{ width: 150 }}>
                      <Slider
                        value={magicDominantValue}
                        onChange={handleMagicDominantValueChange}
                        min={0}
                        step={1}
                        max={63}
                        valueLabelDisplay="auto"
                      />
                    </Box>
                    <InputLabel>Recessive:</InputLabel>
                    <Box sx={{ width: 150 }}>
                      <Slider
                        value={magicRecessiveValue}
                        onChange={handleMagicRecessiveValueChange}
                        min={0}
                        step={1}
                        max={63}
                        valueLabelDisplay="auto"
                      />
                    </Box>
                  </div>
                  <div style={{ marginTop: "20px", marginLeft: "30px" }}>
                    <InputLabel style={{fontWeight:"bold"}}>Defense:</InputLabel>
                    <br/>
                    <InputLabel>Dominant:</InputLabel>
                    <Box sx={{ width: 150 }}>
                      <Slider
                        value={defenseDominantValue}
                        onChange={handleDefenseDominantValueChange}
                        min={0}
                        step={1}
                        max={63}
                        valueLabelDisplay="auto"
                      />
                    </Box>
                    <InputLabel>Recessive:</InputLabel>
                    <Box sx={{ width: 150 }}>
                      <Slider
                        value={defenseRecessiveValue}
                        onChange={handleDefenseRecessiveValueChange}
                        min={0}
                        step={1}
                        max={63}
                        valueLabelDisplay="auto"
                      />
                    </Box>
                  </div>
                  <div style={{ marginTop: "20px", marginLeft: "30px" }}>
                    <InputLabel style={{fontWeight:"bold"}}>Resistance:</InputLabel>
                    <br/>
                    <InputLabel>Dominant:</InputLabel>
                    <Box sx={{ width: 150 }}>
                      <Slider
                        value={resistanceDominantValue}
                        onChange={handleResistanceDominantValueChange}
                        min={0}
                        step={1}
                        max={63}
                        valueLabelDisplay="auto"
                      />
                    </Box>
                    <InputLabel>Recessive:</InputLabel>
                    <Box sx={{ width: 150 }}>
                      <Slider
                        value={resistanceRecessiveValue}
                        onChange={handleResistanceRecessiveValueChange}
                        min={0}
                        step={1}
                        max={63}
                        valueLabelDisplay="auto"
                      />
                    </Box>
                  </div>
                  {/*<div style={{ marginTop: "20px", marginLeft: "30px" }}>
                    <InputLabel>Basic:</InputLabel>
                    <br/>
                    <InputLabel>Dominant:</InputLabel>
                    <Box sx={{ width: 150 }}>
                      <Slider
                        value={basicDominantValue}
                        onChange={handleBasicDominantValueChange}
                        min={0}
                        step={1}
                        max={63}
                        valueLabelDisplay="auto"
                      />
                    </Box>
                    <InputLabel>Recessive:</InputLabel>
                    <Box sx={{ width: 150 }}>
                      <Slider
                        value={basicRecessiveValue}
                        onChange={handleBasicRecessiveValueChange}
                        min={0}
                        step={1}
                        max={63}
                        valueLabelDisplay="auto"
                      />
                    </Box>
                  </div>
                  <div style={{ marginTop: "20px", marginLeft: "30px" }}>
                    <InputLabel>Special:</InputLabel>
                    <br/>
                    <InputLabel>Dominant:</InputLabel>
                    <Box sx={{ width: 150 }}>
                      <Slider
                        value={specialDominantValue}
                        onChange={handleSpecialDominantValueChange}
                        min={0}
                        step={1}
                        max={63}
                        valueLabelDisplay="auto"
                      />
                    </Box>
                    <InputLabel>Recessive:</InputLabel>
                    <Box sx={{ width: 150 }}>
                      <Slider
                        value={specialRecessiveValue}
                        onChange={handleSpecialRecessiveValueChange}
                        min={0}
                        step={1}
                        max={63}
                        valueLabelDisplay="auto"
                      />
                    </Box>
                  </div>*/}
                </form>
                <div style={{ marginTop: "20px", display: "grid" }}>
                  <Button variant="contained"
                  color="primary"
                  style={{ backgroundColor: "#003240", color: "white", margin: "auto" }}
                    onClick={handleFiltersChange}>
                    Apply
                  </Button>
                </div>
              </Collapse>
            </div>
          ) : (
            ""
          )}
          {showing === "all" &&
          ["tde7l-3qaaa-aaaah-qansa-cai"].indexOf(collection?.canister) >= 0 ? (
            <FormControl style={{ minWidth: 120 }}>
              <InputLabel>Wearable Type</InputLabel>
              <Select value={wearableFilter} onChange={changeWearableFilter}>
                <MenuItem value={"all"}>All Wearables</MenuItem>
                <MenuItem value={"pets"}>Pets</MenuItem>
                <MenuItem value={"accessories"}>Accessories/Flags</MenuItem>
                <MenuItem value={"hats"}>Hats/Hair</MenuItem>
                <MenuItem value={"eyewear"}>Eyewear</MenuItem>
              </Select>
            </FormControl>
          ) : (
            ""
          )}

          {showing === "all" ? (
            listings.length > perPage ? (
              <Pagination
                className={classes.pagi}
                size="small"
                count={Math.ceil(listings.length / perPage)}
                page={page}
                onChange={(e, v) => setPage(v)}
              />
            ) : (
              ""
            )
          ) : transactions.length > perPage ? (
            <Pagination
              className={classes.pagi}
              size="small"
              count={Math.ceil(transactions.length / perPage)}
              page={page}
              onChange={(e, v) => setPage(v)}
            />
          ) : (
            ""
          )}
        </div>
        {showing === "all" ? (
          <>
            {listings === false ? (
              <div style={styles.empty}>
                <Typography
                  paragraph
                  style={{ paddingTop: 20, fontWeight: "bold" }}
                  align="center"
                >
                  Loading...
                </Typography>
              </div>
            ) : (
              <>
                {listings.length === 0 ? (
                  <div style={styles.empty}>
                    <Typography
                      paragraph
                      style={{ paddingTop: 20, fontWeight: "bold" }}
                      align="center"
                    >
                      There are currently no listings right now
                    </Typography>
                  </div>
                ) : (
                  <>
                    <div style={styles.grid}>
                      <Grid
                        container
                        spacing={2}
                        direction="row"
                        justifyContent="flex-start"
                        alignItems="flex-start"
                      >
                        {listings
                          .slice()
                          .sort((a, b) => {
                            switch (sort) {
                              case "price_asc":
                                return Number(a[1].price) - Number(b[1].price);
                              case "price_desc":
                                return Number(b[1].price) - Number(a[1].price);
                              case "gri":
                                return (
                                  Number(getNri(collection?.canister, b[0])) * 100 -
                                  Number(getNri(collection?.canister, a[0])) * 100
                                );
                              case "recent":
                                return 1;
                              case "oldest":
                                return -1;
                              case "mint_number":
                                return a[0] - b[0];
                              case "type":
                                var _a, _b, d;
                                if (
                                  collection?.canister === "nbg4r-saaaa-aaaah-qap7a-cai"
                                ) {
                                  _a = a[2].nonfungible.metadata[0][0];
                                  _b = b[2].nonfungible.metadata[0][0];
                                  d = _b - _a;
                                  if (d === 0) {
                                    if (Number(a[1].price) > Number(b[1].price))
                                      return 1;
                                    if (Number(a[1].price) < Number(b[1].price))
                                      return -1;
                                  }
                                  return d;
                                } else {
                                  _a = a[2].nonfungible.metadata[0][30] % 41;
                                  _b = b[2].nonfungible.metadata[0][30] % 41;
                                  if (_a === 2) _a = 1;
                                  if (_a > 1) _a = 2;
                                  if (_b === 2) _b = 1;
                                  if (_b > 1) _b = 2;
                                  d = _a - _b;
                                  if (d === 0) {
                                    if (Number(a[1].price) > Number(b[1].price))
                                      return 1;
                                    if (Number(a[1].price) < Number(b[1].price))
                                      return -1;
                                  }
                                  return d;
                                }
                              default:
                                return 0;
                            }
                          })
                          .filter(
                            (token, i) =>
                              i >= (page - 1) * perPage && i < page * perPage
                          )
                          .map((listing, i) => {
                            return (
                              <Listing
                                gri={getNri(collection?.canister, listing[0])}
                                loggedIn={props.loggedIn}
                                collection={collection?.canister}
                                buy={buy}
                                key={listing[0] + "-" + i}
                                listing={listing}
                                transactions={transactions}
                                onListingDialogChange={changeListingDialogOpen}
                              />
                            );
                          })}
                      </Grid>
                    </div>
                  </>
                )}
              </>
            )}
          </>
        ) : (
          <>
            {transactions === false ? (
              <div style={styles.empty}>
                <Typography
                  paragraph
                  style={{ paddingTop: 20, fontWeight: "bold" }}
                  align="center"
                >
                  Loading...
                </Typography>
              </div>
            ) : (
              <>
                {transactions.length === 0 ? (
                  <div style={styles.empty}>
                    <Typography
                      paragraph
                      style={{ paddingTop: 20, fontWeight: "bold" }}
                      align="center"
                    >
                      There are currently no sold transactions for this
                      collection
                    </Typography>
                  </div>
                ) : (
                  <>
                    <div style={styles.grid}>
                      <Grid
                        container
                        spacing={2}
                        direction="row"
                        justifyContent="flex-start"
                        alignItems="flex-start"
                      >
                        {transactions
                          .slice()
                          .sort((a, b) => {
                            switch (sort) {
                              case "price_asc":
                                return Number(a.price) - Number(b.price);
                              case "price_desc":
                                return Number(b.price) - Number(a.price);
                              case "gri":
                                return (
                                  Number(
                                    getNri(
                                      collection?.canister,
                                      extjs.decodeTokenId(b.token).index
                                    )
                                  ) *
                                    100 -
                                  Number(
                                    getNri(
                                      collection?.canister,
                                      extjs.decodeTokenId(a.token).index
                                    )
                                  ) *
                                    100
                                );
                              case "recent":
                                return -1;
                              case "oldest":
                                return 1;
                              case "mint_number":
                                return (
                                  extjs.decodeTokenId(a.token).index -
                                  extjs.decodeTokenId(b.token).index
                                );
                              default:
                                return 0;
                            }
                          })
                          .filter(
                            (token, i) =>
                              i >= (page - 1) * perPage && i < page * perPage
                          )
                          .map((transaction, i) => {
                            return (
                              <Sold
                                gri={getNri(
                                  collection?.canister,
                                  extjs.decodeTokenId(transaction.token).index
                                )}
                                key={transaction.token + i}
                                collection={collection?.canister}
                                transaction={transaction}
                              />
                            );
                          })}
                      </Grid>
                    </div>
                  </>
                )}
              </>
            )}
          </>
        )}
        {showing === "all" ? (
          listings.length > perPage ? (
            <Pagination
              className={classes.pagi}
              size="small"
              count={Math.ceil(listings.length / perPage)}
              page={page}
              onChange={(e, v) => setPage(v)}
            />
          ) : (
            ""
          )
        ) : transactions.length > perPage ? (
          <Pagination
            className={classes.pagi}
            size="small"
            count={Math.ceil(transactions.length / perPage)}
            page={page}
            onChange={(e, v) => setPage(v)}
          />
        ) : (
          ""
        )}
      </>
      <BuyForm open={showBuyForm} {...buyFormData} />
    </>
  );
}

const useStyles = makeStyles((theme) => ({
  pagi: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "5px",
    marginBottom: "20px",
    [theme.breakpoints.down("xs")]: {
      justifyContent: "center",
    },
  },
}));
