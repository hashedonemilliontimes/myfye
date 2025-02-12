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
import BalanceTitle from "../BalanceTitle";

const DashboardPanel = () => {
  return (
    <div className="dashboard-panel">
      <BalanceTitle balance={3218} />
      <menu
        className="no-scrollbar"
        css={css`
          display: flex;
          align-items: center;
          justify-content: flex-start;
          gap: var(--controls-gap-small);
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
