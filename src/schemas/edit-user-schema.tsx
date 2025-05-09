import * as z from "zod";

export const schemaeditUser = z.object({
  nome: z.string().nonempty("Nome é obrigatório"),
  cpf: z
    .string()
    .nonempty("CPF é obrigatório")
    .refine(
      (value) => /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(value),
      "CPF inválido"
    ),
  telefone: z
    .string()
    .nonempty("Telefone é obrigatório")
    .refine(
      (value) => /^\(\d{2}\) \d{4,5}-\d{4}$/.test(value),
      "Telefone inválido"
    ),
  cep: z
    .string()
    .nonempty("CEP é obrigatório")
    .refine((value) => /^\d{5}-\d{3}$/.test(value), "CEP inválido"),
  endereco: z.string().nonempty("Endereço é obrigatório"),
  numero: z.string().nonempty("Número é obrigatório"),
  complemento: z.string().optional(),
  cidade: z.string().nonempty("Cidade é obrigatória"),
  estado: z.string().nonempty("Estado é obrigatório"),
  latitude: z.string().nonempty("Latitude é obrigatória"),
  longitude: z.string().nonempty("Longitude é obrigatória"),
  email: z
    .string()
    .nonempty("E-mail é obrigatório")
    .email("Formato de e-mail inválido"),
});
