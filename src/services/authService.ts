import api from './api';
import { LoginFormValues } from '../lib/validators';

interface AuthResponse {
  accessToken: string;
  user: {
    id: number;
    email: string;
    name: string;
    role: string;
  };
}

export const loginUser = async (data: LoginFormValues) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {

      if (data.email === 'admin@resq.com' && data.password === '1234') {
        resolve({
          id: 1,
          name: 'Admin User',
          email: data.email,
          role: 'ADMIN',
        });
      } else {
        reject(new Error('Email ou mot de passe incorrect'));
      }
    }, 1000);
  });
};