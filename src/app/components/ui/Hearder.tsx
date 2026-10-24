import React from "react";

interface HearderProps {
  className?: string;
}

const Hearder = ({ className = "" }: HearderProps) => {
  return (
    <div className={`w-full overflow-hidden md:hidden ${className}`.trim()}>
      <svg
        viewBox="0 0 376 135"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-58 block"
        preserveAspectRatio="none"
      >
        <path
          d="M373.768 119.516C165.415 159.501 430.18 -5.40686 3.2524 133.411C1.95952 133.832 0.5 132.912 0.5 131.552L0.5 0.5L375.5 0.5V117.534C375.5 118.491 374.708 119.336 373.768 119.516Z"
          fill="url(#paint0_linear_2010_1929)"
          stroke="#0000FF"
        />
        <defs>
          <linearGradient
            id="paint0_linear_2010_1929"
            x1="188"
            y1="0.5"
            x2="188"
            y2="134.308"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#0000FF" />
            <stop offset="1" stopColor="#000099" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default Hearder;
