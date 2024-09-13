import { FC, HTMLAttributes } from "react";

export const Card: FC<HTMLAttributes<HTMLDivElement>> = ({ children }) => {
  return <div className="card">{children}</div>;
};
