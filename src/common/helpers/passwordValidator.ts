export const passwordValidator = (password: string) => {
  const passwordValidator = new RegExp(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
  );

  if (passwordValidator.test(password)) {
    return {
      passed: true,
    };
  }

  const hasLowercaseLetter = new RegExp(/(?=.*?[a-z])/).test(password);
  const hasUppercaseLetter = new RegExp(/(?=.*?[A-Z])/).test(password);
  const hasNumber = new RegExp(/(?=.*?[0-9])/).test(password);
  const hasSpecialCharacter = new RegExp(/(?=.*?[#?!@$%^&*-])/).test(password);
  const hasMoreThan8Length = new RegExp(/.{8,}/).test(password);
  const hasLessThan20Length = password.toString().length < 20;

  const errors = [];

  if (!hasLowercaseLetter) errors.push('uma letra minúscula');
  if (!hasUppercaseLetter) errors.push('uma letra maiúscula');
  if (!hasNumber) errors.push('um número');
  if (!hasSpecialCharacter) errors.push('um caractere especial');
  if (!hasMoreThan8Length) errors.push('mais de 8 caracteres');
  if (!hasLessThan20Length) errors.push('menos de 20 caracteres');

  return {
    passed: false,
    error: `A senha precisa conter pelo menos: ${errors.join(', ')}`,
  };
};
