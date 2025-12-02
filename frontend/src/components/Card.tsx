import type { ReactNode } from 'react';

type CardProps = {
  title: string;
  children: ReactNode;
};

const cardClassName = 'bg-slate-800/50 backdrop-blur-sm rounded-lg shadow-xl border border-slate-700/50 p-6';
const titleClassName = 'text-2xl font-semibold text-white mb-4';

export const Card = ({ title, children }: CardProps) => (
  <div className={cardClassName}>
    <h2 className={titleClassName}>{title}</h2>
    {children}
  </div>
);

