import React, { useState, useEffect, useRef } from "react";
import Checkbox from "@material-ui/core/Checkbox";
import { EntrepotIsLiked, EntrepotLike, EntrepotUnike, EntrepotGetLikes } from '../utils';
import { HeartFill24Icon, HeartOutline24Icon } from "@toniq-labs/design-system";
import { ToniqIcon } from "@toniq-labs/design-system/dist/esm/elements/react-components";

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
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
  const [liked, setLiked] = useState(EntrepotIsLiked(props.tokenid));
  const [count, setCount] = useState(false);

  const _refresh = async () => {
    if (skipRefresh) return;
    if (props.showcount) EntrepotGetLikes(props.tokenid).then(r => setCount(r));
    setLiked(EntrepotIsLiked(props.tokenid));
  };

  useInterval(_refresh, 10 * 1000);

  const like = async () => {
    if (!props.loggedIn) return;
    skipRefresh = true;
    if (liked) {
      setCount(count - 1);
      setLiked(false);
      EntrepotUnike(props.tokenid, props.identity);
    } else {
      setCount((count ? count + 1 : 1));
      setLiked(true);
      EntrepotLike(props.tokenid, props.identity);
    };
    if (props.refresher) props.refresher();
    var c = await EntrepotGetLikes(props.tokenid, true);
    setCount(c);
    skipRefresh = false;
  };

  useEffect(() => {
    _refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Checkbox
			onChange={(ev) => {
				ev.stopPropagation();
				like();
			}}
			checked={liked}
			icon={
				<ToniqIcon
					icon={HeartOutline24Icon}
					style={{ color: "#FFFFFF" }}
				/>
			}
			checkedIcon={
				<ToniqIcon icon={HeartFill24Icon} style={{ color: "#FFFFFF" }} />
			}
			style={{ margin: "0", filter: "drop-shadow(0px 0px 16px #000000)" }}
		/>
  );
};