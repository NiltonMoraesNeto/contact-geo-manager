export const aplicarMascaraCPF = (valor: string): string => {
  return valor
    .replace(/\D/g, "")
    .slice(0, 11) // Limita o número de dígitos a 11
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
};

export const aplicarMascaraTelefone = (valor: string): string => {
  return valor
    .replace(/\D/g, "")
    .slice(0, 11) // Limita o número de dígitos a 11
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{4,5})(\d{4})$/, "$1-$2");
};

export const aplicarMascaraCEP = (valor: string): string => {
  return valor
    .replace(/\D/g, "")
    .slice(0, 8) // Limita o número de dígitos a 8
    .replace(/(\d{5})(\d{3})/, "$1-$2");
};