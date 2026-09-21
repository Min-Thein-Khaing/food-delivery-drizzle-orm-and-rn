export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  RESTAURANT_OWNER = 'RESTAURANT_OWNER',
  DRIVER = 'DRIVER',
}

export const UserType = {
  id: String,
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  role: UserRole,
};

export interface HealthCheckResponse {
  status: string;
  timeStamp: Date;
}
