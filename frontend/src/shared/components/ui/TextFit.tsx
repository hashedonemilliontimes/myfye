import { css } from "@emotion/react";

const TextFit = ({
  children,
  maxFontSize,
}: {
  children: React.ReactNode;
  maxFontSize?: string;
}) => {
  return (
    <span
      className="text-fit"
      css={css`
        ${maxFontSize ? "--max-font-size: " + maxFontSize : ""};
        display: flex;
        container-type: inline-size;
        width: 100%;

        --captured-length: initial;
        --support-sentinel: var(--captured-length, 9999px);

        > [aria-hidden] {
          visibility: hidden;
        }

        > :not([aria-hidden]) {
          flex-grow: 1;
          container-type: inline-size;

          --captured-length: 100cqi;
          --available-space: var(--captured-length);

          > * {
            --support-sentinel: inherit;
            --captured-length: 100cqi;
            --ratio: tan(
              atan2(
                var(--available-space),
                var(--available-space) - var(--captured-length)
              )
            );
            --font-size: clamp(
              1em,
              1em * var(--ratio),
              var(--max-font-size) - var(--support-sentinel)
            );

            inline-size: var(--available-space);

            &:not(.text-fit) {
              display: block;
              font-size: var(--font-size);

              @container (inline-size > 0) {
                white-space: nowrap;
              }
            }
            &.text-fit {
              --captured-length2: var(--font-size);

              font-variation-settings: "opsz"
                tan(atan2(var(--captured-length2), 1px));
            }
          }
        }

        &:not(.text-fit *) {
          ${maxFontSize ? "--max-font-size: " + maxFontSize : ""};

          line-height: var(--line-height-tight);
        }

        @property --captured-length {
          syntax: "<length>";
          initial-value: 0;
          inherits: true;
        }

        @property --captured-length2 {
          syntax: "<length>";
          initial-value: 0;
          inherits: true;
        }
      `}
    >
      <span>
        <span>{children}</span>
      </span>

      <span aria-hidden="true">{children}</span>
    </span>
  );
};

export default TextFit;

// <script setup lang="ts">
// const props = defineProps<{
//   text: string
//   maxFontSize?: string
// }>();

// const maxfontsize = computed(() => {
//   return props.maxFontSize || '9rem';
// });
// </script>

// <style scoped>
// .text-fit {

//   --captured-length: initial;
//   --support-sentinel: var(--captured-length, 9999px);

//   & > [aria-hidden] {
//     visibility: hidden;
//   }

//   & > :not([aria-hidden]) {
//     flex-grow: 1;
//     container-type: inline-size;

//     --captured-length: 100cqi;
//     --available-space: var(--captured-length);

//     & > * {
//       --support-sentinel: inherit;
//       --captured-length: 100cqi;
//       --ratio:
//         tan(
//           atan2(
//             var(--available-space),
//             var(--available-space) - var(--captured-length)
//           )
//         );
//       --font-size:
//         clamp(
//           1em,
//           1em * var(--ratio),
//           var(--max-font-size)
//           -
//           var(--support-sentinel)
//         );

//       inline-size: var(--available-space);

//       &:not(.text-fit) {
//         display: block;
//         font-size: var(--font-size);

//         /* stylelint-disable-next-line */
//         @container (inline-size > 0) {
//           white-space: nowrap;
//         }
//       }

//       &.text-fit {
//         --captured-length2: var(--font-size);

//         font-variation-settings:
//           "opsz"
//           tan(
//             atan2(var(--captured-length2), 1px)
//           );
//       }
//     }
//   }
// }

// .text-fit:not(.text-fit *) {
//   --max-font-size: v-bind(maxfontsize);

//   margin: 0.25em 0;
//   line-height: 0.95;
// }

// @property --captured-length {
//   syntax: "<length>";
//   initial-value: 0;
//   inherits: true;
// }

// @property --captured-length2 {
//   syntax: "<length>";
//   initial-value: 0;
//   inherits: true;
// }
// </style>
