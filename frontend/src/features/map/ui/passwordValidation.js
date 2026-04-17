const SPECIAL_CHAR_REGEX = /[^A-Za-z0-9]/;

const PASSWORD_RULES = [
  {
    key: 'minLength',
    test: (value) => value.length >= 8
  },
  {
    key: 'hasUppercase',
    test: (value) => /[A-Z]/.test(value)
  },
  {
    key: 'hasLowercase',
    test: (value) => /[a-z]/.test(value)
  },
  {
    key: 'hasNumber',
    test: (value) => /[0-9]/.test(value)
  },
  {
    key: 'hasSpecial',
    test: (value) => SPECIAL_CHAR_REGEX.test(value)
  }
];

export function validatePassword(password, t = null) {
  const safePassword = typeof password === 'string' ? password : '';
  const rules = PASSWORD_RULES.map((rule) => ({
    key: rule.key,
    label: t ? t(`passwordRules.${rule.key}`) : rule.key,
    passed: rule.test(safePassword)
  }));

  return {
    rules,
    isValid: rules.every((rule) => rule.passed)
  };
}

export function passwordsMatch(password, confirmPassword) {
  return password === confirmPassword;
}
