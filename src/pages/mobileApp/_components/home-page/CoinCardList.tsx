import CoinCard from "./CoinCard";

/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

const CoinCardList = ({ coins }) => {
  return (
    <ul
      css={css`
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        gap: var(--size-300);
      `}
    >
      {coins.map((coin) => (
        <li
          className="coin-card-wrapper"
          css={css`
            display: block;
            width: 100%;
          `}
        >
          <CoinCard
            title={coin.title}
            type={coin.type}
            currency={coin.currency}
            balance={coin.balance}
            src={coin.img}
          />
        </li>
      ))}
    </ul>
  );
};

export default CoinCardList;
