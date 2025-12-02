import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '../lib/api';
import { createUserSchema } from '../lib/schemas';
import type { CreateUserFormData } from '../lib/schemas';
import { FormField, type FieldConfig } from './FormField';

// Field configuration
const fieldConfigs: FieldConfig[] = [
  { name: 'firstName', label: 'First Name', type: 'text', required: true, layout: 'grid' },
  { name: 'lastName', label: 'Last Name', type: 'text', required: true, layout: 'grid' },
  { name: 'email', label: 'Email', type: 'email', required: true, layout: 'full' },
  { name: 'phone', label: 'Phone', type: 'tel', required: false, layout: 'full' },
  { name: 'company', label: 'Company', type: 'text', required: false, layout: 'full' },
];

const UserForm = () => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
    },
  });

  const createUserMutation = useMutation({
    mutationFn: userApi.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      reset();
    },
  });

  const onSubmit = (data: CreateUserFormData) => {
    createUserMutation.mutate(data);
  };

  // Group fields by layout
  const gridFields = fieldConfigs.filter((field) => field.layout === 'grid');
  const fullWidthFields = fieldConfigs.filter((field) => field.layout === 'full');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {gridFields.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {gridFields.map((field) => (
            <FormField
              key={field.name}
              name={field.name}
              label={field.label}
              type={field.type}
              required={field.required}
              register={register}
              error={errors[field.name]}
            />
          ))}
        </div>
      )}

      {fullWidthFields.map((field) => (
        <FormField
          key={field.name}
          name={field.name}
          label={field.label}
          type={field.type}
          required={field.required}
          register={register}
          error={errors[field.name]}
        />
      ))}

      {createUserMutation.error && (
        <div className="rounded-md bg-red-900/30 border border-red-700/50 p-4">
          <div className="text-sm text-red-300">
            Error: {createUserMutation.error instanceof Error ? createUserMutation.error.message : 'An error occurred'}
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={createUserMutation.isPending || isSubmitting}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {createUserMutation.isPending || isSubmitting ? 'Submitting...' : 'Submit Information'}
      </button>
    </form>
  );
};

export default UserForm;