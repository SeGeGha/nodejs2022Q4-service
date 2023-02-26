import * as bcrypt from 'bcryptjs';

export const hash = (data: string, salt: number): Promise<string> => {
  return bcrypt.hash(data, salt);
};
