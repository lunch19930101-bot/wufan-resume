/* ============================================================
 * 站内图标库 —— 两套语言，一套 API
 *
 * 1. TD*  —— TDesign 官方线性/面性图标（stroke 2 / square cap，
 *    path 提取自用户封装的 TDesign for web 图标库，viewBox 24）
 * 2. Brand* —— 品牌单色标（simple-icons / 官方资产提取，
 *    fill currentColor，品牌色由调用方 text-[#hex] 给）
 *
 * 约定：只收 className；aria-hidden 由本库统一加上；
 *      尺寸用任意值 size-[Npx]（站内 spacing 1–12 已被重定义）
 * ============================================================ */

/** TDesign · calendar-1 */
export function TDCalendarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path stroke="currentColor" strokeLinecap="square" strokeWidth={2} d="M21 10V21H3V10M21 10H3M21 10V5H3V10M7 5V2M17 5V2" />
      <path stroke="currentColor" strokeLinecap="square" strokeWidth={2} d="M8 14H8.00391V14.0039H8V14Z" />
      <path stroke="currentColor" strokeLinecap="square" strokeWidth={2} d="M12 14H12.0039V14.0039H12V14Z" />
      <path stroke="currentColor" strokeLinecap="square" strokeWidth={2} d="M16 14H16.0039V14.0039H16V14Z" />
      <path stroke="currentColor" strokeLinecap="square" strokeWidth={2} d="M16 17H16.0039V17.0039H16V17Z" />
      <path stroke="currentColor" strokeLinecap="square" strokeWidth={2} d="M8 17H8.00391V17.0039H8V17Z" />
      <path stroke="currentColor" strokeLinecap="square" strokeWidth={2} d="M12 17H12.0039V17.0039H12V17Z" />
    </svg>
  );
}

/** TDesign · tag */
export function TDTagIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path stroke="currentColor" strokeWidth={2} d="M10.8788 21.6066L2.39355 13.1214L11.5149 4.01475L20.0002 4L20.0002 12.5L10.8788 21.6066Z" />
      <path stroke="currentColor" strokeWidth={2} d="M15.9966 7.99976H16.0005L16.0005 8.00366L15.9966 8.00366V7.99976Z" />
    </svg>
  );
}

/** TDesign · user-1 */
export function TDUserIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path stroke="currentColor" strokeLinecap="square" strokeWidth={2} d="M19.5 20V19C19.5 16.7909 17.7091 15 15.5 15H8.5C6.29086 15 4.5 16.7909 4.5 19V20M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" />
    </svg>
  );
}

/** TDesign · shop-1 */
export function TDShopIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path stroke="currentColor" strokeWidth={2} d="M9 3V6M9 3H3V6C3 7.65685 4.34315 9 6 9C7.65685 9 9 7.65685 9 6M9 3H15M9 6C9 7.65685 10.3431 9 12 9C13.6569 9 15 7.65685 15 6M15 3V6M15 3H21V6C21 7.65685 19.6569 9 18 9C16.3431 9 15 7.65685 15 6M9 14H15V21H9V14Z" />
      <path stroke="currentColor" strokeWidth={2} d="M21 3H3V21H21V3Z" />
    </svg>
  );
}

/** TDesign · star-filled */
export function TDStarFilledIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path fill="currentColor" d="M12.0012 0.63031L14.9039 8.98087L23.7427 9.16099L16.6978 14.502L19.2579 22.9639L12.0012 17.9143L4.74461 22.9639L7.30465 14.502L0.259766 9.16099L9.09859 8.98087L12.0012 0.63031Z" />
    </svg>
  );
}

/** TDesign · image-1 */
export function TDImageIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path stroke="currentColor" strokeWidth={2} d="M13.5 17L9 10L2 21H22L16 13L13.5 17Z" />
    </svg>
  );
}

/** TDesign · edit-1 */
export function TDEditIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path stroke="currentColor" strokeWidth={2} d="M12.9999 6.5L3 16.5L3 20.9999L7.4999 20.9999L17.4999 11M12.9999 6.5L17.4999 11M12.9999 6.5L16.9999 2.5L21.4999 7L17.4999 11" />
    </svg>
  );
}

/** TDesign · layers */
export function TDLayersIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path stroke="currentColor" strokeWidth={2} d="M4.5 6.125L12 3L19.5 6.125L12 9.25L4.5 6.125Z" />
      <path stroke="currentColor" strokeWidth={2} d="M3 11.5005L12 15.3771L21 11.5005M21 17.5005L12 21.3771L3 17.5005" />
    </svg>
  );
}

/** TDesign · link */
export function TDLinkIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path stroke="currentColor" strokeLinecap="square" strokeWidth={2} d="M11.6762 6.99023L13.9998 4.6666C15.4726 3.19382 17.8604 3.19382 19.3332 4.6666C20.806 6.13938 20.806 8.52723 19.3332 10L17.0096 12.3236M6.98974 11.6766L4.66611 14.0003C3.19333 15.4731 3.19333 17.8609 4.66611 19.3337C6.13889 20.8065 8.52675 20.8065 9.99953 19.3337L12.3232 17.0101M13.9985 9.99989L9.99847 14" />
    </svg>
  );
}

/** TDesign · mail */
export function TDMailIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path stroke="currentColor" strokeLinecap="square" strokeWidth={2} d="M2 4H22M2 4V20L22 20V4M2 4V7.44444L12 12.5L22 7.44444V4" />
    </svg>
  );
}

/** TDesign · flag-1 */
export function TDFlagIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path stroke="currentColor" strokeLinecap="square" strokeWidth={2} d="M4 3H11L13 5H20L18 10.5M4 3V14M4 3V8.5H11L13 10.5H18M4 14H11L13 16H20L18 10.5M4 14V21.5" />
    </svg>
  );
}

/** TDesign · location-1 */
export function TDLocationIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path stroke="currentColor" strokeLinecap="square" strokeWidth={2} d="M12 10C14.2091 10 16 8.20914 16 6C16 3.79086 14.2091 2 12 2C9.79086 2 8 3.79086 8 6C8 8.20914 9.79086 10 12 10ZM12 10V16" />
      <path stroke="currentColor" strokeLinecap="square" strokeWidth={2} d="M17 12H20L21 21H3L4 12H7" />
    </svg>
  );
}

/** TDesign · sunny */
export function TDSunnyIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path stroke="currentColor" strokeWidth={2} d="M17 12C17 14.7614 14.7614 17 12 17C9.23858 17 7 14.7614 7 12C7 9.23858 9.23858 7 12 7C14.7614 7 17 9.23858 17 12Z" />
      <path stroke="currentColor" strokeLinecap="square" strokeWidth={2} d="M12 21V22M12 2V3M3 12H2M22 12H21M5.63603 18.3635L4.92892 19.0706M19.0711 4.92848L18.364 5.63559M5.63601 5.63563L4.9289 4.92852M19.071 19.0707L18.3639 18.3636" />
    </svg>
  );
}

/** TDesign · cloudy-day */
export function TDPartlyIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path stroke="currentColor" strokeWidth={2} d="M14.7497 11.3333C14.7261 11.3333 14.7027 11.3335 14.6792 11.3339C14.3002 9.02865 12.4336 7.23758 10.1201 7.02183C10.5565 5.28554 12.128 4 13.9997 4C15.8827 4 17.4618 5.30116 17.887 7.05344C18.0859 7.01832 18.2906 7 18.4997 7C20.4326 7 21.9997 8.567 21.9997 10.5C21.9997 12.2632 20.1739 14 18.6739 14C18.0334 12.434 16.5176 11.3333 14.7497 11.3333Z" />
      <path stroke="currentColor" strokeWidth={2} d="M2 16.5333C2 18.4479 3.52223 20 5.4 20H14.75C17.0972 20 19 18.0599 19 15.6667C19 15.0761 18.8841 14.5131 18.6743 14C18.0338 12.434 16.518 11.3333 14.75 11.3333C14.7265 11.3333 14.703 11.3335 14.6796 11.3339C14.2752 8.87428 12.1772 7 9.65 7C6.83335 7 4.55 9.32812 4.55 12.2C4.55 12.5261 4.57944 12.8451 4.63575 13.1546C3.12599 13.5082 2 14.8867 2 16.5333Z" />
    </svg>
  );
}

/** TDesign · cloud */
export function TDCloudIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path stroke="currentColor" strokeWidth={2} d="M2 15C2 17.2091 3.79086 19 6 19H17C19.7614 19 22 16.7614 22 14C22 11.2386 19.7614 9 17 9C16.9723 9 16.9447 9.00023 16.9172 9.00067C16.4414 6.16263 13.9732 4 11 4C7.68629 4 5 6.68629 5 10C5 10.3762 5.03463 10.7444 5.10088 11.1015C3.3247 11.5094 2 13.1 2 15Z" />
    </svg>
  );
}

/** TDesign · fog */
export function TDFogIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path stroke="currentColor" strokeLinecap="square" strokeWidth={2} d="M21 13C21 11.3939 20.0926 9.65847 18.7445 8.90998C18.0838 8.54318 17.3174 8.33333 16.5 8.33333C16.4751 8.33333 16.4502 8.33353 16.4254 8.33392C16.0716 6.30141 14.4933 4.66861 12.4459 4.16281C12.0157 4.05652 11.5647 4 11.1 4C8.11766 4 5.7 6.32812 5.7 9.2C5.7 9.52608 5.73117 9.84515 5.79079 10.1546C4.25293 10.1546 3 11.5 3 13" />
      <path stroke="currentColor" strokeLinecap="square" strokeWidth={2} d="M3 16H7M3 20L14 20M11 16H21M18 20H21" />
    </svg>
  );
}

/** TDesign · rain-light */
export function TDRainIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path stroke="currentColor" strokeLinecap="square" strokeWidth={2} d="M5 16.6397C3.81463 16.0724 3 14.8945 3 13.5333C3 11.8867 4.19223 10.5082 5.79079 10.1546C5.73117 9.84515 5.7 9.52608 5.7 9.2C5.7 6.35308 8.07582 4.04051 11.0224 4.00053C11.0482 4.00018 11.0741 4 11.1 4C11.5647 4 12.0157 4.05652 12.4459 4.16281C14.4933 4.66861 16.0716 6.30141 16.4254 8.33392C16.4502 8.33353 16.4751 8.33333 16.5 8.33333C17.3174 8.33333 18.0838 8.54318 18.7445 8.90998C18.9285 9.01218 19.1044 9.12656 19.2708 9.25199C20.3235 10.0451 21 11.2798 21 12.6667C21 14.4438 19.8891 15.9711 18.2995 16.6397" />
      <path stroke="currentColor" strokeLinecap="square" strokeWidth={2} d="M7.99805 13.998H8.00195V14.002H7.99805V13.998Z" />
      <path stroke="currentColor" strokeLinecap="square" strokeWidth={2} d="M11.998 11.998H12.002V12.002H11.998V11.998Z" />
      <path stroke="currentColor" strokeLinecap="square" strokeWidth={2} d="M15.998 13.998H16.002V14.002H15.998V13.998Z" />
      <path stroke="currentColor" strokeLinecap="square" strokeWidth={2} d="M15.998 17.998H16.002V18.002H15.998V17.998Z" />
      <path stroke="currentColor" strokeLinecap="square" strokeWidth={2} d="M11.998 15.998H12.002V16.002H11.998V15.998Z" />
      <path stroke="currentColor" strokeLinecap="square" strokeWidth={2} d="M11.998 19.998H12.002V20.002H11.998V19.998Z" />
      <path stroke="currentColor" strokeLinecap="square" strokeWidth={2} d="M7.99805 17.998H8.00195V18.002H7.99805V17.998Z" />
    </svg>
  );
}

/** TDesign · snowflake */
export function TDSnowIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path stroke="currentColor" strokeLinecap="square" strokeWidth={2} d="M12 2C12 4.42683 12 3.10524 12 5M12 22L12 19M14 3C14 3 12.9933 4.00665 12 5M12 5C11.0066 4.00665 10 3 10 3M12 5C12 5.95738 12 9.0264 12 12.0478M14 21L12 19M12 19L10 21M12 19C12 19 12 15.556 12 12.0478M21 14L19 12M19 12L21 10M19 12H22M19 12L12 12.0478M3 14L5 12M5 12L3 10M5 12L2 12M5 12L12 12.0478M16.9497 7.0503L12 12.0478M7.05025 16.9498L12 12.0478M12 12.0478L16.9497 16.9498M12 12.0478L7.05025 7.0503" />
    </svg>
  );
}

/** TDesign · thunderstorm */
export function TDStormIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path stroke="currentColor" strokeLinecap="square" strokeWidth={2} d="M5 16.6397C3.81463 16.0724 3 14.8945 3 13.5333C3 11.8867 4.19223 10.5082 5.79079 10.1546C5.73117 9.84515 5.7 9.52608 5.7 9.2C5.7 6.35308 8.07582 4.04051 11.0224 4.00053C11.0482 4.00018 11.0741 4 11.1 4C11.5647 4 12.0157 4.05652 12.4459 4.16281C14.4933 4.66861 16.0716 6.30141 16.4254 8.33392C16.4502 8.33353 16.4751 8.33333 16.5 8.33333C17.3174 8.33333 18.0838 8.54318 18.7445 8.90998C18.9285 9.01218 19.1044 9.12656 19.2708 9.25199C20.3235 10.0451 21 11.2798 21 12.6667C21 14.4438 19.8891 15.9711 18.2995 16.6397" />
      <path stroke="currentColor" strokeLinecap="square" strokeWidth={2} d="M11.4997 19L14.022 15H10.0215L12.4997 11M15.998 18.998H16.002V19.002H15.998V18.998ZM7.99805 18.998H8.00195V19.002H7.99805V18.998Z" />
    </svg>
  );
}

/** Brand · figma */
export function BrandFigmaIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path fill="currentColor" d="M15.852 8.981h-4.588V0h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.491-4.49 4.491zM12.735 7.51h3.117c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-3.117V7.51zm0 1.471H8.148c-2.476 0-4.49-2.014-4.49-4.49S5.672 0 8.148 0h4.588v8.981zm-4.587-7.51c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.02 3.019 3.02h3.117V1.471H8.148zm4.587 15.019H8.148c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v8.98zM8.148 8.981c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h3.117V8.981H8.148zM8.172 24c-2.489 0-4.515-2.014-4.515-4.49s2.014-4.49 4.49-4.49h4.588v4.441c0 2.503-2.047 4.539-4.563 4.539zm-.024-7.51a3.023 3.023 0 0 0-3.019 3.019c0 1.665 1.365 3.019 3.044 3.019 1.705 0 3.093-1.376 3.093-3.068v-2.97H8.148zm7.704 0h-.098c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h.098c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.49-4.49 4.49zm-.097-7.509c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h.098c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-.098z" />
    </svg>
  );
}

/** Brand · sketch */
export function BrandSketchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path fill="currentColor" d="M12 1.25l6.75 6.637V2L12 1.25zm0 0l-6.05 7h12.1l-6.05-7zm0 0L5.25 2v5.887L12 1.25zM5.25 2L0 9l4.416-.68L5.25 2zM0 9l11.959 13.703.008-.014L4.443 9H0zm18.75-7l.834 6.32L24 9l-5.25-7zM24 9h-4.506l-7.523 13.69.029.06L24 9zM12 22.75l-.031-.057-.008.012.039.045zM5.436 9l6.533 13.686L18.564 9H5.436Z" />
    </svg>
  );
}

/** Brand · cinema4d */
export function BrandCinemaIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path fill="currentColor" d="M12.052 0C5.394-.007-.003 5.412 0 11.976.003 18.654 5.475 23.981 11.978 24c6.535.02 12.057-5.306 12.022-11.998-.009-1.665-.53-5.371-1.84-5.276-1.98.145-2.159 4.12-2.377 5.407-.417 2.46-1.346 5.08-2.953 6.99-1.88 2.359-4.697 3.634-7.662 3.158-3.55-.564-5.893-3.278-6.68-5.201-.753-1.723-1.035-4.162-.07-6.324 1.16-2.766 3.734-4.632 6.28-5.584 2.006-.827 4.103-1.151 5.357-1.375 2.516-.5 2.855-1.463 2.814-2.149-.015-.252-.256-.724-.785-.943C15.03.269 13.268.001 12.052 0zm5.098 1.342c.139.398.088.85-.148 1.256-.325.56-.972 1.05-1.897 1.29-1.636.428-2.976.554-4.34.96-1.312.39-3.397 1.018-5.316 2.552-.268.842-.341 1.892-.369 2.662.15 5.014 4.557 8.884 9.17 8.682.853-.037 1.921-.261 2.912-.68a13.56 13.56 0 0 0 1.387-2.683l.002-.002v-.002c.424-1.03.606-1.836.8-2.793.32-1.565.202-2.88 1.012-4.758.251-.582.71-1.113 1.258-1.346.25-.105.522-.133.79-.072-.89-2.471-3.115-4.326-5.26-5.066z" />
    </svg>
  );
}

/** Brand · claude */
export function BrandClaudeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path fill="currentColor" d="m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z" />
    </svg>
  );
}

/** Brand · googlegemini */
export function BrandGeminiIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path fill="currentColor" d="M11.04 19.32Q12 21.51 12 24q0-2.49.93-4.68.96-2.19 2.58-3.81t3.81-2.55Q21.51 12 24 12q-2.49 0-4.68-.93a12.3 12.3 0 0 1-3.81-2.58 12.3 12.3 0 0 1-2.58-3.81Q12 2.49 12 0q0 2.49-.96 4.68-.93 2.19-2.55 3.81a12.3 12.3 0 0 1-3.81 2.58Q2.49 12 0 12q2.49 0 4.68.96 2.19.93 3.81 2.55t2.55 3.81" />
    </svg>
  );
}

/** Brand · Midjourney（站点自有资产提取） */
export function BrandMidjourneyIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M22.369 17.676c-1.387 1.259-3.17 2.378-5.332 3.417.044.03.086.057.13.083l.018.01.019.012c.216.123.42.184.641.184.222 0 .426-.061.642-.184l.018-.011.019-.011c.14-.084.266-.178.492-.366l.178-.148c.279-.232.426-.342.625-.456.304-.174.612-.266.949-.266.337 0 .645.092.949.266l.023.014c.188.109.334.219.602.442l.178.148c.221.184.346.278.483.36l.028.017.018.01c.21.12.407.181.62.185h.022a.31.31 0 110 .618c-.337 0-.645-.092-.95-.266a3.137 3.137 0 01-.09-.054l-.022-.014-.022-.013-.02-.014a5.356 5.356 0 01-.49-.377l-.159-.132a3.836 3.836 0 00-.483-.36l-.027-.017-.019-.01a1.256 1.256 0 00-.641-.185c-.222 0-.426.061-.641.184l-.02.011-.018.011c-.14.084-.266.178-.492.366l-.158.132a5.125 5.125 0 01-.51.39l-.022.014-.022.014-.09.054a1.868 1.868 0 01-.95.266c-.337 0-.644-.092-.949-.266a3.137 3.137 0 01-.09-.054l-.022-.014-.022-.013-.026-.017a4.881 4.881 0 01-.425-.325.308.308 0 01-.12-.1l-.098-.081a3.836 3.836 0 00-.483-.36l-.027-.017-.019-.01a1.256 1.256 0 00-.641-.185c-.222 0-.426.061-.642.184l-.018.011-.019.011c-.14.084-.266.178-.492.366l-.158.132a5.125 5.125 0 01-.51.39l-.023.014-.022.014-.09.054A1.868 1.868 0 0112 22c-.337 0-.645-.092-.949-.266a3.137 3.137 0 01-.09-.054l-.022-.014-.022-.013-.021-.014a5.356 5.356 0 01-.49-.377l-.158-.132a3.836 3.836 0 00-.483-.36l-.028-.017-.018-.01a1.256 1.256 0 00-.642-.185c-.221 0-.425.061-.641.184l-.019.011-.018.011c-.141.084-.266.178-.492.366l-.158.132a5.125 5.125 0 01-.511.39l-.022.014-.022.014-.09.054a1.868 1.868 0 01-.986.264c-.746-.09-1.319-.38-1.89-.866l-.035-.03c-.047-.041-.118-.106-.192-.174l-.196-.181-.107-.1-.011-.01a1.531 1.531 0 00-.336-.253.313.313 0 00-.095-.03h-.005c-.119.022-.238.059-.361.11a.308.308 0 01-.077.061l-.008.005a.309.309 0 01-.126.034 5.66 5.66 0 00-.774.518l-.416.324-.055.043a6.542 6.542 0 01-.324.236c-.305.207-.552.315-.8.315a.31.31 0 01-.01-.618h.01c.09 0 .235-.062.438-.198l.04-.027c.077-.054.163-.117.27-.199l.385-.301.06-.047c.268-.206.506-.373.73-.505l-.633-1.21a.309.309 0 01.254-.451l20.287-1.305a.309.309 0 01.228.537zm-1.118.14L2.369 19.03l.423.809c.128-.045.256-.078.388-.1a.31.31 0 01.052-.005c.132 0 .26.032.386.093.153.073.294.179.483.35l.016.015.092.086.144.134.097.089c.065.06.125.114.16.144.485.418.948.658 1.554.736h.011a1.25 1.25 0 00.6-.172l.021-.011.019-.011.018-.011c.141-.084.266-.178.492-.366l.178-.148c.279-.232.426-.342.625-.456.305-.174.612-.266.95-.266.336 0 .644.092.948.266l.023.014c.188.109.335.219.603.442l.177.148c.222.184.346.278.484.36l.027.017.019.01c.215.124.42.185.641.185.222 0 .426-.061.641-.184l.019-.011.018-.011c.141-.084.267-.178.493-.366l.177-.148c.28-.232.427-.342.626-.456.304-.174.612-.266.949-.266.337 0 .644.092.949.266l.025.015c.187.109.334.22.603.443 1.867-.878 3.448-1.811 4.73-2.832l.02-.016zM3.653 2.026C6.073 3.06 8.69 4.941 10.8 7.258c2.46 2.7 4.109 5.828 4.637 9.149a.31.31 0 01-.421.335c-2.348-.945-4.54-1.258-6.59-1.02-1.739.2-3.337.792-4.816 1.703-.294.182-.62-.182-.405-.454 1.856-2.355 2.581-4.99 2.343-7.794-.195-2.292-1.031-4.61-2.284-6.709a.31.31 0 01.388-.442zM10.04 4.45c1.778.543 3.892 2.102 5.782 4.243 1.984 2.248 3.552 4.934 4.347 7.582a.31.31 0 01-.401.38l-.022-.01-.386-.154a10.594 10.594 0 00-.291-.112l-.016-.006c-.68-.247-1.199-.291-1.944-.101a.31.31 0 01-.375-.218C15.378 11.123 13.073 7.276 9.775 5c-.291-.201-.072-.653.266-.55zM4.273 2.996l.008.015c1.028 1.94 1.708 4.031 1.885 6.113.213 2.513-.31 4.906-1.673 7.092l-.02.031.003-.001c1.198-.581 2.47-.969 3.825-1.132l.055-.006c1.981-.23 4.083.029 6.309.837l.066.025-.007-.039c-.593-2.95-2.108-5.737-4.31-8.179l-.07-.078c-1.785-1.96-3.944-3.6-6.014-4.65l-.057-.028zm7.92 3.238l.048.048c2.237 2.295 3.885 5.431 4.974 9.191l.038.132.022-.004c.71-.133 1.284-.063 1.963.18l.027.01.066.024.046.018-.025-.073c-.811-2.307-2.208-4.62-3.936-6.594l-.058-.065c-1.02-1.155-2.103-2.132-3.15-2.856l-.015-.011z" />
    </svg>
  );
}
