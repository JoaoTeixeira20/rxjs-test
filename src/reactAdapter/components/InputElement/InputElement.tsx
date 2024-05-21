import { PropsWithChildren, ReactElement } from 'react';

const InputElement = ({
  label,
  onFocus2 = () => console.log('onFocus2'),
  onBlur2 = () => console.log('onBlur2'),
  onChange2 = () => console.log('onChange2'),
  value,
  children,
}: PropsWithChildren<{
  label: string;
  onFocus2: () => void;
  onBlur2: () => void;
  onChange2: () => void;
  value: string;
}>): ReactElement => {
  return (
    <>
      <label>{label}</label>
      <input
        type='text'
        onBlur={onBlur2}
        onChange={onChange2}
        onFocus={onFocus2}
        placeholder='Type something...'
        value={value}
      />
      {children}
    </>
  );
};

export default InputElement;
