import React, { useState } from "react";
const numberWithCommas = (x) => {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}
export default function PriceUSD(props) {
  return (<>${numberWithCommas(props.price)}</>);
};