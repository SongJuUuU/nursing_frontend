import React, { useState } from 'react';
import axios from 'axios';
import { useHistory, Link } from 'react-router-dom';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [babyBirthday, setBabyBirthday] = useState('');
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'https://nurring-server-087b646efdc7.herokuapp.com/api/auth/register',
        {
          email,
          password
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          withCredentials: false
        }
      );
      console.log('회원가입 응답:', response.data);
      alert('회원가입이 완료되었습니다.');
      history.push('/login');
    } catch (error) {
      console.error('회원가입 에러:', error);
      const errorMessage = error.response?.data?.message || '회원가입에 실패했습니다.';
      alert(errorMessage);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h2>환영합니다!</h2>
          <p className="auth-subtitle">우리 아이의 특별한 순간을 기록해보세요</p>
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
          <div className="form-floating">
            <input
              type="date"
              id="babyBirthday"
              value={babyBirthday}
              onChange={(e) => setBabyBirthday(e.target.value)}
              required
              max={new Date().toISOString().split('T')[0]}
            />
            <label htmlFor="babyBirthday">아이의 생년월일</label>
            <div className="form-icon">👶</div>
          </div>
          <button type="submit" className="auth-button">
            회원가입
            <span className="button-icon">→</span>
          </button>
          <div className="auth-footer">
            <p>이미 계정이 있으신가요? <Link to="/login">로그인</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register; 