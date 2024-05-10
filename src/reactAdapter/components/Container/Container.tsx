import { PropsWithChildren, ReactElement } from 'react';

const Container = ({
  children,
  label,
}: PropsWithChildren<{ label: string }>): ReactElement => {
  return (
    <div style={{ border: '1px solid black', padding: '2px' }}>
      <p>container label: {label}</p>
      {children}
    </div>
  );
};

export default Container;
