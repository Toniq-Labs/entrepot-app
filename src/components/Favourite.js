import React, { useState } from "react";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { EntrepotIsLiked, EntrepotLike, EntrepotUnike, EntrepotGetLikes, EntrepotUpdateLiked } from '../utils';
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
var skipRefresh = false;
export default function Favourite(props) {
  const [liked, setLiked] = React.useState(EntrepotIsLiked(props.tokenid));
  const [count, setCount] = React.useState(false);
  const fontSize = (props?.size == "large" ? 20 : 12);
  const iconSize = (props?.size == "large" ? { width:24,height:24 } : { width:22,height:22});
  const _refresh = async () => {
    if (skipRefresh) return;
    if (props.showcount){
      EntrepotGetLikes(props.tokenid).then(r => setCount(r));
    }
    setLiked(EntrepotIsLiked(props.tokenid));
  };
  useInterval(_refresh, 2 * 60 * 1000);
  const like = async () => {
    if (!props.loggedIn) return;
    skipRefresh = true;
    if (liked) {
      setCount(count - 1);
      setLiked(false);
      await EntrepotUnike(props.tokenid);
    } else {
      setCount(count + 1);
      setLiked(true);
      await EntrepotLike(props.tokenid);
    };
    var c = await EntrepotGetLikes(props.tokenid, true);
    setCount(c);
    skipRefresh = false;
  };
  React.useEffect(() => {
    _refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (<>
    <FormControlLabel
      labelPlacement={"start"}
      onMouseDown={ev => {
        ev.stopPropagation();
      }}
      onClick={ev => {
        ev.stopPropagation();
      }}
      control={<Checkbox onChange={ev => {
        ev.stopPropagation();
        like();
      }} checked={liked} icon={<FavoriteBorderIcon style={iconSize} />} checkedIcon={<FavoriteIcon style={iconSize}/>} />}
      label={props.showcount ? (count ? <span style={{fontSize:fontSize, color:"#00d092 "}}>{count >= 1000 ? (count/1000).toFixed(1)+"k" : count}</span> : "") : ""}
    />
  </>);
};