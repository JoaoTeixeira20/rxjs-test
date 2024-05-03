import { PropsWithChildren, ReactElement } from "react";

const Container = ({
  children,
  label,
}: PropsWithChildren<{ label: string }>): ReactElement => {
  return (
    <div>
      <p>container label: {label}</p>
      {children}
    </div>
  );
};

export default Container;
