/** The Ayre Aviation mark and wordmark. The mark stroke uses the brand token. */
export function BrandMark({ size = 34 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 36 36"
      width={size}
      height={size}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="stroke-brand-gold-mark"
    >
      <path d="M4 31L18 4l14 27" strokeWidth={2.2} />
      <path d="M10.5 21h15" strokeWidth={2.2} />
      <path d="M12 31l6-11 6 11" strokeWidth={1.4} />
    </svg>
  );
}

export function Wordmark({ variant }: { variant: 'login' | 'sidebar' }) {
  if (variant === 'login') {
    return (
      <div className="flex items-center gap-3">
        <BrandMark size={34} />
        <div>
          <b className="block font-serif text-xl font-medium tracking-[0.22em] text-fg-on-dark">
            AYRE
          </b>
          <small className="-mt-0.5 block text-[11px] tracking-[0.38em] text-fg-on-dark-muted">
            AVIATION
          </small>
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2.5">
      <BrandMark size={44} />
      <div className="leading-tight">
        <b className="block font-serif text-lg font-medium tracking-[0.2em] text-brand-gold-on-dark">
          AYRE
        </b>
        <span className="text-[15px] font-medium text-fg-on-dark">Aviation</span>
      </div>
    </div>
  );
}
