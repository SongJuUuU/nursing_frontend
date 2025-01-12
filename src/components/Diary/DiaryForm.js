import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function DiaryForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      if (image) {
        formData.append('image', image);
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/diary`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('일기 작성에 실패했습니다.');
      }

      setShowSuccess(true);
      
      setTimeout(() => {
        history.push('/');
      }, 3000);
    } catch (error) {
      console.error('일기 작성 에러:', error);
    }
  };

  return (
    <div className="diary-form">
      {showSuccess && (
        <div className="success-message">
          <span className="success-icon">✨</span>
          <p>소중한 순간이 저장되었습니다!</p>
          <span className="success-icon">✨</span>
        </div>
      )}
      <h2>오늘의 특별한 순간</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>제목</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            required
          />
        </div>
        <div className="form-group">
          <label>내용</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="오늘의 특별한 순간을 기록해보세요"
            required
          />
        </div>
        <div className="form-group">
          <label>사진</label>
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            accept="image/*"
          />
        </div>
        <button type="submit">
          순간을 기록하기
        </button>
      </form>
    </div>
  );
}

export default DiaryForm; 