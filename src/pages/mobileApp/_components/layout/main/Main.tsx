/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

const Main = ({ children }) => {
  return (
    <main
      css={css`
        overflow-y: auto;
      `}
    >
      {children}
    </main>
  );
};

export default Main;
