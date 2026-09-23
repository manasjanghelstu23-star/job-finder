import React from "react";

export function StudentLoginIllustration({ className = "w-full h-full" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 540 480"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Soft drop shadows */}
        <filter id="cardShadow" x="-10%" y="-5%" width="125%" height="115%">
          <feDropShadow dx="0" dy="12" stdDeviation="16" floodColor="#4c1d95" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* =========================================================
          BACKGROUND FLUID ORGANIC WAVES (PURPLE TONES)
         ========================================================= */}
      <path
        d="M-40 180 C 60 120, 140 280, 260 220 C 380 160, 440 260, 560 200 L 560 500 L -40 500 Z"
        fill="#7c3aed"
        opacity="0.3"
      />
      <path
        d="M-60 300 C 80 240, 180 380, 320 300 C 440 220, 500 340, 580 280 L 580 500 L -60 500 Z"
        fill="#6d28d9"
        opacity="0.25"
      />
      <path
        d="M-20 80 C 100 20, 180 140, 290 90 C 400 40, 480 120, 550 70 L 550 300 C 400 360, 200 200, -20 320 Z"
        fill="#9333ea"
        opacity="0.18"
      />

      {/* =========================================================
          POTTED PLANT (RIGHT SIDE)
         ========================================================= */}
      <g>
        {/* Pot */}
        <path d="M430 380 L440 435 C440 442 446 446 454 446 H476 C484 446 490 442 490 435 L500 380 Z" fill="#18181b" />
        <ellipse cx="465" cy="380" rx="35" ry="7" fill="#27272a" />

        {/* Big Leaf 1 (Top Left) */}
        <path d="M465 380 C440 330 420 280 430 250 C445 280 470 330 465 380Z" fill="#ffffff" stroke="#18181b" strokeWidth="2.5" />
        <path d="M445 315 L430 250" stroke="#18181b" strokeWidth="2" strokeLinecap="round" />

        {/* Big Leaf 2 (Top Right) */}
        <path d="M465 380 C480 320 510 270 535 260 C530 290 505 340 465 380Z" fill="#ffffff" stroke="#18181b" strokeWidth="2.5" />
        <path d="M485 330 L535 260" stroke="#18181b" strokeWidth="2" strokeLinecap="round" />

        {/* Big Leaf 3 (Side Right) */}
        <path d="M465 380 C500 360 535 345 545 320 C530 345 495 365 465 380Z" fill="#ffffff" stroke="#18181b" strokeWidth="2.5" />

        {/* Leaf 4 (Back Center) */}
        <path d="M465 380 C455 310 475 250 490 220 C495 260 480 320 465 380Z" fill="#ffffff" stroke="#18181b" strokeWidth="2.5" />
      </g>

      {/* =========================================================
          LARGE DOCUMENT / CALENDAR PORTAL CARD (CENTER)
         ========================================================= */}
      <g filter="url(#cardShadow)">
        {/* Main Document Body */}
        <rect
          x="195"
          y="265"
          width="190"
          height="180"
          rx="14"
          fill="#ffffff"
          stroke="#18181b"
          strokeWidth="3.5"
        />

        {/* Top Header Bars on Document */}
        <rect x="220" y="285" width="80" height="7" rx="3.5" fill="none" stroke="#18181b" strokeWidth="2.5" />
        <rect x="220" y="300" width="135" height="5" rx="2.5" fill="none" stroke="#18181b" strokeWidth="2" />

        {/* Magnifying Glass on Document */}
        <circle cx="270" cy="345" r="34" fill="#ffffff" stroke="#18181b" strokeWidth="4" />
        <circle cx="270" cy="345" r="23" fill="none" stroke="#18181b" strokeWidth="2" strokeDasharray="3 3" />
        {/* Magnifying Glass Handle */}
        <path d="M294 368 L320 394" stroke="#18181b" strokeWidth="5.5" strokeLinecap="round" />

        {/* Document Content Lines */}
        <rect x="315" y="325" width="55" height="5" rx="2.5" fill="none" stroke="#18181b" strokeWidth="2" />
        <rect x="315" y="340" width="45" height="5" rx="2.5" fill="none" stroke="#18181b" strokeWidth="2" />
        <rect x="315" y="355" width="50" height="5" rx="2.5" fill="none" stroke="#18181b" strokeWidth="2" />

        {/* Lower Lines on Document */}
        <rect x="220" y="395" width="145" height="6" rx="3" fill="none" stroke="#18181b" strokeWidth="2.5" />
        <rect x="220" y="410" width="70" height="6" rx="3" fill="none" stroke="#18181b" strokeWidth="2.5" />
      </g>

      {/* =========================================================
          STUDENT 1: SITTING ON TOP OF DOCUMENT WITH LAPTOP
         ========================================================= */}
      <g>
        {/* Legs hanging down side of card */}
        {/* Left Leg (Hanging front) */}
        <path
          d="M345 285 C355 300 365 315 385 318 C405 320 420 340 435 370"
          stroke="#18181b"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Shoe */}
        <path d="M430 368 L448 376 C455 379 460 388 456 394 L435 394 C430 385 428 375 430 368Z" fill="#18181b" />

        {/* Right Leg (Folded back / angled) */}
        <path
          d="M330 285 C340 305 360 310 380 310 C395 310 405 325 415 350"
          stroke="#18181b"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />
        <path d="M410 350 L425 356 C430 360 432 368 428 372 L412 372 Z" fill="#18181b" />

        {/* White Trousers Outline */}
        <path
          d="M330 270 C340 285 365 290 385 292 C410 295 425 320 440 370 L428 372 C415 330 400 310 380 308 C360 305 340 295 325 280 Z"
          fill="#ffffff"
          stroke="#18181b"
          strokeWidth="2.5"
        />

        {/* Torso & White Jacket */}
        <path
          d="M320 275 C310 240 325 210 365 205 C385 205 400 230 395 265 C380 275 350 280 320 275Z"
          fill="#ffffff"
          stroke="#18181b"
          strokeWidth="3"
        />

        {/* Head & Hair */}
        <circle cx="380" cy="180" r="15" fill="#ffffff" stroke="#18181b" strokeWidth="2.5" />
        {/* Hair (Black stylized) */}
        <path
          d="M365 178 C365 162 395 162 398 178 C398 184 394 186 390 186 C386 186 384 182 380 182 C376 182 372 186 368 186 C364 186 365 182 365 178Z"
          fill="#18181b"
        />
        {/* Smile & Eye */}
        <circle cx="386" cy="180" r="1.5" fill="#18181b" />
        <path d="M386 185 Q389 188 392 185" stroke="#18181b" strokeWidth="1.5" fill="none" strokeLinecap="round" />

        {/* Left Arm resting on Laptop */}
        <path
          d="M375 225 C390 235 410 235 420 230"
          stroke="#18181b"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="422" cy="230" r="4.5" fill="#ffffff" stroke="#18181b" strokeWidth="2" />

        {/* Right Arm touching chin / thinking */}
        <path
          d="M350 225 C355 240 375 245 385 220"
          stroke="#18181b"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="385" cy="216" r="4.5" fill="#ffffff" stroke="#18181b" strokeWidth="2" />

        {/* Laptop (Black open laptop) */}
        <g>
          {/* Base */}
          <path d="M400 242 L455 238 L458 244 L403 248 Z" fill="#18181b" />
          {/* Screen (Angled open) */}
          <path d="M440 240 L458 195 L464 197 L446 242 Z" fill="#18181b" />
        </g>
      </g>

      {/* =========================================================
          STUDENT 2: WALKING IN FOREGROUND WITH PHONE & BACKPACK
         ========================================================= */}
      <g>
        {/* Legs Walking */}
        {/* Left Leg (Forward) */}
        <path
          d="M275 330 L285 390 L265 440"
          stroke="#18181b"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Left Pant */}
        <path
          d="M272 325 L288 385 L268 438 L255 435 L268 380 L258 325 Z"
          fill="#ffffff"
          stroke="#18181b"
          strokeWidth="2.5"
        />
        {/* Left Shoe */}
        <path d="M250 435 L272 438 C278 440 282 448 276 454 L244 454 C240 445 244 438 250 435Z" fill="#18181b" />

        {/* Right Leg (Back / Striding) */}
        <path
          d="M295 330 L310 385 L328 435"
          stroke="#18181b"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Right Pant */}
        <path
          d="M290 325 L312 380 L330 432 L318 435 L300 380 L280 325 Z"
          fill="#ffffff"
          stroke="#18181b"
          strokeWidth="2.5"
        />
        {/* Right Shoe */}
        <path d="M316 432 L334 435 C340 438 344 446 338 452 L308 452 C305 444 310 435 316 432Z" fill="#18181b" />

        {/* Backpack (Behind Back) */}
        <path
          d="M305 270 C318 275 325 300 320 320 C315 330 305 335 295 330 Z"
          fill="#ffffff"
          stroke="#18181b"
          strokeWidth="2.5"
        />

        {/* Torso & White Jacket */}
        <path
          d="M280 250 C270 280 268 310 270 335 C285 338 305 335 312 328 C315 305 310 275 300 250 Z"
          fill="#ffffff"
          stroke="#18181b"
          strokeWidth="3"
        />

        {/* Head & Hair */}
        <circle cx="295" cy="225" r="14" fill="#ffffff" stroke="#18181b" strokeWidth="2.5" />
        {/* Hair (Black messy cut) */}
        <path
          d="M282 222 C282 208 308 208 312 222 C312 228 308 230 304 230 C300 230 298 226 294 226 C290 226 288 230 284 230 C282 230 282 226 282 222Z"
          fill="#18181b"
        />
        {/* Smile & Eye */}
        <circle cx="289" cy="224" r="1.5" fill="#18181b" />
        <path d="M287 230 Q290 233 293 230" stroke="#18181b" strokeWidth="1.5" fill="none" strokeLinecap="round" />

        {/* Left Arm Holding Phone in Front */}
        <path
          d="M285 265 C275 285 260 295 240 285"
          stroke="#18181b"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="240" cy="285" r="4.5" fill="#ffffff" stroke="#18181b" strokeWidth="2" />
        {/* Smartphone */}
        <rect
          x="226"
          y="273"
          width="18"
          height="10"
          rx="2"
          transform="rotate(25 226 273)"
          fill="#18181b"
        />

        {/* Right Arm (Swinging down slightly) */}
        <path
          d="M302 265 C308 290 302 315 295 330"
          stroke="#18181b"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
      </g>
    </svg>
  );
}
