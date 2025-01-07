import React, { useState } from 'react';
import axios from 'axios';
import { useHistory, Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
        email,
        password
      });

      localStorage.setItem('token', response.data.token);
      history.push('/');
    } catch (error) {
      const errorMessage = error.response?.data?.message || '로그인에 실패했습니다.';
      alert(errorMessage);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container login-container">
        <div className="auth-header">
          <h2>Welcome Back!</h2>
          <p className="auth-subtitle">우리 아이의 소중한 순간을 기록해보세요</p>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-floating">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일을 입력하세요"
              required
            />
            <label htmlFor="email">이메일</label>
            <div className="form-icon">📧</div>
          </div>
          <div className="form-floating">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              required
            />
            <label htmlFor="password">비밀번호</label>
            <div className="form-icon">🔒</div>
          </div>
          <button type="submit" className="auth-button">
            로그인
            <span className="button-icon">→</span>
          </button>
          <div className="auth-footer">
            <p>아직 계정이 없으신가요? <Link to="/register">회원가입</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login; 