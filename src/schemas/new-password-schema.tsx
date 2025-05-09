import * as z from "zod";

export const schemaNewPassword = z
  .object({
    newPassword: z
      .string()
      .min(6, { message: "A nova senha deve ter pelo menos 6 caracteres" }),
    newPasswordConfirmation: z.string().min(6, {
      message: "A confirmação da nova senha deve ter pelo menos 6 caracteres",
    }),
  })
  .refine((data) => data.newPassword === data.newPasswordConfirmation, {
    message: "As senhas não coincidem",
    path: ["newPasswordConfirmation"],
  });
