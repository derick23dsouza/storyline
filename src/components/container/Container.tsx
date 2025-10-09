import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export default function Container({ children, className = "" }: ContainerProps) {
  return (
    <div
      className={`max-w-7xl mx-auto px-6 md:px-16 lg:px-24 ${className}`}
    >
      {children}
    </div>
  );
}
