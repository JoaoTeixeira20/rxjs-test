import { PropsWithChildren, ReactElement } from "react";

const Box = (props: PropsWithChildren<{ name: string }>): ReactElement => {
  return (
    <div>
      <div>hello {props.name} this is a box</div>
      {props.children}
    </div>
  );
};

export default Box;
