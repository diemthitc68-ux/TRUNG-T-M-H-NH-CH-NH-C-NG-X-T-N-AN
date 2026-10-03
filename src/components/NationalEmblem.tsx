import React from 'react';

interface EmblemProps {
  className?: string;
  size?: number;
}

export const NationalEmblem: React.FC<EmblemProps> = ({ className = '', size = 44 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`shrink-0 ${className}`}
      aria-label="Quốc huy Việt Nam"
    >
      {/* Outer Circle Ring */}
      <circle cx="50" cy="50" r="48" fill="#c21a1a" stroke="#eab308" strokeWidth="3" />
      <circle cx="50" cy="50" r="45" fill="#b91c1c" />

      {/* Decorative Golden Rice Sheaves Rim */}
      <path
        d="M20 70 C 12 50, 20 28, 50 14 C 80 28, 88 50, 80 70"
        fill="none"
        stroke="#facc15"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="24" cy="58" r="2.5" fill="#facc15" />
      <circle cx="20" cy="46" r="2.5" fill="#facc15" />
      <circle cx="22" cy="34" r="2.5" fill="#facc15" />
      <circle cx="30" cy="24" r="2.5" fill="#facc15" />
      <circle cx="76" cy="58" r="2.5" fill="#facc15" />
      <circle cx="80" cy="46" r="2.5" fill="#facc15" />
      <circle cx="78" cy="34" r="2.5" fill="#facc15" />
      <circle cx="70" cy="24" r="2.5" fill="#facc15" />

      {/* Cogwheel at base */}
      <circle cx="50" cy="74" r="14" fill="#eab308" />
      <circle cx="50" cy="74" r="8" fill="#991b1b" />
      <circle cx="50" cy="74" r="4" fill="#facc15" />

      {/* Cog teeth */}
      <rect x="48" y="58" width="4" height="4" fill="#eab308" />
      <rect x="48" y="86" width="4" height="4" fill="#eab308" />
      <rect x="34" y="72" width="4" height="4" fill="#eab308" />
      <rect x="62" y="72" width="4" height="4" fill="#eab308" />

      {/* Golden 5-pointed Star */}
      <polygon
        points="50,22 55,36 70,36 58,45 62,60 50,51 38,60 42,45 30,36 45,36"
        fill="#facc15"
      />
    </svg>
  );
};
