import React from 'react';
import { Link, useHistory } from 'react-router-dom';

function Navigation() {
  const history = useHistory();
  const isLoggedIn = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    history.push('/login');
  };

  return (
    <nav className="navigation">
      <div className="nav-brand">
        <Link to="/">
          <span className="brand-icon">👶</span>
          우리아이
        </Link>
      </div>
      <div className="nav-links">
        {isLoggedIn ? (
          <>
            <Link to="/" className="nav-link">
              <span className="nav-icon">🏠</span>
              홈
            </Link>
            <Link to="/create-diary" className="nav-link">
              <span className="nav-icon">✏️</span>
              일기쓰기
            </Link>
            <button onClick={handleLogout} className="nav-button">
              <span className="nav-icon">👋</span>
              로그아웃
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">
              <span className="nav-icon">🔑</span>
              로그인
            </Link>
            <Link to="/register" className="nav-link highlight">
              <span className="nav-icon">✨</span>
              회원가입
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navigation; 