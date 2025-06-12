import type { ButtonHTMLAttributes } from "react";

export const Button = ({ className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    className={`bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition ${className}`}
    {...props}
  />
);
