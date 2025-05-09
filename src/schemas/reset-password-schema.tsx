import * as z from "zod";

export const schemaResetPassword = z.object({
  email: z.string().email({ message: "Email é obrigatório" }),
});
