import { ReactNode } from 'react';

const Key = ({ children }: { children: ReactNode }) => (
  <span className="w-5 h-5 grid place-items-center border rounded aspect-square">{children}</span>
);

export default Key;