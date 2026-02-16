import { z } from 'zod';

export const registerSchema = z.object({
  firstName: z.string().min(2, 'Imię jest za krótkie'),
  lastName: z.string().min(2, 'Nazwisko jest za krótkie'),
  email: z.string().email('Niepoprawny format email'),
  password: z.string().min(6, 'Hasło musi mieć min. 6 znaków'),
  repassword: z.string(),
}).refine((data) => data.password === data.repassword, {
  message: "Hasła nie są identyczne",
  path: ["repassword"], 
});

// Eksportujemy typ wyciągnięty ze schematu (inferencja)
export type RegisterFormData = z.infer<typeof registerSchema>;