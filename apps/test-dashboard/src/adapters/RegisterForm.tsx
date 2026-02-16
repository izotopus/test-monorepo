import { h } from 'preact';
import '@shared/ui/components/register-form/register-form';
import type { RegisterFormData } from '@shared/types/schemas/register';

interface RegisterFormProps {
  handleFormChange: (data: RegisterFormData) => void;
  class?: string;
  id?: string;
}

const RegisterFormComponent = ({ handleFormChange, ...rest }: RegisterFormProps) => {
  return (
    <register-form
      {...rest}
      onform-change={(e: any) => handleFormChange(e.detail)}
    />
  )
};

export default RegisterFormComponent;