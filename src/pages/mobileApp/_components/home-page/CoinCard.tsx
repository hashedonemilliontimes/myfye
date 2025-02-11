/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import CoinIcon from "./CoinIcon";

const CoinCard = ({ title, type, currency, balance }) => {
  return (
    <li className="coin-card-wrapper">
      <div className="coin-card">
        <CoinIcon type={type} />
        <div className="title">
          <p>{title}</p>
          <p>{balance}</p>
        </div>
        <p>{currency}</p>
      </div>
    </li>
  );
};

export default CoinCard;
