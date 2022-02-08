import React, { useState } from "react";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
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
  const fontSize = (props?.size == "large" ? 24 : 12);
  const iconSize = (props?.size == "large" ? { width:30,height:30 } : { width:22,height:22});
  const _refresh = async () => {
    if (skipRefresh) return;
    if (props.showcount){
      EntrepotGetLikes(props.tokenid).then(r => setCount(r));
    }
    setLiked(EntrepotIsLiked(props.tokenid));
  };
  useInterval(_refresh, 10 * 1000);
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
    await EntrepotGetLikes(props.tokenid, true).then(r => setCount(r));
    setLiked(EntrepotIsLiked(props.tokenid));
    skipRefresh = false;
  };
  React.useEffect(() => {
    _refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (<>
    {props.showcount ?<Typography variant="h6" style={{ marginRight:10, fontSize:fontSize,color: (liked ? "#00d092" : "#8B9AAA") }}>
      {count ? <>{count >= 1000 ? (count/1000).toFixed(1)+"k" : count}</> : ""}
    </Typography> : "" }
    <IconButton 
      onMouseDown={ev => {
        ev.stopPropagation();
      }}
      onClick={ev => {
        ev.stopPropagation();
        like();
      }}
      style={{padding:0}}
      size={(props?.size == "large" ? "large" : "small")}>
      { liked ? <FavoriteIcon style={iconSize} /> : <FavoriteBorderIcon style={{ ...iconSize, color: "#8B9AAA" }} /> }
    </IconButton>
  </>);
};