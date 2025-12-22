export type User = {
  id: string;
  lastName: string;
  firstName?: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
  isDeleted?: boolean;
  passwordHash?: string;
  refreshToken?: string;
  token?: string;
  roleId?: string;
  depotId?: string;
};
