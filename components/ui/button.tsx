// Button.tsx

import React, { ReactNode } from "react";

interface ButtonProps {
  bgcolor: string;
  icon: ReactNode;
  children: ReactNode;
  eventHandler?: () => void;
}

const Button: React.FC<ButtonProps> = ({
  bgcolor,
  icon,
  children,
  eventHandler = () => {},
}) => {
  return (
    <button
      className={`inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${bgcolor} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
      onClick={eventHandler}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
