import React from 'react';

interface LeedoLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  bilingualSubtitle?: boolean;
  variant?: 'light' | 'dark';
}

export const LeedoLogo: React.FC<LeedoLogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = false,
  bilingualSubtitle = false,
  variant = 'light',
}) => {
  const sizeMap = {
    sm: { height: 32, emblemSize: 34, text: 'text-lg', sub: 'text-[9px]' },
    md: { height: 44, emblemSize: 46, text: 'text-2xl', sub: 'text-[11px]' },
    lg: { height: 60, emblemSize: 62, text: 'text-3xl', sub: 'text-xs' },
    xl: { height: 80, emblemSize: 84, text: 'text-4xl', sub: 'text-sm' },
  };

  const currentSize = sizeMap[size];
  const isDark = variant === 'dark';

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Official LEEDO Vector Emblem: Two joyful children running hand-in-hand toward empowerment */}
      <svg
        width={currentSize.emblemSize}
        height={currentSize.emblemSize}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-sm transition-transform duration-200"
      >
        {/* Soft rounded protective emblem background */}
        <rect width="120" height="120" rx="26" fill={isDark ? '#1e293b' : '#fff1f2'} />
        <rect
          x="1"
          y="1"
          width="118"
          height="118"
          rx="25"
          stroke={isDark ? '#334155' : '#fecdd3'}
          strokeWidth="2"
        />

        {/* Rising Hope Arc / Sun Radiance */}
        <path
          d="M 22 96 C 42 70, 78 70, 98 96"
          stroke="#fb7185"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.6"
        />

        {/* Child 1 (Girl/Sister - taller, leading forward): Head */}
        <circle cx="42" cy="30" r="9" fill="#e11d48" />

        {/* Child 2 (Boy/Brother - joyful runner leaping): Head */}
        <circle cx="78" cy="24" r="8.5" fill="#e11d48" />

        {/* Dynamic Running Body & Joined Hands of Street Children */}
        <path
          d="M 42 39
             C 38 48, 30 54, 20 56
             C 16 57, 14 62, 18 63
             C 24 64, 34 58, 38 52
             C 37 60, 32 74, 24 82
             C 20 86, 23 91, 28 89
             C 36 86, 44 72, 48 64
             C 50 72, 54 81, 56 94
             C 57 99, 63 99, 64 94
             C 65 83, 58 68, 56 56
             C 64 52, 72 44, 82 36
             C 90 30, 99 24, 106 19
             C 109 17, 106 13, 103 15
             C 93 21, 82 28, 74 34
             C 73 44, 71 55, 66 63
             C 61 70, 60 76, 64 80
             C 68 84, 75 78, 80 70
             C 83 65, 87 58, 89 52
             C 93 45, 96 50, 94 57
             C 92 68, 85 78, 82 86
             C 80 91, 87 94, 91 89
             C 96 82, 101 70, 101 58
             C 101 46, 94 37, 86 33
             C 77 28, 65 33, 55 38
             C 48 41, 45 38, 42 39
             Z"
          fill="#e11d48"
        />

        {/* Hand in hand connection clasp detail */}
        <ellipse cx="64" cy="46" rx="4.5" ry="3.5" fill="#be123c" />

        {/* Ground flourish symbolizing progress and education */}
        <path
          d="M 32 102 C 52 98, 68 98, 88 102"
          stroke="#059669"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      </svg>

      {/* Brand Wordmark & Typography */}
      <div className="flex flex-col justify-center leading-none">
        <div className="flex items-baseline gap-2">
          <span
            className={`font-black tracking-wider text-rose-600 ${currentSize.text} font-sans uppercase`}
            style={{ letterSpacing: '0.06em' }}
          >
            LEEDO
          </span>
          <span
            className={`font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'} text-xs tracking-normal`}
          >
            লিডো
          </span>
        </div>

        {showSubtitle && (
          <div className="flex flex-col mt-0.5">
            <span
              className={`${isDark ? 'text-slate-400' : 'text-slate-600'} font-semibold tracking-tight ${currentSize.sub}`}
            >
              Local Education & Economic Development Org.
            </span>
            {bilingualSubtitle && (
              <span
                className={`${isDark ? 'text-slate-500' : 'text-slate-400'} font-medium text-[9px] mt-0.5`}
              >
                স্থানীয় শিক্ষা ও অর্থনৈতিক উন্নয়ন সংস্থা • ঢাকা, বাংলাদেশ
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
