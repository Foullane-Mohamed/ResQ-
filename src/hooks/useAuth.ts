import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './redux';
import { authService } from '../services/authService';
import { setCredentials, logout, setLoading } from '../store/authSlice';
import type { LoginCredentials, RegisterCredentials } from '../services/authService';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const authState = useAppSelector((state) => state.auth);

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: (data) => {
      dispatch(setCredentials(data));
      dispatch(setLoading(false));
      navigate('/dashboard');
    },
    onError: (error) => {
      dispatch(setLoading(false));
      throw error;
    },
  });

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: (data) => {
      dispatch(setCredentials(data));
      dispatch(setLoading(false));
      navigate('/dashboard');
    },
    onError: (error) => {
      dispatch(setLoading(false));
      throw error;
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      dispatch(logout());
      queryClient.clear();
      navigate('/login');
    },
  });

  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: authService.getCurrentUser,
    enabled: !!authState.token,
  });

  return {
    ...authState,
    user: currentUser || authState.user,
    login: (credentials: LoginCredentials) => loginMutation.mutate(credentials),
    register: (credentials: RegisterCredentials) => registerMutation.mutate(credentials),
    logout: () => logoutMutation.mutate(),
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
    isLogoutLoading: logoutMutation.isPending,
    loginError: loginMutation.error?.message,
    registerError: registerMutation.error?.message,
  };
};
