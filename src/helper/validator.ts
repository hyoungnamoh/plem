export const reg = {
  email: /^[0-9a-z]([-_.]?[0-9a-z_])*@[0-9a-z]([-_.]?[0-9a-z])*\.[a-z]{2,3}$/i,
  password: /[a-zA-Z\\d`~!@#$%^&*()-_=+]{8,20}$/,
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
