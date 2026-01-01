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

  /**
   * Opens an OAuth login popup and waits for JWT token from popup message
   * @param url - The OAuth provider URL
   * @returns Promise resolving to JWT token
   */
  const openOAuthPopup = (url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const left = window.screen.width / 2 - POPUP_WIDTH / 2;
      const top = window.screen.height / 2 - POPUP_HEIGHT / 2;

      const popup = window.open(
        url,
        'OAuth2 Login',
        `width=${POPUP_WIDTH},height=${POPUP_HEIGHT},top=${top},left=${left}`
      );

      if (!popup) {
        reject(new Error('Failed to open popup. Please check if popups are blocked.'));
        return;
      }

      let isResolved = false;

      // Listen for message from popup
      const messageListener = (event: MessageEvent<OAuthPopupMessage>): void => {
        if (event.origin !== OAUTH_ORIGIN) {
          return;
        }

        if (event.data.token) {
          isResolved = true;
          console.log('Received token from popup:', event.data.token);
          resolve(event.data.token);
          cleanup();
  
        } else if (event.data.error) {
          isResolved = true;
          reject(new Error(event.data.error));
          cleanup();
          try {
            popup.close();
          } catch (e) {
            // Popup might already be closed
          }
        }
      };

      // Timeout after 1 minutes
      const timeout = setTimeout(() => {
        if (!isResolved) {
          cleanup();
          reject(new Error('OAuth login timed out. Please try again.'));
        }
      }, 60*1000);

      const cleanup = () => {
        clearTimeout(timeout);
        window.removeEventListener('message', messageListener);
      };

      window.addEventListener('message', messageListener);
    });
  };

  const handleGoogleLogin = async (): Promise<void> => {
    try {
      console.log('Bắt đầu quá trình đăng nhập với Google...');
      const token = await openOAuthPopup(GOOGLE_OAUTH_URL);
      localStorage.setItem('jwt', token);
      console.log('Đăng nhập thành công với Google');

    } catch (err) {
      console.error('Google login failed:', err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const handleGithubLogin = async (): Promise<void> => {
    try {
      console.log('Bắt đầu quá trình đăng nhập với Github...');
      const token = await openOAuthPopup(GITHUB_OAUTH_URL);
      localStorage.setItem('jwt', token);
      console.log('Đăng nhập thành công với Github');
    } catch (err) {
      console.error('Github login failed:', err instanceof Error ? err.message : 'Unknown error');
    }
  };

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
