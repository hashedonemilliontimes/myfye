import Tabs from "./Tabs";

/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

const HomePage = () => {
  return (
    <div
      className="home"
      css={css`
        container: home / size;
        height: 100%;
      `}
    >
      <Tabs></Tabs>
    </div>
  );
};

export default HomePage;
