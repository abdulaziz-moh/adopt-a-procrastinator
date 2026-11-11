import { useId } from "react";

export default function PetCharacter({
  character = "mochi",
  level = 2,
  mood = "happy",
  equipped,
  egg = false,
  celebrate = false,
  className = "",
}) {
  const gradient = useId().replace(/:/g, "");
  const isEgg = egg || level === 1;
  const colors = {
    mochi: ["#F2EAFC", "#CCB8E9", "#A18ABA"],
    byte: ["#D4EDCB", "#99C998", "#6B9C73"],
    procrastino: ["#CBB9F1", "#A28AC9", "#7B659E"],
  }[character];
  const sleepy = mood === "sleepy" || character === "procrastino";
  return (
    <svg
      viewBox="0 0 360 330"
      className={`pet-character ${celebrate ? "celebrate" : ""} ${className}`}
      role="img"
      aria-label={`${character === "byte" ? "Green monster" : character === "mochi" ? "Fluffy lavender creature" : "Sleepy purple creature"}${isEgg ? " in a spotted egg" : ""}${equipped ? ` wearing a ${equipped}` : ""}`}
    >
      <defs>
        <linearGradient id={gradient} x1="0" y1="0" x2="0.7" y2="1">
          <stop stopColor={colors[0]} />
          <stop offset="1" stopColor={colors[1]} />
        </linearGradient>
      </defs>
      <ellipse
        cx="180"
        cy="293"
        rx="90"
        ry="13"
        fill="#76608B"
        opacity=".12"
        className="pet-shadow"
      />
      <g className={`pet-body ${mood === "sleepy" ? "pet-sleepy" : ""}`}>
        {!isEgg && (
          <>
            {character === "byte" ? (
              <>
                <path
                  d="M116 127Q90 79 123 76L147 113M213 110Q242 67 250 96L244 140"
                  fill={colors[1]}
                  stroke={colors[2]}
                  strokeWidth="3"
                  strokeLinejoin="round"
                />
                <path
                  d="M259 230q47-23 32-52-1 31-38 28"
                  fill={colors[1]}
                  stroke={colors[2]}
                  strokeWidth="3"
                />
              </>
            ) : character === "mochi" ? (
              <>
                <path
                  d="M112 141Q81 112 103 99q17-8 34 19M217 120q23-44 40-22 16 20-10 51"
                  fill={colors[0]}
                  stroke={colors[2]}
                  strokeWidth="3"
                />
              </>
            ) : (
              <>
                <path
                  d="M118 124q-15-53 3-52 17 6 29 37M215 111q26-46 36-27 9 18-9 57"
                  fill={colors[1]}
                  stroke={colors[2]}
                  strokeWidth="3"
                />
              </>
            )}
            <ellipse
              cx="124"
              cy="274"
              rx="27"
              ry="13"
              fill={colors[1]}
              stroke={colors[2]}
              strokeWidth="3"
            />
            <ellipse
              cx="230"
              cy="274"
              rx="27"
              ry="13"
              fill={colors[1]}
              stroke={colors[2]}
              strokeWidth="3"
            />
            <path
              d={
                character === "mochi"
                  ? "M91 222C61 182 98 125 127 120C148 91 199 91 221 119C261 116 292 178 266 215C275 254 238 278 206 271C172 285 130 277 114 266C83 270 72 241 91 222Z"
                  : character === "byte"
                    ? "M95 217C83 165 101 117 137 108C170 93 220 103 243 135C265 163 278 220 250 250C224 279 121 280 101 251Z"
                    : "M96 223C89 165 106 123 139 112C176 93 227 108 246 139C264 172 277 223 251 252C223 276 130 279 105 252Z"
              }
              fill={`url(#${gradient})`}
              stroke={colors[2]}
              strokeWidth="3"
            />
            <ellipse
              cx="180"
              cy="237"
              rx="51"
              ry="27"
              fill={colors[0]}
              opacity=".55"
            />
            <path
              d="M107 208q-16 9-10 22M252 207q16 10 10 22"
              fill="none"
              stroke={colors[2]}
              strokeWidth="3"
              strokeLinecap="round"
            />
          </>
        )}
        {isEgg && (
          <>
            <path
              d="M85 213C85 145 139 71 180 72C222 73 275 145 275 213C275 307 85 307 85 213Z"
              fill={`url(#${gradient})`}
              stroke={colors[2]}
              strokeWidth="3"
            />
            <path
              d="M88 214l23-14 20 11 20-16 24 14 23-13 22 14 21-10 31 18"
              fill="none"
              stroke={colors[2]}
              strokeWidth="3"
              opacity=".3"
            />
            <ellipse
              cx="134"
              cy="137"
              rx="12"
              ry="16"
              transform="rotate(30 134 137)"
              fill={colors[1]}
            />
            <ellipse
              cx="221"
              cy="151"
              rx="10"
              ry="14"
              transform="rotate(-24 221 151)"
              fill={colors[1]}
            />
            <ellipse
              cx="145"
              cy="252"
              rx="14"
              ry="10"
              fill={colors[0]}
              opacity=".8"
            />
            <ellipse
              cx="231"
              cy="238"
              rx="10"
              ry="14"
              fill={colors[0]}
              opacity=".7"
            />
            <path
              d="M158 94q14-11 23-8"
              fill="none"
              stroke="white"
              strokeWidth="7"
              strokeLinecap="round"
              opacity=".65"
            />
          </>
        )}
        <g className="pet-eyes">
          {sleepy ? (
            <>
              <path
                d="M139 180q9 6 18 0M204 180q9 6 18 0"
                fill="none"
                stroke="#403446"
                strokeWidth="5"
                strokeLinecap="round"
              />
            </>
          ) : (
            <>
              <ellipse cx="148" cy="179" rx="7" ry="10" fill="#403446" />
              <ellipse cx="213" cy="179" rx="7" ry="10" fill="#403446" />
              <circle cx="150" cy="176" r="2.5" fill="white" />
              <circle cx="215" cy="176" r="2.5" fill="white" />
            </>
          )}
        </g>
        <ellipse cx="128" cy="197" rx="13" ry="7" fill="#F3ADBA" opacity=".7" />
        <ellipse cx="232" cy="197" rx="13" ry="7" fill="#F3ADBA" opacity=".7" />
        {mood === "excited" || celebrate ? (
          <path
            d="M169 194q12 0 24 0-2 23-13 20-9-2-11-20"
            fill="#8C5B76"
            stroke="#403446"
            strokeWidth="2.5"
          />
        ) : (
          <path
            d="M171 198q9 10 19 0"
            fill="none"
            stroke="#403446"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        )}
        {!isEgg && level >= 3 && (
          <>
            <path
              d="M177 107q-12-25 5-28 15 3 1 28"
              fill="#A2CBA3"
              stroke="#6C9C77"
              strokeWidth="2.5"
            />
            <path
              d="M177 107q17-28 28-16-1 17-23 18"
              fill="#BFE0B0"
              stroke="#6C9C77"
              strokeWidth="2.5"
            />
          </>
        )}
        {!isEgg && level >= 4 && (
          <path
            d="M140 232q37 18 77 0l-6 29-30 11-33-12Z"
            fill="#F7C780"
            stroke="#C69B64"
            strokeWidth="2"
          />
        )}
        {(equipped === "crown" ||
          (!isEgg && level >= 5 && equipped !== "hat")) && (
          <>
            <path
              d="M145 100l-10-39 25 17 20-28 20 28 25-17-10 39Z"
              fill="#F5CE72"
              stroke="#BD934D"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            <circle cx="180" cy="85" r="5" fill="#C49EDE" />
          </>
        )}
        {equipped === "hat" && (
          <>
            <path
              d="M147 111l35-72 33 72Z"
              fill="#F4B39D"
              stroke="#B88387"
              strokeWidth="3"
            />
            <path
              d="M160 87l33-26M151 105l52-31"
              stroke="#FDE5A0"
              strokeWidth="7"
            />
            <circle cx="182" cy="39" r="8" fill="#C0A4E5" />
          </>
        )}
        {mood === "sleepy" && (
          <text
            x="265"
            y="104"
            fill="#86709D"
            fontFamily="Nunito, sans-serif"
            fontSize="23"
            fontWeight="800"
            className="sleep-z"
          >
            z Z
          </text>
        )}
      </g>
      {celebrate && (
        <g className="pet-sparkles" fill="#BA91DF">
          <path d="M61 116l5 12 12 5-12 5-5 12-5-12-12-5 12-5ZM298 175l4 10 10 4-10 4-4 10-4-10-10-4 10-4Z" />
          <circle cx="285" cy="105" r="5" fill="#EDB58C" />
          <circle cx="75" cy="234" r="4" fill="#94C8A6" />
        </g>
      )}
    </svg>
  );
}
