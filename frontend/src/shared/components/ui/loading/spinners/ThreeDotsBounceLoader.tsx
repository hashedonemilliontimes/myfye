import { Interpolation } from "@emotion/react";
import { Theme } from "@nivo/core";
import { SVGProps } from "react";

const ThreeDotsBounceLoader = ({
  width = 24,
  height = 24,
  dur = "0.6s",
  ...restProps
}: {
  width?: number | string;
  height?: number | string;
  dur?: string;
  restProps: SVGProps<SVGSVGElement> & {
    css?: Interpolation<Theme>;
  };
}) => (
  <svg
    {...restProps}
    width={width}
    height={height}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="4" cy="12" r="3">
      <animate
        id="spinner_qFRN"
        begin="0;spinner_OcgL.end+0.25s"
        attributeName="cy"
        calcMode="spline"
        dur={dur}
        values="12;6;12"
        keySplines=".33,.66,.66,1;.33,0,.66,.33"
      />
    </circle>
    <circle cx="12" cy="12" r="3">
      <animate
        begin="spinner_qFRN.begin+0.1s"
        attributeName="cy"
        calcMode="spline"
        dur={dur}
        values="12;6;12"
        keySplines=".33,.66,.66,1;.33,0,.66,.33"
      />
    </circle>
    <circle cx="20" cy="12" r="3">
      <animate
        id="spinner_OcgL"
        begin="spinner_qFRN.begin+0.2s"
        attributeName="cy"
        calcMode="spline"
        dur={dur}
        values="12;6;12"
        keySplines=".33,.66,.66,1;.33,0,.66,.33"
      />
    </circle>
  </svg>
);
export default ThreeDotsBounceLoader;
