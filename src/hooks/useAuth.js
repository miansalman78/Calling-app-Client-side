import { useContext } from 'react';

// auth provider
import AuthContext from '../context/Auth';

// ===========================|| AUTH HOOKS ||=========================== //

const useAuth = () => useContext(AuthContext);

export default useAuth;
