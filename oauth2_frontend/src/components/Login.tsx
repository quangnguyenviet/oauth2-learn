import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { useEffect } from 'react';
import type { FC } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';

// Constants
const POPUP_WIDTH = 500;
const POPUP_HEIGHT = 600;
const OAUTH_ORIGIN = 'http://localhost:8080';
const GOOGLE_OAUTH_URL = `${OAUTH_ORIGIN}/oauth2/authorization/google`;
const GITHUB_OAUTH_URL = `${OAUTH_ORIGIN}/oauth2/authorization/github`;

// Types
interface OAuthPopupMessage {
  token?: string;
  error?: string;
}

interface MessageEvent<T = any> extends Event {
  data: T;
  origin: string;
}

const Login: FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const fromLocation = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(fromLocation, { replace: true });
    }
  }, [isAuthenticated, navigate, fromLocation]);

  

  const handleGoogleLogin = (): void => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  const handleGithubLogin = (): void => {

  }
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm text-center">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Đăng nhập</h2>
        <p className="text-gray-600 mb-6">Sử dụng tài khoản của bạn để tiếp tục.</p>

        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center w-full px-4 py-3 mb-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors duration-200"
          aria-label="Login with Google"
        >
          <FcGoogle className="w-5 h-5 mr-3" />
          Đăng nhập với Google
        </button>

        <button
          onClick={handleGithubLogin}
          className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white bg-gray-900 border border-transparent rounded-lg shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 transition-colors duration-200"
          aria-label="Login with GitHub"
        >
          <FaGithub className="w-5 h-5 mr-3" />
          Đăng nhập với Github
        </button>
      </div>
    </div>
  );
};

export default Login;
