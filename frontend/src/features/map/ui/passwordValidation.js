const SPECIAL_CHAR_REGEX = /[^A-Za-z0-9]/;

const PASSWORD_RULES = [
  {
    key: 'minLength',
    label: 'Vähintään 8 merkkiä',
    test: (value) => value.length >= 8
  },
  {
    key: 'hasUppercase',
    label: 'Sisältää ison kirjaimen',
    test: (value) => /[A-Z]/.test(value)
  },
  {
    key: 'hasLowercase',
    label: 'Sisältää pienen kirjaimen',
    test: (value) => /[a-z]/.test(value)
  },
  {
    key: 'hasNumber',
    label: 'Sisältää numeron',
    test: (value) => /[0-9]/.test(value)
  },
  {
    key: 'hasSpecial',
    label: 'Sisältää erikoismerkin',
    test: (value) => SPECIAL_CHAR_REGEX.test(value)
  }
];

export function validatePassword(password) {
  const safePassword = typeof password === 'string' ? password : '';
  const rules = PASSWORD_RULES.map((rule) => ({
    key: rule.key,
    label: rule.label,
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
