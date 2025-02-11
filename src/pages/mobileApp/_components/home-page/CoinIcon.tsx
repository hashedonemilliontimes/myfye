/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useMemo } from "react";

const CoinIcon = ({ type }) => {
  return (
    <div
      className="aspect-ratio-square"
      css={css`
        border-radius: var(--border-radius-circle);
        background-color: red;
      `}
    ></div>
  );
};

export default CoinIcon;
