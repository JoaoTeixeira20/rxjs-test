import { PropsWithChildren, ReactElement } from "react";

const InputElement = ({
  label,
  onChange,
  value,
  children,
}: PropsWithChildren<{
  label: string;
  onChange: () => void;
  value: string;
}>): ReactElement => {

  return (
    <>
      <label>{label}</label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Type something..."
      />
      {children}
    </>
  );
};

export default InputElement;
