import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    
    if (!accessToken) {
      toast.error('로그인이 필요합니다.');
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;