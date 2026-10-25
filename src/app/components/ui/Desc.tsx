import React from 'react'

interface DescProps {
  children: React.ReactNode;
  className?: string;
}

const Desc = ({ children, className = '' }: DescProps) => {
  return (
    <p className={`text-sm md:text-base text-secondary-text ${className}`.trim()}>
      {children}
    </p>
  );
};

export default Desc