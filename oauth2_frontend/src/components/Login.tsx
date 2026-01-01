import { FcGoogle } from 'react-icons/fc'; // Biểu tượng Google
import { FaGithub } from 'react-icons/fa'; // Biểu tượng Github
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { replace, useLocation, useNavigate } from 'react-router-dom';

function Login() {
  const { isAuthenticated } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const fromLocation = (location.state)?.from?.pathname || "/";
  useEffect(() => {
    if (isAuthenticated) {

      navigate(fromLocation, { replace: true });
    }
  }, [isAuthenticated]);



  // Hàm xử lý khi người dùng click vào nút Google
  const handleGoogleLogin = () => {
    console.log('Bắt đầu quá trình đăng nhập với Google...');
    // Thêm logic OAuth 2.0 ở đây, ví dụ:
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';

  };
  // Hàm xử lý khi người dùng click vào nút Github
  const handleGithubLogin = () => {
    console.log('Bắt đầu quá trình đăng nhập với Github...');
    // Thêm logic OAuth 2.0 ở đây, ví dụ:
    // window.location.href = 'URL của Github OAuth';
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm text-center">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Đăng nhập</h2>
        <p className="text-gray-600 mb-6">Sử dụng tài khoản của bạn để tiếp tục.</p>

        {/* Nút Đăng nhập với Google */}
        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center w-full px-4 py-3 mb-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors duration-200"
        >
          <FcGoogle className="w-5 h-5 mr-3" />
          Đăng nhập với Google
        </button>

        {/* Nút Đăng nhập với Github */}
        <button
          onClick={handleGithubLogin}
          className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white bg-gray-900 border border-transparent rounded-lg shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 transition-colors duration-200"
        >
          <FaGithub className="w-5 h-5 mr-3" />
          Đăng nhập với Github
        </button>
      </div>
    </div>
  );
}

export default Login;