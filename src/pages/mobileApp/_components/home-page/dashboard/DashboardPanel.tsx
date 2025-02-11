import Button from "@/components/ui/button/Button";
import {
  ArrowCircleDown as ArrowCircleDownIcon,
  ArrowCircleUp as ArrowCircleUpIcon,
  ArrowLineDown as ArrowLineDownIcon,
  ArrowLineUp as ArrowLineUpIcon,
} from "@phosphor-icons/react";

/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import PieChart from "./PieChart";

const DashboardPanel = () => {
  return (
    <div className="dashboard-panel">
      <hgroup
        css={css`
          text-align: start;
        `}
      >
        <h1
          css={css`
            font-size: var(--fs-small);
            color: var(--clr-text-neutral);
          `}
        >
          Total Balance
        </h1>
        <p
          className="heading-large"
          css={css`
            margin-block-start: var(--size-100);
          `}
        >
          $3212.34
        </p>
      </hgroup>
      <menu
        className="no-scrollbar"
        css={css`
          display: flex;
          align-items: center;
          justify-content: flex-start;
          gap: var(--controls-gap-small);
          margin-block-start: var(--size-300);
          width: 100%;
          overflow-x: auto;
        `}
      >
        <li>
          <Button size="small" icon={ArrowCircleUpIcon}>
            Send
          </Button>
        </li>
        <li>
          <Button size="small" icon={ArrowCircleDownIcon}>
            Receive
          </Button>
        </li>
        <li>
          <Button size="small" icon={ArrowLineDownIcon}>
            Deposit
          </Button>
        </li>
        <li>
          <Button size="small" icon={ArrowLineUpIcon}>
            Withdraw
          </Button>
        </li>
      </menu>
      <PieChart
        data={[
          { id: "hello", value: 200 },
          { id: "test", value: 300 },
        ]}
      ></PieChart>
    </div>
  );
};

export default DashboardPanel;
