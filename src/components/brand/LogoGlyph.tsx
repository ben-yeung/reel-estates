type LogoGlyphProps = {
  size?: string;
  color?: string;
  className?: string;
};

/**
 * Reel Estates mark: a house silhouette with a play/reel triangle cut from it,
 * fusing short-form "reel" content with real "estate". Single evenodd path so
 * the triangle is negative space - whatever sits behind the glyph shows through.
 */
export default function LogoGlyph({
  size = "1.125rem",
  color = "white",
  className,
}: LogoGlyphProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M12 3 L20.8 10.3 L19.1 10.3 L19.1 20.2 L4.9 20.2 L4.9 10.3 L3.2 10.3 Z M9 11.2 L17.4 14.9 L9 18.6 Z"
        fill={color}
        fillRule="evenodd"
        stroke={color}
        strokeWidth="0.9"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
