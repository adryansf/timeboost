export const validationMessages = {
  IsEmail: (fieldName: string) => `O campo ${fieldName} deve ser um email.`,
  IsString: (fieldName: string) => `O campo ${fieldName} deve ser uma string.`,
  MinLength: (fieldName: string, minLength: number) =>
    `O campo ${fieldName} deve ter no mínimo ${minLength} caracteres.`,
  IsUUID: (fieldName: string) => `O campo ${fieldName} deve ser um UUID.`,
  IsNumber: (fieldName: string) => `O campo ${fieldName} deve ser um número.`,
  IsInt: (fieldName: string) => `O campo ${fieldName} deve ser um inteiro.`,
  IsPositive: (fieldName: string) =>
    `O campo ${fieldName} deve ser um valor positivo.`,
};
