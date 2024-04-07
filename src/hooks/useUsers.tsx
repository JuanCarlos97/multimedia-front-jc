import { useState } from 'react'
import API from '../apis/api';
import { User } from '../interfaces/User';
import { useUser } from '../context/UserContext';

export const useUsers = () => {
  const { login } = useUser();
  const [users, setUsers] = useState<User[]>([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');

  const getUsers = async () => {
    API.get('/users')
      .then((response) => setUsers(response.data))
      .catch((error) => console.log(error));
  }

  const loginUser = async () => {
    try {
      const response = await API.post('/users/login', { email, password });
      login(response.data.user, response.data.token);
      return { response: true, message: null }
    } catch (err: any) {
      return { response: false, message: err.response.data.msg || 'Error desconocido' };
    }
  }

  const registerUser = async () => {
    if (password !== confirmPassword) {
      return { response: true, message: 'Las contraseñas no coinciden' }
    }

    try {
      const response = await API.post('/users/register', { username, email, password, role: role === 'Creador' ? 'creator' : 'reader' });
      login(response.data.user, response.data.token);
      return { response: true, message: null }
    } catch (err: any) {
      return { response: false, message: err.response.data.msg || 'Error desconocido' };
    }
  }

  return {
    getUsers,
    users,
    loginUser,
    registerUser,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    username,
    setUsername,
    role,
    setRole
  }
}
