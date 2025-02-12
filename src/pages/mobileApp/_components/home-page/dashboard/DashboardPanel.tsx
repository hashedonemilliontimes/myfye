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
import CTACarousel from "./cta-carousel/CTACarousel";

const DashboardPanel = () => {
  return (
    <div
      className="dashboard-panel"
      css={css`
        padding-bottom: var(--size-250);
      `}
    >
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
          padding: 0 var(--size-250);
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
      <div
        className="pie-chart-wrapper"
        css={css`
          height: 364px;
          margin-block-start: var(--size-200);
          padding: 0 var(--size-250);
        `}
      >
        <PieChart
          data={[
            {
              id: "Cash",
              label: "Cash",
              value: 321,
              color: "var(--clr-green-300)",
            },
            {
              id: "Crypto",
              label: "Crypto",
              value: 135,
              color: "var(--clr-green-400)",
            },
          ]}
        ></PieChart>
      </div>
      <CTACarousel
        slides={[
          {
            title: "Earn up to 4.6% APY with USDY",
            subtitle: "Invest with ONDO US Dollar Yield (USDY)",
            icon: "test",
          },
          { title: "Test", subtitle: "test", icon: "test" },
          { title: "Test", subtitle: "test", icon: "test" },
          { title: "Test", subtitle: "test", icon: "test" },
        ]}
      ></CTACarousel>
    </div>
  );
};

export default DashboardPanel;
