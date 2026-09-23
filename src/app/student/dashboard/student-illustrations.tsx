import React from "react";

// EduLearn Colorful Geometric Logo Icon
export function EduLearnLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Top Left Cyan Box */}
      <rect x="4" y="6" width="13" height="13" rx="3" fill="#06B6D4" />
      {/* Top Right Yellow Box */}
      <rect x="21" y="4" width="14" height="14" rx="3.5" fill="#FBBF24" />
      {/* Bottom Left Magenta/Coral Box */}
      <rect x="5" y="22" width="13" height="13" rx="3" fill="#F43F5E" />
      {/* Center Dynamic Blue Polygon */}
      <path d="M15 15L27 12L25 27L13 25Z" fill="#3B82F6" opacity="0.9" />
      {/* Small floating accents */}
      <circle cx="8" cy="4" r="2" fill="#3B82F6" />
      <circle cx="34" cy="22" r="2.5" fill="#10B981" />
      <circle cx="22" cy="35" r="2" fill="#8B5CF6" />
    </svg>
  );
}

// Hero Banner: Graduating Students Celebrating with Diplomas
export function GraduatingStudentsIllustration({ className = "w-full h-full" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 440 260" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="robeGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2D3748" />
          <stop offset="100%" stopColor="#1A202C" />
        </linearGradient>
        <filter id="shadowGlow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#000" floodOpacity="0.18" />
        </filter>
      </defs>

      {/* Floating confetti / stars */}
      <circle cx="80" cy="50" r="3" fill="#FEEBC8" opacity="0.8" />
      <circle cx="210" cy="25" r="4" fill="#FEFCBF" opacity="0.9" />
      <circle cx="340" cy="40" r="3.5" fill="#FEEBC8" opacity="0.8" />
      <rect x="120" y="30" width="8" height="8" rx="1.5" transform="rotate(25 120 30)" fill="#F6E05E" opacity="0.7" />
      <rect x="290" y="20" width="7" height="7" rx="1" transform="rotate(-30 290 20)" fill="#68D391" opacity="0.8" />
      <rect x="390" y="70" width="6" height="6" rx="1" transform="rotate(45 390 70)" fill="#F6AD55" opacity="0.8" />

      {/* STUDENT 1: Left (Dancing / leaping graduate) */}
      <g filter="url(#shadowGlow)">
        {/* Legs & Shoes */}
        <path d="M78 200L65 240L75 245L88 205Z" fill="#C53030" />
        <path d="M96 200L115 238L105 242L88 205Z" fill="#C53030" />
        <ellipse cx="62" cy="245" rx="10" ry="5" fill="#4A5568" />
        <ellipse cx="120" cy="242" rx="10" ry="5" fill="#4A5568" />

        {/* Robe */}
        <path d="M60 115C60 115 50 145 45 195C55 200 115 202 125 195C120 145 110 115 110 115Z" fill="url(#robeGrad)" />
        {/* Robe Fold / Stole */}
        <path d="M75 115L85 175L95 115Z" fill="#DD6B20" />

        {/* Head & Face */}
        <circle cx="85" cy="85" r="16" fill="#ED8936" />
        {/* Hair */}
        <path d="M72 82C72 70 98 70 98 82C95 73 75 73 72 82Z" fill="#2D3748" />

        {/* Mortarboard / Cap */}
        <path d="M55 72L85 60L115 72L85 84Z" fill="#1A202C" />
        <rect x="73" y="72" width="24" height="10" rx="3" fill="#2D3748" />
        {/* Tassel */}
        <path d="M85 72C80 78 72 85 70 95" stroke="#ECC94B" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="70" cy="97" r="3" fill="#ECC94B" />

        {/* Raised Arm with Diploma */}
        <path d="M55 125L40 95L50 90L62 120Z" fill="#2D3748" />
        <circle cx="38" cy="92" r="6" fill="#ED8936" />
        {/* Yellow Diploma Scroll */}
        <rect x="25" y="80" width="22" height="8" rx="2" transform="rotate(-30 25 80)" fill="#ECC94B" />
        <rect x="33" y="78" width="4" height="9" transform="rotate(-30 33 78)" fill="#E53E3E" />
      </g>

      {/* STUDENT 2: Center (Arms raised in triumph) */}
      <g filter="url(#shadowGlow)">
        {/* Legs & Pants */}
        <path d="M190 205L180 250L192 252L202 208Z" fill="#2B6CB0" />
        <path d="M210 205L225 248L215 252L200 208Z" fill="#2B6CB0" />
        <ellipse cx="178" cy="252" rx="9" ry="4" fill="#1A202C" />
        <ellipse cx="228" cy="250" rx="9" ry="4" fill="#1A202C" />

        {/* Robe */}
        <path d="M175 105C175 105 160 145 155 208C175 212 230 212 245 208C240 145 225 105 225 105Z" fill="url(#robeGrad)" />
        {/* Stole / V-Neck */}
        <path d="M190 105L200 170L210 105Z" fill="#319795" />

        {/* Head */}
        <circle cx="200" cy="75" r="16" fill="#F6AD55" />
        {/* Smile */}
        <path d="M196 82Q200 86 204 82" stroke="#744210" strokeWidth="1.5" strokeLinecap="round" fill="none" />

        {/* Mortarboard */}
        <path d="M170 60L200 48L230 60L200 72Z" fill="#1A202C" />
        <rect x="188" y="60" width="24" height="10" rx="3" fill="#2D3748" />
        {/* Tassel */}
        <path d="M200 60C208 66 215 72 218 84" stroke="#ECC94B" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="218" cy="86" r="3" fill="#ECC94B" />

        {/* Left Arm Raised High with Diploma */}
        <path d="M175 115L150 70L160 65L182 110Z" fill="#2D3748" />
        <circle cx="148" cy="67" r="6" fill="#F6AD55" />
        <rect x="135" y="48" width="22" height="8" rx="2" transform="rotate(40 135 48)" fill="#FAF089" />
        <rect x="144" y="52" width="4" height="9" transform="rotate(40 144 52)" fill="#319795" />

        {/* Right Arm Raised */}
        <path d="M225 110L248 65L258 70L235 115Z" fill="#2D3748" />
        <circle cx="252" cy="65" r="6" fill="#F6AD55" />
      </g>

      {/* STUDENT 3: Right (Female graduate celebrating) */}
      <g filter="url(#shadowGlow)">
        {/* Legs & Shoes */}
        <path d="M305 200L298 245L308 247L315 202Z" fill="#4A5568" />
        <path d="M325 200L335 243L325 246L317 202Z" fill="#4A5568" />
        <ellipse cx="295" cy="247" rx="8" ry="4" fill="#C53030" />
        <ellipse cx="338" cy="245" rx="8" ry="4" fill="#C53030" />

        {/* Robe */}
        <path d="M290 110C290 110 278 145 272 202C290 206 345 206 358 202C352 145 340 110 340 110Z" fill="url(#robeGrad)" />
        {/* Orange Accent Stole */}
        <path d="M305 110L315 165L325 110Z" fill="#ED8936" />

        {/* Head & Hair */}
        <path d="M300 78C300 68 330 68 330 78C332 90 328 105 324 112C318 106 312 106 306 112C302 105 298 90 300 78Z" fill="#7B341E" />
        <circle cx="315" cy="80" r="14" fill="#FBD38D" />

        {/* Mortarboard */}
        <path d="M288 65L315 54L342 65L315 76Z" fill="#1A202C" />
        <rect x="303" y="65" width="24" height="9" rx="3" fill="#2D3748" />
        {/* Tassel */}
        <path d="M315 65C310 72 305 78 302 88" stroke="#ECC94B" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="302" cy="90" r="3" fill="#ECC94B" />

        {/* Hand holding book / degree */}
        <path d="M340 120L360 145L350 152L330 130Z" fill="#2D3748" />
        <circle cx="362" cy="148" r="5.5" fill="#FBD38D" />
        {/* White Binder with Diploma ribbon */}
        <rect x="358" y="140" width="18" height="24" rx="2" transform="rotate(-15 358 140)" fill="#FFFFFF" />
        <rect x="364" y="142" width="4" height="23" transform="rotate(-15 364 142)" fill="#3182CE" />
      </g>
    </svg>
  );
}

// Sidebar Bottom Graphic: Group of Students
export function SidebarStudentsGraphic({ className = "w-full h-auto" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background Soft Circle */}
      <circle cx="100" cy="80" r="75" fill="#EBF8FF" opacity="0.8" />

      {/* Student 1: Left with backpack and books */}
      <g>
        <path d="M45 95C45 95 38 120 40 145H58V100Z" fill="#3182CE" />
        <path d="M44 145L40 160H48L52 145Z" fill="#2D3748" />
        <circle cx="48" cy="72" r="10" fill="#ED8936" />
        <path d="M40 70C40 60 56 60 56 70Z" fill="#4A5568" />
        <rect x="32" y="105" width="10" height="24" rx="3" fill="#E53E3E" />
      </g>

      {/* Student 2: Mid-Left (Female in red top) */}
      <g>
        <path d="M68 90C68 90 60 115 62 145H80V95Z" fill="#E53E3E" />
        <path d="M66 145L64 160H72L74 145Z" fill="#2B6CB0" />
        <circle cx="72" cy="68" r="10" fill="#FBD38D" />
        <path d="M62 65C62 55 82 55 82 65C84 75 80 82 78 86H66C64 82 60 75 62 65Z" fill="#742A2A" />
        <rect x="68" y="110" width="16" height="12" rx="2" fill="#FAF089" />
      </g>

      {/* Student 3: Center (Tall student in orange/coral) */}
      <g>
        <path d="M92 85C92 85 84 110 86 145H108V90Z" fill="#DD6B20" />
        <path d="M92 145L90 160H98L100 145Z" fill="#1A202C" />
        <path d="M102 145L100 160H108L110 145Z" fill="#1A202C" />
        <circle cx="98" cy="62" r="11" fill="#F6AD55" />
        <path d="M88 60C88 50 108 50 108 60Z" fill="#2D3748" />
        {/* Headphones */}
        <path d="M86 62C86 52 110 52 110 62" stroke="#3182CE" strokeWidth="2.5" fill="none" />
        <rect x="85" y="60" width="3" height="6" rx="1" fill="#3182CE" />
        <rect x="108" y="60" width="3" height="6" rx="1" fill="#3182CE" />
      </g>

      {/* Student 4: Mid-Right (Holding laptop) */}
      <g>
        <path d="M120 90C120 90 114 115 116 145H134V95Z" fill="#319795" />
        <path d="M122 145L120 160H128L130 145Z" fill="#4A5568" />
        <circle cx="126" cy="68" r="10" fill="#FBD38D" />
        <path d="M118 66C118 56 134 56 134 66Z" fill="#B7791F" />
        <rect x="122" y="112" width="16" height="12" rx="2" fill="#E2E8F0" />
      </g>

      {/* Student 5: Right with yellow jacket */}
      <g>
        <path d="M144 95C144 95 138 120 140 145H158V100Z" fill="#D69E2E" />
        <path d="M146 145L144 160H152L154 145Z" fill="#2B6CB0" />
        <circle cx="150" cy="72" r="10" fill="#ED8936" />
        <path d="M142 70C142 60 158 60 158 70Z" fill="#1A202C" />
      </g>
    </svg>
  );
}

// Instructor Avatars matching the design
export function InstructorAvatar({
  name,
  role = "5 Design Course",
  id,
}: {
  name: string;
  role?: string;
  id: "nil" | "theron" | "tyler" | "johen";
}) {
  const configs = {
    nil: {
      bgColor: "bg-amber-100",
      svg: (
        <svg viewBox="0 0 40 40" className="w-full h-full" fill="none">
          <circle cx="20" cy="20" r="20" fill="#FEEBC8" />
          <path d="M10 38C10 30 14 26 20 26C26 26 30 30 30 38Z" fill="#2B6CB0" />
          <circle cx="20" cy="18" r="8" fill="#ED8936" />
          <path d="M13 14C15 8 25 8 27 14Z" fill="#2D3748" />
          {/* Glasses */}
          <rect x="15" y="16" width="4" height="3" rx="1" stroke="#1A202C" strokeWidth="1.2" fill="none" />
          <rect x="21" y="16" width="4" height="3" rx="1" stroke="#1A202C" strokeWidth="1.2" fill="none" />
          <path d="M19 17.5H21" stroke="#1A202C" strokeWidth="1.2" />
        </svg>
      ),
    },
    theron: {
      bgColor: "bg-rose-100",
      svg: (
        <svg viewBox="0 0 40 40" className="w-full h-full" fill="none">
          <circle cx="20" cy="20" r="20" fill="#FED7D7" />
          <path d="M10 38C10 30 14 26 20 26C26 26 30 30 30 38Z" fill="#E53E3E" />
          <circle cx="20" cy="18" r="8" fill="#FBD38D" />
          {/* Orange/Reddish long hair */}
          <path d="M12 16C12 8 28 8 28 16C29 23 27 28 26 31H14C13 28 11 23 12 16Z" fill="#DD6B20" />
          <circle cx="20" cy="18" r="7" fill="#FBD38D" />
        </svg>
      ),
    },
    tyler: {
      bgColor: "bg-emerald-100",
      svg: (
        <svg viewBox="0 0 40 40" className="w-full h-full" fill="none">
          <circle cx="20" cy="20" r="20" fill="#C6F6D5" />
          <path d="M10 38C10 30 14 26 20 26C26 26 30 30 30 38Z" fill="#319795" />
          <circle cx="20" cy="18" r="8" fill="#F6AD55" />
          {/* Brunette chic bob */}
          <path d="M13 15C13 9 27 9 27 15C28 22 25 24 25 24H15C15 24 12 22 13 15Z" fill="#4A5568" />
          <circle cx="20" cy="18" r="6.8" fill="#F6AD55" />
        </svg>
      ),
    },
    johen: {
      bgColor: "bg-blue-100",
      svg: (
        <svg viewBox="0 0 40 40" className="w-full h-full" fill="none">
          <circle cx="20" cy="20" r="20" fill="#BEE3F8" />
          <path d="M10 38C10 30 14 26 20 26C26 26 30 30 30 38Z" fill="#4299E1" />
          <circle cx="20" cy="18" r="8" fill="#FBD38D" />
          {/* Blonde short hair */}
          <path d="M14 13C14 8 26 8 26 13C25 11 15 11 14 13Z" fill="#D69E2E" />
          <path d="M18 20Q20 22 22 20" stroke="#744210" strokeWidth="1" strokeLinecap="round" fill="none" />
        </svg>
      ),
    },
  };

  const config = configs[id] || configs.nil;

  return (
    <div className="flex items-center space-x-3 group">
      <div className={`w-11 h-11 rounded-full overflow-hidden ${config.bgColor} p-0.5 shadow-sm border border-white flex-shrink-0 transition-transform group-hover:scale-105`}>
        {config.svg}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-slate-800 truncate group-hover:text-blue-600 transition-colors">{name}</h4>
        <p className="text-xs text-slate-400 font-medium">{role}</p>
      </div>
    </div>
  );
}
