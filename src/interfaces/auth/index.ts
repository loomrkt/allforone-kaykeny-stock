export default interface Auth {
  id: string;
  name?: string;
  firstName?: string;
  email: string;
  token?: string;
  refreshToken?: string;
}
