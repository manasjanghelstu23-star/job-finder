import React from "react";

export function CompanyMeetingIllustration({ className = "w-full h-full" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 1000 680"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Sky gradient in window */}
        <linearGradient id="windowSunset" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffeedd" />
          <stop offset="60%" stopColor="#f5cfc1" />
          <stop offset="100%" stopColor="#e3a7bb" />
        </linearGradient>

        {/* Ambient room purple gradient */}
        <linearGradient id="roomPurple" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3b1559" />
          <stop offset="50%" stopColor="#2c1145" />
          <stop offset="100%" stopColor="#1e0b30" />
        </linearGradient>

        {/* Shadow filter */}
        <filter id="teamShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="16" stdDeviation="14" floodColor="#0d0417" floodOpacity="0.45" />
        </filter>
      </defs>

      {/* =========================================================
          BACKGROUND WALL & LARGE OFFICE WINDOW
         ========================================================= */}
      {/* Deep purple office room walls */}
      <rect width="1000" height="680" fill="url(#roomPurple)" />

      {/* Large Window Panel */}
      <rect x="200" y="50" width="460" height="480" fill="url(#windowSunset)" />

      {/* Distant Skyline & Suspension Bridge Silhouette in Window */}
      <path
        d="M200 440 L280 410 L310 430 L360 380 L390 410 L440 330 L480 390 L520 370 L580 430 L660 410 L660 530 L200 530 Z"
        fill="#cca0b8"
        opacity="0.6"
      />
      {/* Suspension Bridge cables */}
      <path
        d="M320 460 Q 420 390 520 460"
        stroke="#ba88a3"
        strokeWidth="2.5"
        fill="none"
        opacity="0.7"
      />
      <path
        d="M360 460 Q 420 410 480 460"
        stroke="#ba88a3"
        strokeWidth="1.5"
        fill="none"
        opacity="0.6"
      />
      <line x1="420" y1="360" x2="420" y2="480" stroke="#ba88a3" strokeWidth="2.5" opacity="0.7" />

      {/* Window Grid Mullions (White/Cream lines) */}
      <line x1="340" y1="50" x2="340" y2="530" stroke="#ffffff" strokeWidth="3" opacity="0.6" />
      <line x1="490" y1="50" x2="490" y2="530" stroke="#ffffff" strokeWidth="3" opacity="0.6" />
      <line x1="200" y1="160" x2="660" y2="160" stroke="#ffffff" strokeWidth="3" opacity="0.6" />
      <line x1="200" y1="280" x2="660" y2="280" stroke="#ffffff" strokeWidth="3" opacity="0.6" />
      <line x1="200" y1="400" x2="660" y2="400" stroke="#ffffff" strokeWidth="3" opacity="0.6" />

      {/* Left Wall & Shelving Columns */}
      <rect x="0" y="0" width="200" height="680" fill="#240c38" />
      <rect x="30" y="140" width="160" height="340" fill="#1b082c" rx="4" />
      <line x1="30" y1="220" x2="190" y2="220" stroke="#2e1049" strokeWidth="6" />
      <line x1="30" y1="310" x2="190" y2="310" stroke="#2e1049" strokeWidth="6" />
      <line x1="30" y1="400" x2="190" y2="400" stroke="#2e1049" strokeWidth="6" />

      {/* =========================================================
          THE TEAM COLLABORATING AT THE DESK
         ========================================================= */}
      <g filter="url(#teamShadow)">
        {/* -------------------------------------------------------
            PERSON 1 (LEFT): MAN LEANING FORWARD IN BLUE SHIRT
           ------------------------------------------------------- */}
        <g>
          {/* Torso & Blue Shirt */}
          <path
            d="M30 450 L35 340 C35 300 70 270 120 270 C165 270 190 295 195 340 L195 450 Z"
            fill="#2c4d80"
          />
          {/* Back Shadow Fold */}
          <path d="M30 450 L35 340 C35 300 60 275 90 270 L80 450 Z" fill="#213a61" />

          {/* Left Arm Leaning on Table */}
          <path
            d="M50 330 L95 440 L80 470 L35 360 Z"
            fill="#2c4d80"
          />

          {/* Right Arm Leaning on Desk with Calculator/Device */}
          <path
            d="M175 330 L185 450 L165 470 L145 350 Z"
            fill="#2c4d80"
          />
          {/* Right Forearm & Hand */}
          <path d="M185 450 L140 485 L125 475 L165 450 Z" fill="#d99b79" />
          <circle cx="130" cy="480" r="10" fill="#d99b79" />
          {/* Tablet/Calculator under hand */}
          <rect x="110" y="475" width="40" height="20" rx="3" transform="rotate(-15 110 475)" fill="#5e2675" />

          {/* Neck */}
          <path d="M125 270 L135 240 L160 250 L155 270 Z" fill="#c98a67" />

          {/* Head Profile */}
          <path
            d="M135 245 C135 205 160 195 195 210 C220 220 225 255 210 275 C195 295 160 300 135 275 Z"
            fill="#d99b79"
          />
          {/* Dark Hair */}
          <path
            d="M135 240 C130 195 180 180 215 195 C230 205 235 230 225 245 C220 235 215 230 200 230 C185 230 180 235 170 230 C160 225 155 230 150 240 Z"
            fill="#1c2538"
          />
        </g>

        {/* -------------------------------------------------------
            PERSON 2 (CENTER): SEATED MAN IN BLUE SUIT & TIE
           ------------------------------------------------------- */}
        <g>
          {/* Chair Backrest */}
          <path d="M220 370 C220 320 240 300 280 300 C320 300 340 320 340 370 Z" fill="#1b082c" />

          {/* Suit Jacket Body */}
          <path
            d="M210 520 L230 380 C230 330 270 315 320 315 C370 315 410 330 420 380 L440 520 Z"
            fill="#325286"
          />
          {/* Suit Lapels & White Shirt Collar */}
          <path d="M305 325 L290 375 L335 375 L320 325 Z" fill="#ffffff" />
          {/* Blue Tie */}
          <path d="M308 370 L303 440 L313 460 L323 440 L318 370 Z" fill="#1e3252" />
          {/* Left Lapel */}
          <path d="M280 330 L300 420 L285 410 Z" fill="#253e66" />
          {/* Right Lapel */}
          <path d="M345 330 L325 420 L340 410 Z" fill="#253e66" />

          {/* Neck */}
          <path d="M295 320 L295 285 L330 285 L330 320 Z" fill="#c98a67" />

          {/* Head Facing Right */}
          <path
            d="M275 285 C265 240 290 205 330 205 C365 205 385 230 380 270 C375 305 340 325 300 315 Z"
            fill="#d99b79"
          />
          {/* Hair (Sleek Side Part) */}
          <path
            d="M275 270 C265 220 305 190 350 195 C375 200 385 220 380 240 C370 225 350 215 330 220 C310 225 300 245 285 255 Z"
            fill="#1c2538"
          />
        </g>

        {/* -------------------------------------------------------
            PERSON 3 (RIGHT): WOMAN IN BLUE DRESS LEANING IN
           ------------------------------------------------------- */}
        <g>
          {/* Dress Body */}
          <path
            d="M495 530 L480 370 C480 330 515 310 550 310 C585 310 610 330 615 370 L630 530 Z"
            fill="#2c4373"
          />
          {/* Arm Leaning Forward */}
          <path
            d="M510 365 L490 440 L515 450 L535 375 Z"
            fill="#2c4373"
          />
          <circle cx="510" cy="455" r="11" fill="#d99b79" />

          {/* Neck */}
          <path d="M515 315 L515 275 L545 275 L545 315 Z" fill="#c98a67" />

          {/* Head & Face */}
          <path
            d="M495 275 C485 230 510 200 545 200 C580 200 595 230 590 270 C580 305 550 325 510 315 Z"
            fill="#d99b79"
          />
          {/* Long Flowing Dark Hair */}
          <path
            d="M510 220 C490 190 545 180 575 195 C605 210 615 250 605 310 C595 360 575 390 565 400 C565 370 575 330 565 300 C555 270 540 250 510 260 Z"
            fill="#181d2a"
          />
          <path
            d="M510 240 C485 270 475 320 480 370 C490 360 500 320 505 285 Z"
            fill="#181d2a"
          />
        </g>
      </g>

      {/* =========================================================
          OFFICE TABLE & LAPTOP IN FOREGROUND
         ========================================================= */}
      {/* Wooden / Dark Office Desk Surface */}
      <rect x="0" y="520" width="700" height="160" fill="#2d1342" />
      <line x1="0" y1="520" x2="700" y2="520" stroke="#482068" strokeWidth="4" />

      {/* Open Laptop on Desk */}
      <g>
        {/* Laptop Base */}
        <path d="M190 520 L370 520 L385 528 L175 528 Z" fill="#1b1c24" />
        {/* Laptop Screen (Open Facing User) */}
        <path d="M195 440 L365 440 L370 520 L190 520 Z" fill="#101117" stroke="#252733" strokeWidth="2" />
        {/* Screen Display Glow */}
        <rect x="202" y="446" width="156" height="68" rx="2" fill="#222638" />
        <rect x="212" y="456" width="70" height="6" rx="2" fill="#3b82f6" opacity="0.8" />
        <rect x="212" y="468" width="50" height="4" rx="2" fill="#94a3b8" opacity="0.6" />
        <rect x="212" y="476" width="60" height="4" rx="2" fill="#94a3b8" opacity="0.6" />
        <circle cx="330" cy="480" r="16" fill="#8b5cf6" opacity="0.7" />
      </g>

      {/* Notepad & Pen beside Laptop */}
      <rect x="380" y="515" width="130" height="12" rx="2" fill="#e2d9ec" />
      <line x1="390" y1="520" x2="490" y2="520" stroke="#9333ea" strokeWidth="2" />

      {/* =========================================================
          PURPLE POTTED PLANT IN FOREGROUND (RIGHT SIDE)
         ========================================================= */}
      <g filter="url(#teamShadow)">
        {/* Plant Pot */}
        <path d="M605 580 L615 630 C617 638 623 644 632 644 H658 C667 644 673 638 675 630 L685 580 Z" fill="#1a0729" />
        <ellipse cx="645" cy="580" rx="42" ry="9" fill="#290d3d" />

        {/* Big Stylized Purple Leaves */}
        {/* Leaf 1 (Left Curve) */}
        <path
          d="M645 580 C600 530 580 460 600 420 C625 450 645 520 645 580 Z"
          fill="#4c1d95"
          stroke="#2e1065"
          strokeWidth="2"
        />
        <path d="M615 480 Q625 530 645 580" stroke="#6d28d9" strokeWidth="2" fill="none" />

        {/* Leaf 2 (Center High) */}
        <path
          d="M645 580 C635 500 650 440 670 410 C680 450 665 520 645 580 Z"
          fill="#6d28d9"
          stroke="#3b0764"
          strokeWidth="2"
        />
        <path d="M655 470 Q650 520 645 580" stroke="#8b5cf6" strokeWidth="2" fill="none" />

        {/* Leaf 3 (Right Leaf) */}
        <path
          d="M645 580 C670 520 705 470 730 460 C720 495 685 540 645 580 Z"
          fill="#581c87"
          stroke="#2e1065"
          strokeWidth="2"
        />
        <path d="M685 510 Q665 540 645 580" stroke="#7e22ce" strokeWidth="2" fill="none" />
      </g>
    </svg>
  );
}
