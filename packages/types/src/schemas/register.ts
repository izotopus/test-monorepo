import { z } from 'zod';

const req = {
  required_error: "Pole jest wymagane",
};

export const registerSchema = z.object({
  firstName: z.string(req).min(2, 'Imię jest za krótkie'),
  lastName: z.string(req).min(2, 'Nazwisko jest za krótkie'),
  email: z.string(req).email('Niepoprawny format email'),
  password: z.string(req).min(6, 'Hasło musi mieć min. 6 znaków'),
  repassword: z.string(req),
}).refine((data) => data.password === data.repassword, {
  message: "Hasła nie są identyczne",
  path: ["repassword"], 
});

export type RegisterFormData = z.infer<typeof registerSchema>;