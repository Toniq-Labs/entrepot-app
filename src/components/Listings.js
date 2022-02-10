import React, { useEffect, useState } from "react";
import Typography from "@material-ui/core/Typography";
import MenuItem from "@material-ui/core/MenuItem";
import Chip from "@material-ui/core/Chip";
import CachedIcon from '@material-ui/icons/Cached';
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Drawer from '@material-ui/core/Drawer';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Collapse from "@material-ui/core/Collapse";
import Slider from "@material-ui/core/Slider";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Alert from '@material-ui/lab/Alert';
import TableContainer from '@material-ui/core/TableContainer';
import FilterListIcon from '@material-ui/icons/FilterList';
import ListIcon from '@material-ui/icons/List';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import AllInclusiveIcon from '@material-ui/icons/AllInclusive';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Checkbox from '@material-ui/core/Checkbox';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import InputLabel from "@material-ui/core/InputLabel";
import ShowChartIcon from '@material-ui/icons/ShowChart';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ArtTrackIcon from '@material-ui/icons/ArtTrack';
import { Grid, makeStyles } from "@material-ui/core";
import Pagination from "@material-ui/lab/Pagination";
import getGenes from "./CronicStats.js";
import extjs from "../ic/extjs.js";
import getNri from "../ic/nftv.js";
import { useTheme } from "@material-ui/core/styles";
import NFT from "./NFT";
import BuyForm from "./BuyForm";
import { useParams } from "react-router";
import { useNavigate } from "react-router";
import collections from '../ic/collections.js';
import ViewModuleIcon from '@material-ui/icons/ViewModule';
import ViewComfyIcon from '@material-ui/icons/ViewComfy';
import PriceICP from './PriceICP';
import CollectionDetails from './CollectionDetails';
import { EntrepotUpdateStats, EntrepotAllStats, EntrepotCollectionStats } from '../utils';
const api = extjs.connect("https://boundary.ic0.app/");
const perPage = 60;
const drawerWidth = 0;//300;

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
const useDidMountEffect = (func, deps) => {
    const didMount = React.useRef(false);

    useEffect(() => {
        if (didMount.current) func();
        else didMount.current = true;
    }, deps);
}

const _showListingPrice = (n) => {
  n = Number(n) / 100000000;
  return n.toFixed(8).replace(/0{1,6}$/, "");
};

const emptyListing = {
  pricing: "",
  img: "",
};
var _ss, canUpdateListings = true;
export default function Listings(props) {
  const params = useParams();
  const classes = useStyles();
  const [stats, setStats] = React.useState(false);
  const [listings, setListings] = useState(false);
  const [displayListings, setDisplayListings] = useState(false);
  if (!_ss){
    _ss = localStorage.getItem("_searchSettings"+collections.find(e => e.route === params?.route).canister);
    if (_ss) {
      _ss = JSON.parse(_ss);
      console.log("TEST");
    } else {
      _ss = {
        sort : "price_asc",
        selectedFilters : [],
        showing : "all",
        page : 1,
        minPrice : "",
        maxPrice : "",
      };
    };
  }
  const [minPrice, setMinPrice] = useState(_ss.minPrice ?? "");
  const [maxPrice, setMaxPrice] = useState(_ss.maxPrice ?? "");
  const [page, setPage] = useState(_ss.page);
  const [sort, setSort] = useState(_ss.sort);
  const [showing, setShowing] = useState(_ss.showing);
  const [selectedFilters, setSelectedFilters] = useState(_ss.selectedFilters);
  const [toggleFilter, setToggleFilter] = useState(true);
  const [openFilters, setOpenFilters] = useState([]);
  const [filterData, setFilterData] = useState(false);
  const [collapseOpen, setCollapseOpen] = useState(false);
  
  const [gridSize, setGridSize] = React.useState(localStorage.getItem("_gridSize") ?? "small");
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
  // btc flower filtering
  const [backgroundFilter, setBackgroundFilter] = React.useState("all");
  const [flowerFilter, setFlowerFilter] = React.useState("all");
  const [coinFilter, setCoinFilter] = React.useState("all");
  const [graveTextureFilter, setGraveTextureFilter] = React.useState("all");
  const [graveSymbolFilter, setGraveSymbolFilter] = React.useState("all");
  const [pairingsFilter, setPairingsFilter] = React.useState("all");
  const [fixedFilters, setFixedFilters] = React.useState(false);

  const [wearableFilter, setWearableFilter] = useState("all");
  //const [collection, setCollection] = useState('nbg4r-saaaa-aaaah-qap7a-cai');
  const [collection, setCollection] = useState(collections.find(e => e.route === params?.route));
  const navigate = useNavigate();

  const changeWearableFilter = async (event) => {
    setPage(1);
    setWearableFilter(event.target.value);
  };
  const changeFlowerFilter= async (event) => {
    setPage(1);
    setFlowerFilter(event.target.value);
  };
  const changeBackgroundFilter= async (event) => {
    setPage(1);
    setBackgroundFilter(event.target.value);
  };
  const changeGraveTextureFilter= async (event) => {
    setPage(1);
    setGraveTextureFilter(event.target.value);
  };
  const changeGraveSymbolFilter = async (event) => {
    setPage(1);
    setGraveSymbolFilter(event.target.value);
  };
  const changeCoinFilter= async (event) => {
    setPage(1);
    setCoinFilter(event.target.value);
  };
  const changePairingsFilter= async (event) => {
    setPage(1);
    setPairingsFilter(event.target.value);
  };
  const changeSort = (event) => {
    setPage(1);
    setSort(event.target.value);
  };
  const changeShowing = (event) => {
    setPage(1);
    setShowing(event.target.value);
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
    updateListings(applyAdvancedFilters(listings));
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

  
  const loadFilterData = () => {
    if (collection?.filter){
      fetch('/filter/'+collection?.canister+'.json')
      .then((response) => response.json())
      .then(r => setFilterData(r))
      .catch((error) => {
       console.error(error);
      });
    }
  };
  const isOpenFilter = traitId => {
    return openFilters.indexOf(traitId) >= 0;
  };
  const handleToggleFilter = traitId => {
    if (isOpenFilter(traitId)) {
      setOpenFilters(openFilters.filter(b => traitId != b));
    } else {
      setOpenFilters(openFilters.concat([traitId]));
    };
  };
  const filterGetCount = (traitId, traitValueId) => {
    return filterData[1].filter(a => a[1].find(b => b[0] == traitId && b[1] == traitValueId)).length;
  };
  const isFilterValueSelected = (traitId, traitValueId) => {
    return (selectedFilters.find(a => a[0] == traitId && a[1] == traitValueId) ? true : false);
  };
  const handleToggleFilterTrait = (traitId, traitValueId) => {
    if (isFilterValueSelected(traitId, traitValueId)) {
      setSelectedFilters(selectedFilters.filter(b => !(b[0] == traitId && b[1] == traitValueId)));
    } else {
      setSelectedFilters(selectedFilters.concat([[traitId, traitValueId]]));
    };
  };
  const showSelectedFilters = () => {
    if (!filterData) return [];
    return selectedFilters.map(a => [filterData[0].find(b => a[0] == b[0]).map((c,i) => {
      if (i == 0) return [""];
      if (i == 1) return [c+":"];
      else return [c.find(d => a[1] == d[0])[1]];
    }).join(''), a]);
  };
  //[0,[[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],[9,0]]]

  const filterListings = (_listings, sf) => {
    var _selectedFilters = sf ?? selectedFilters;
    if(!_selectedFilters.length) return _listings;
    var alteredFilters = {};
    _selectedFilters.forEach(a => {
      if(!alteredFilters.hasOwnProperty(a[0])) alteredFilters[a[0]] = [];
      alteredFilters[a[0]].push(a[1]);
    });
    var ft = filterData[1].filter(a => {
      for(const b in alteredFilters){
        if(!alteredFilters.hasOwnProperty(b)) continue;
        var fnd = a[1].find(c => c[0] == b);
        if (fnd) {
          if (alteredFilters[b].indexOf(fnd[1]) < 0) return false;
        };
      };
      return true;
    }).map(a => a[0]);
    return _listings.filter(a => ft.indexOf(a[0]) >= 0);
  };
  
  const applyFilters = (a, c) => {
    if (
      c === "tde7l-3qaaa-aaaah-qansa-cai" &&
      wearableFilter !== "all"
    ) {
      var map = ["accessories", "hats", "eyewear", "pets"];
      a = a.filter(
        (_a) => map[_a[2].nonfungible.metadata[0][0]] === wearableFilter
      );
    } else if (
      c === "e3izy-jiaaa-aaaah-qacbq-cai"
    ) {
      a = applyAdvancedFilters(a);
    }
    return a;
  };
  const _updates = async () => {
    await refresh();
  };
  const _isCanister = c => {
    return c.length == 27 && c.split("-").length == 5;
  };
  
  const refresh = async (s, c) => {
    c = c ?? collection?.canister;
    if (!_isCanister(c)) return updateListings([]);
    if (!collection.market) return updateListings([]);
    EntrepotUpdateStats().then(() => {
      setStats(EntrepotCollectionStats(collection.canister))
    });  
    try{
      var listings = await api.token(c).listings();
      var l = applyFilters(listings, c);
      updateListings(l);
    } catch(e) {};
      
  };
  const updateListings = (l, s, so, sf) => {
    if (canUpdateListings){
      canUpdateListings = false;
      var _listings = l ?? listings;
      var _showing = s ?? showing;
      var _sort = s ?? sort;
      var _selectedFilters = sf ?? selectedFilters;
      if (!_listings) return;
      if (l) setListings(l);
      var _displayListings = _listings;
      if (minPrice){
        _displayListings = _displayListings.filter(a => {
          if (!a[1]) return false;
          return (Number(a[1].price)/100000000) >= Number(minPrice);
        });
      };
      if (maxPrice){
        _displayListings = _displayListings.filter(a => {
          if (!a[1]) return false;
          return (Number(a[1].price)/100000000) <= Number(maxPrice);
        });
      };
      _displayListings = _displayListings.filter(a => {
        switch(_showing){
          case "all":
            return true;
            break;
          case "listed":
            return a[1];
            break;
        };
      });
      _displayListings = filterListings(_displayListings, _selectedFilters);
      _displayListings = _displayListings.sort((a, b) => {
        switch (_sort) {
          case "price_asc":
            if (!a[1]) return 1;
            if (!b[1]) return -1;
            return Number(a[1].price) - Number(b[1].price);
          case "price_desc":
            if (!a[1]) return 1;
            if (!b[1]) return -1;
            return Number(b[1].price) - Number(a[1].price);
          case "gri":
            return (
              Number(getNri(collection?.canister, b[0])) * 100 -
              Number(getNri(collection?.canister, a[0])) * 100
            );
          case "recent":
            if (!a[1]) return 1;
            if (!b[1]) return -1;
            return 1;
          case "oldest":
            if (!a[1]) return 1;
            if (!b[1]) return -1;
            return -1;
          case "mint_number":
            return a[0] - b[0];
          case "type":
            if (collection?.canister === "poyn6-dyaaa-aaaah-qcfzq-cai") {
              if (a[2].nonfungible.metadata[0][0] === 0 && b[2].nonfungible.metadata[0][0] === 0) return 0;
              else if (a[2].nonfungible.metadata[0][0] === 0) return 1;
              else if (b[2].nonfungible.metadata[0][0] === 0) return -1;
              else if (a[2].nonfungible.metadata[0][1] === b[2].nonfungible.metadata[0][1]) return a[2].nonfungible.metadata[0][0] - b[2].nonfungible.metadata[0][0];
              return b[2].nonfungible.metadata[0][1] - a[2].nonfungible.metadata[0][1];
            } 
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
      setDisplayListings(_displayListings);
      canUpdateListings = true;
    }
  };
  const theme = useTheme();
  const styles = {
    empty: {
      maxWidth: 1200,
      margin: "0 auto",
      textAlign: "center",
    },
    details: {
      textAlign: "center",
      paddingBottom:50,
      marginBottom:50,
    },
    grid: {
      flexGrow: 1,
      padding: theme.spacing(2),
    },
  };
  const changeGrid = (e, a) => {
    localStorage.setItem("_gridSize", a);
    setGridSize(a)
  }
  const minPriceChange = ev => {
    setMinPrice(Number(ev.target.value));
  };
  const maxPriceChange = ev => {
    setMaxPrice(Number(ev.target.value));
  };
  
  useDidMountEffect(() => {
    console.log("saving");
    localStorage.setItem("_searchSettings"+collection.canister, JSON.stringify({
      sort : sort,
      selectedFilters : selectedFilters,
      showing : showing,
      page : page,
      minPrice : minPrice,
      maxPrice : maxPrice,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort, selectedFilters, showing, page, minPrice, maxPrice]);
  useDidMountEffect(() => {
    setDisplayListings(false);
    setTimeout(updateListings, 300);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort]);
  useDidMountEffect(() => {
    setPage(1);
    setDisplayListings(false);
    setTimeout(updateListings, 300);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFilters, showing, minPrice, maxPrice]);
  useInterval(_updates, 10 * 1000);
  useDidMountEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wearableFilter]);
  React.useEffect(() => {
    if (EntrepotAllStats().length) setStats(EntrepotCollectionStats(collection.canister));
    _updates();
    loadFilterData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  

  return (//maxWidth:1200, margin:"0 auto",
    <div style={{ minHeight:"calc(100vh - 221px)", marginBottom:-75}}>
      {/*<Drawer classes={{paper: classes.drawerPaper}} variant="permanent" open>
      </Drawer>*/}
      <div style={{}}>
        <div style={{maxWidth:1200, margin:"0 auto 0",}}>
          <div style={{textAlign:"center"}}>
            <CollectionDetails classes={classes} stats={stats} collection={collection} />
            <Tabs
              value={"all"}
              indicatorColor="primary"
              textColor="primary"
              centered
              onChange={(e, nv) => {
                if (nv === "sold") navigate(`/marketplace/${collection?.route}/activity`)
              }}
            >
              <Tab style={{fontWeight:"bold"}} value="all" label={(<span style={{padding:"0 50px"}}><ArtTrackIcon style={{position:"absolute",marginLeft:"-30px"}} /><span style={{}}>Items</span></span>)} />
              <Tab style={{fontWeight:"bold"}} value="sold" label={(<span style={{padding:"0 50px"}}><ShowChartIcon style={{position:"absolute",marginLeft:"-30px"}} /><span style={{}}>Activity</span></span>)} />
            </Tabs>
          </div>
        </div>
        {_isCanister(collection.canister) && collection.market ?
        <div id="mainListings" style={{position:"relative",marginLeft:-24, marginRight:-24, marginBottom:-24,borderTop:"1px solid #aaa",borderBottom:"1px solid #aaa",display:"flex"}}>
          <div style={{position:"sticky",top:72, width:(toggleFilter ? 330 : 60),height:"calc(100vh - 72px)", borderRight:"1px solid #aaa",overflowY:(toggleFilter ? "scroll" : "hidden"),overflowX:"hidden",paddingBottom:50}}>
            <List>
              <ListItem style={{paddingRight:0}} button onClick={() => setToggleFilter(!toggleFilter)}>
                <ListItemIcon style={{minWidth:40}}>
                  <FilterListIcon />
                </ListItemIcon>
                <ListItemText
                  primaryTypographyProps={{noWrap:true}} 
                  secondaryTypographyProps={{noWrap:true}} 
                  primary={(<strong>Filter</strong>)}
                />
                  <ListItemIcon>
                  {toggleFilter ? <ChevronLeftIcon fontSize={"large"} /> :  <ChevronRightIcon fontSize={"large"} /> }
                  </ListItemIcon>
              </ListItem>
              {toggleFilter ? <>
                <ListItem style={{paddingRight:0}} button onClick={() => handleToggleFilter("_price")}>
                  <ListItemIcon style={{minWidth:40}}>
                    <AllInclusiveIcon />
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{noWrap:true}} 
                    secondaryTypographyProps={{noWrap:true}} 
                    primary={(<strong>Price</strong>)}
                  />
                    <ListItemIcon>
                      {isOpenFilter("_price") ?  <ExpandLessIcon fontSize={"large"} /> : <ExpandMoreIcon fontSize={"large"} /> }
                    </ListItemIcon>
                </ListItem>
                {isOpenFilter("_price") ? 
                <ListItem>
                  <div style={{width:"100%"}}>
                    <TextField value={minPrice} onChange={minPriceChange} style={{width:"100%", marginBottom:20}} label="Min. Price" />
                    <TextField value={maxPrice} onChange={maxPriceChange} style={{width:"100%", marginBottom:20}} label="Max. Price" />
                  </div>
                </ListItem> : "" }
              {filterData && filterData[0].map(a => {
                return (<>
                  <ListItem style={{paddingRight:0}} key={a[0]} button onClick={() => handleToggleFilter(a[0])}>
                    <ListItemIcon style={{minWidth:40}}>
                      <ListIcon />
                    </ListItemIcon>
                    <ListItemText
                      primaryTypographyProps={{noWrap:true}} 
                      secondaryTypographyProps={{noWrap:true}} 
                      primary={(<strong>{a[1]}</strong>)}
                    />
                      <ListItemIcon>
                        {isOpenFilter(a[0]) ?  <ExpandLessIcon fontSize={"large"} /> : <ExpandMoreIcon fontSize={"large"} /> }
                      </ListItemIcon>
                  </ListItem>
                  {isOpenFilter(a[0]) ? 
                  <ListItem>
                    <div style={{width:"100%"}}>
                      {a[2].map(b => {
                        return (<>
                          <div key={a[0]+"_"+b[0]} style={{width:"100%"}}>
                            <FormControlLabel
                              control={<Checkbox checked={(selectedFilters.find(c => c[0] == a[0] && c[1] == b[0]) ? true : false)} onChange={() => {handleToggleFilterTrait(a[0], b[0])}}  />}
                              label={b[1]}
                            />
                            <Chip style={{float:"right"}} label={filterGetCount(a[0], b[0])} variant="outlined" />
                          </div>
                        </>)
                      })}
                    </div>
                  </ListItem> : "" }
                </>)
              })}</> : ""}
            </List>
            {toggleFilter ?
            <div>
              {["e3izy-jiaaa-aaaah-qacbq-cai"].indexOf(collection?.canister) >= 0 ? (
                  <div style={{ marginTop: "20px" }}>
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
                  </div>
                ) : (
                  ""
                )}
              
              {["tde7l-3qaaa-aaaah-qansa-cai"].indexOf(collection?.canister) >= 0 ? (
                <FormControl style={{ marginRight : 20, minWidth: 120 }}>
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

            </div> : "" }
          </div>
          <div style={{flexGrow:1, padding:"10px 16px 50px 16px"}}>
            <div style={{}}>
              <div className={classes.filters} style={{}}>
                <Grid container style={{height:66}}>
                  <Grid item>
                    <ToggleButton onChange={async () => {
                      setDisplayListings(false);
                      await refresh();
                      setTimeout(updateListings, 300);
                    }} size="small" style={{marginTop:5, marginRight:10}}>
                      <CachedIcon />
                    </ToggleButton>
                  </Grid>
                  <Grid item>
                    <ToggleButtonGroup style={{marginTop:5, marginRight:20}} size="small" value={gridSize} exclusive onChange={changeGrid}>
                      <ToggleButton value={"small"}>
                        <ViewModuleIcon />
                      </ToggleButton>
                      <ToggleButton value={"large"}>
                        <ViewComfyIcon />
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </Grid>
                  <Grid item>
                    <FormControl style={{ marginRight: 20 }}>
                      <InputLabel>Showing</InputLabel>
                      <Select value={showing} onChange={changeShowing}>
                        <MenuItem value={"all"}>Entire Collection</MenuItem>
                        <MenuItem value={"listed"}>Listed Only</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item>
                    <FormControl style={{ marginRight: 20 }}>
                      <InputLabel>Sort by</InputLabel>
                      <Select value={sort} onChange={changeSort}>
                        <MenuItem value={"price_asc"}>Price: Low to High</MenuItem>
                        <MenuItem value={"price_desc"}>Price: High to Low</MenuItem>
                        <MenuItem value={"mint_number"}>Minting #</MenuItem>
                        {collection?.nftv ? (
                          <MenuItem value={"gri"}>NFT Rarity Index</MenuItem>
                        ) : (
                          ""
                        )}
                      </Select>
                    </FormControl>
                  </Grid>
                  {displayListings && displayListings.length > perPage ? (
                    <Grid item style={{marginLeft:"auto"}}>
                      <Pagination
                        className={classes.pagi}
                        size="small"
                        count={Math.ceil(displayListings.length / perPage)}
                        page={page}
                        onChange={(e, v) => setPage(v)}
                      />
                    </Grid>
                  ) : ""}
                </Grid>
              </div>
              <div style={{minHeight:500}}>
                <div style={{}}>
                {displayListings === false ? 
                  <>
                    <Typography
                      paragraph
                      style={{ fontWeight: "bold" }}
                      align="left"
                    >
                      Loading...
                    </Typography>
                  </>
                :
                  <>
                    {displayListings.length === 0 ? (
                      <Typography
                        paragraph
                        style={{ fontWeight: "bold" }}
                        align="left"
                      >
                        We found no results
                      </Typography>
                    ) : (
                      <Typography
                        paragraph
                        style={{fontWeight: "bold" }}
                        align="left"
                      >
                      {displayListings.length} items
                      </Typography>
                    )}
                  </>
                }
                </div>
                {selectedFilters.length > 0 || minPrice || maxPrice ?
                <div>
                  <Typography
                    paragraph
                    style={{  fontWeight: "bold" }}
                    align="left"
                  >
                    {minPrice ? <Chip style={{marginRight:10,marginBottom:10}} label={"Min. Price:"+minPrice} onDelete={() => setMinPrice("")} color="primary" /> :""}
                    {maxPrice ? <Chip style={{marginRight:10,marginBottom:10}} label={"Max. Price:"+maxPrice} onDelete={() => setMaxPrice("")} color="primary" /> :""}
                    {selectedFilters.length > 0 ?
                      <>
                        {showSelectedFilters().map((a, i) => {
                          return (
                            <Chip key={a[1][0]+"_"+a[1][1]} style={{marginRight:10,marginBottom:10}} label={a[0]} onDelete={() => handleToggleFilterTrait(a[1][0],a[1][1])} color="primary" />
                          );
                        })}
                      </> : ""
                    }
                    <Chip style={{marginRight:10,marginBottom:10}} label={"Reset"} onClick={() => {
                      setSelectedFilters([]);
                      setMinPrice("");
                      setMaxPrice("");
                    }} color="default" />
                  </Typography>
                </div> : "" }
                {displayListings ?
                <div>
                  <Grid
                    container
                    spacing={2}
                    direction="row"
                    alignItems="stretch"
                    style={{
                      display: "grid",
                      gridTemplateColumns: (gridSize === "small" ? "repeat(auto-fill, 300px)" : "repeat(auto-fill, 200px)"),
                      justifyContent: "space-between",
                    }}
                  >
                    {displayListings
                    .filter(
                      (token, i) =>
                        i >= (page - 1) * perPage && i < page * perPage
                    )
                    .map((listing, i) => {
                      return (
                        <NFT
                          gridSize={gridSize}
                          loggedIn={props.loggedIn}
                          tokenid={extjs.encodeTokenId(collection?.canister, listing[0])}
                          key={extjs.encodeTokenId(collection?.canister, listing[0])}
                          floor={stats.floor}
                          buy={props.buyNft}
                          afterBuy={refresh}
                          
                          listing={listing[1]}
                          metadata={listing[2]}
                        />
                      );
                    })}
                  </Grid>
                </div> : "" }
                
                {displayListings && displayListings.length > perPage ? (
                  <Pagination
                    className={classes.pagi}
                    size="small"
                    count={Math.ceil(displayListings.length / perPage)}
                    page={page}
                    onChange={(e, v) => setPage(v)}
                  />
                ) : ""}
              </div>
            </div>
          </div>
        </div> : ""}
      </div>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  socials: {
    padding:0,
    listStyle: "none",
    "& li" : {
      display:"inline-block",
      margin:"0 10px",
    },
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    zIndex: 1
  },
  filters: {
    [theme.breakpoints.down("sm")]: {
      textAlign:"center",
    },
  },
  stats: {
    marginTop:-70,
    minHeight:81,
    [theme.breakpoints.down("xs")]: {
      marginTop:0,
    },
  },
  pagi: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "20px",
    float: "right",
    marginBottom: "20px",
    [theme.breakpoints.down("xs")]: {
      justifyContent: "center",
    },
  },
}));
