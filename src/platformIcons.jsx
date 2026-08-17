export const PLATFORM_ICONS = [
  { id: "youtube", label: "YouTube" },
  { id: "sony", label: "Sony" },
];

export function PlatformIcon({ svg, size = 28 }) {
  if (svg === "youtube") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="#FF0000"
          d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8Z"
        />
        <path fill="#fff" d="M9.8 15.5V8.5L15.7 12l-5.9 3.5Z" />
      </svg>
    );
  }

  if (svg === "sony") {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
        <rect width="64" height="64" rx="12" fill="#000" />
        <text
          x="32"
          y="38"
          textAnchor="middle"
          fill="#fff"
          fontFamily="Arial, sans-serif"
          fontSize="16"
          fontWeight="700"
        >
          SONY
        </text>
      </svg>
    );
  }

  if (svg) {
    return <img src={svg} alt="" width={size} height={size} style={{ objectFit: "contain" }} />;
  }

  return null;
}

export function getWatchPlatforms(event) {
  if (event?.watchPlatforms?.length) return event.watchPlatforms;
  if (event?.watchPlatform) {
    return [{ svg: "", name: event.watchPlatform, url: "", type: "ott" }];
  }
  return [];
}
