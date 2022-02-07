import React, { useState } from "react";
const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}
export default function PriceUSD(props) {
  return (<>${numberWithCommas(props.price)}</>);
};