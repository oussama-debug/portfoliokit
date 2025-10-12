"use client";

export function SparkleIcon({
  className = "",
  fill = "#EDEDED",
}: {
  className?: string;
  fill?: string;
}) {
  return (
    <svg
      fill="none"
      height="21"
      viewBox="0 0 22 21"
      width="22"
      xmlns="http://www.w3.org/2000/svg"
      className={`pointer-events-none ${className}`}
      style={{ contain: "layout paint" }}
    >
      <path
        d="M10.5 4C10.5 7.31371 7.81371 10 4.5 10H0.5V11H4.5C7.81371 11 10.5 13.6863 10.5 17V21H11.5V17C11.5 13.6863 14.1863 11 17.5 11H21.5V10H17.5C14.1863 10 11.5 7.31371 11.5 4V0H10.5V4Z"
        fill={fill}
      />
    </svg>
  );
}
