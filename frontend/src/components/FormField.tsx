import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import type { CreateUserFormData } from '../lib/schemas';

// Field configuration type
export type FieldConfig = {
  name: keyof CreateUserFormData;
  label: string;
  type: string;
  required?: boolean;
  layout?: 'grid' | 'full';
};

// Common classNames extracted for DRY
const labelClassName = 'block text-sm font-medium text-gray-300';
const inputClassName = 'mt-1 block w-full rounded-md bg-slate-700/50 border border-slate-600 text-white placeholder-gray-400 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500';
const errorClassName = 'mt-1 text-sm text-red-400';

// FormField component props using FieldConfig
type FormFieldProps = FieldConfig & {
  register: UseFormRegister<CreateUserFormData>;
  error?: FieldErrors<CreateUserFormData>[keyof CreateUserFormData];
  className?: string;
};

export const FormField = ({ name, label, type, required, register, error, className }: FormFieldProps) => (
  <div className={className}>
    <label htmlFor={name} className={labelClassName}>
      {label} {required && '*'}
    </label>
    <input
      {...register(name)}
      type={type}
      id={name}
      className={inputClassName}
    />
    {error && (
      <p className={errorClassName}>{error.message}</p>
    )}
  </div>
);

