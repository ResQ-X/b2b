import React from "react";

type ButtonVariant = "orange" | "grey" | "black" | "transparent" | "link";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: React.ReactNode;
  className?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "orange",
  children,
  onClick,
  className = "",
  disabled = false,
  leftIcon,
  rightIcon,
  ...props
}) => {
  const baseClasses =
    "h-5 md:h-12 px-4 font-medium hover:bg-opacity-80 hover:scale-105 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed rounded-[10px] flex items-center justify-center gap-2";

  const variants = {
    orange:
      "bg-[#FF8500] text-[#FFFFFF] hover:bg-[#E67600] active:bg-[#CC6600]",
    grey: "bg-[#ABABAB] text-[#FFFFFF] hover:bg-[#999999] active:bg-[#888888]",
    black:
      "bg-[#242220] text-[#919191] border border-[#777777] hover:bg-[#333333] active:bg-[#1a1a1a]",
    transparent:
      "bg-transparent text-white hover:text-[#FF8500] hover:underline hover:decoration-[#FF8500] hover:underline-offset-2",
    link: "bg-transparent text-[#FF8500] hover:underline hover:decoration-[#FF8500] hover:underline-offset-2",
  };

  const buttonClasses = `${baseClasses} ${variants[variant]} ${className}`;

  return (
    <button
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {leftIcon && <span className="flex items-center">{leftIcon}</span>}
      <span>{children}</span>
      {rightIcon && <span className="flex items-center">{rightIcon}</span>}
    </button>
  );
};
