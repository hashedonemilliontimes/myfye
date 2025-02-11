/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import CoinIcon from "./CoinIcon";

const CoinCard = ({ title, currency, balance, img }) => {
  return (
    <button
      className="coin-card"
      css={css`
        display: grid;
        grid-template-columns: auto 1fr;
        column-gap: var(--size-150);
        line-height: var(--line-height-tight);
        width: 100%;
      `}
    >
      <CoinIcon src={img} />
      <div
        className="content"
        css={css`
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          align-self: center;
        `}
      >
        <div
          className="title"
          css={css`
            display: flex;
            align-items: flex-start;
            justify-content: flex-start;
            flex-direction: column;
          `}
        >
          <p
            css={css`
              font-weight: var(--fw-active);
            `}
          >
            {title}
          </p>
          <p
            css={css`
              font-size: var(--fs-small);
              color: var(--clr-text-neutral);
              text-transform: uppercase;
              margin-block-start: var(--size-050);
            `}
          >
            {currency}
          </p>
        </div>
        <p
          css={css`
            font-weight: var(--fw-active);
          `}
        >
          {balance}
        </p>
      </div>
    </button>
  );
};

export default CoinCard;
