export const reg = {
  email: /^([\w._-])*[a-zA-Z0-9]+([\w._-])*([a-zA-Z0-9])+([\w._-])*@[0-9a-z]([-_.]?[0-9a-z])*\.[a-z]{2,3}$/i,
  password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,20}$/,
  phone: /^01([0|1|6|7|8|9]?)([0-9]{8})$/,
};

export const validator = ({ value, type }: { value: string; type: 'email' | 'password' | 'phone' }) => {
  switch (type) {
    case 'email':
      return reg.email.test(value);
    case 'password':
      return reg.password.test(value);
    case 'phone':
      return reg.phone.test(value);
    default:
      return false;
  }
};
