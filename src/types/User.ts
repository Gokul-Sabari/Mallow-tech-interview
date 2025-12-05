


export interface User {
  id?: number;
  email?: string;
  first_name?: string;
  last_name?: string;
  avatar?: string;
  name?: string;
  job?: string;
}


export interface UserPayload {
  email: string;
  first_name: string;
  last_name: string;
  avatar?: string;
}
