import React from 'react'

interface TitleProps {
  children: React.ReactNode;
  className?: string;
}

const Title = ({ children, className = '' }: TitleProps) => {
  return (
    <h1 className={`text-2xl md:text-3xl font-bold text-primary-dark ${className}`.trim()}>
      {/* <span className="inline-block bg-(image:--button-gradient) bg-clip-text text-transparent"> */}
        {children}
      {/* </span> */}
    </h1>
  );
};

export default Title