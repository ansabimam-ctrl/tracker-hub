type LogoProps = {
  collapsed?: boolean;
};

export function Logo({ collapsed = false }: LogoProps) {
  return (
    <div className="flex min-h-11 items-center gap-3">
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-ink shadow-soft">
        <svg
          aria-hidden="true"
          className="h-7 w-7"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M18 18H46V25H35.5V46H28.5V25H18V18Z" fill="#F8FAFC" />
          <path
            d="M39.5 35.5L47 43L42.5 47.5L35 40L39.5 35.5Z"
            fill="#20B8A5"
          />
          <circle cx="34.5" cy="31.5" r="9.5" stroke="#7DD3FC" strokeWidth="5" />
        </svg>
      </div>
      {!collapsed && (
        <div className="min-w-0">
          <p className="truncate text-lg font-bold leading-5 text-ink">TrackHub</p>
          <p className="truncate text-xs font-medium text-muted">Business command center</p>
        </div>
      )}
    </div>
  );
}
