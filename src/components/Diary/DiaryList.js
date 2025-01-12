import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';

function DiaryList() {
  const [diaries, setDiaries] = useState([]);
  const [showList, setShowList] = useState(false);
  const [selectedDiary, setSelectedDiary] = useState(null);
  const [chatInput, setChatInput] = useState('');
  const [chatResponse, setChatResponse] = useState(null);
  const history = useHistory();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      history.push('/login');
      return;
    }
    if (showList) {
      fetchDiaries();
    }
  }, [showList, history]);

  const fetchDiaries = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/diary`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('일기 목록을 불러오는데 실패했습니다.');
      }

      const data = await response.json();
      console.log('받은 일기 데이터:', data);
      setDiaries(data);
    } catch (error) {
      console.error('일기 목록 조회 에러:', error);
    }
  };

  const handleDiaryClick = (diary) => {
    setSelectedDiary(diary);
  };

  const handleClosePopup = () => {
    setSelectedDiary(null);
  };

  // 팝업 외부 클릭 시 닫기
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClosePopup();
    }
  };

  const handleChatSubmit = async () => {
    if (!chatInput.trim()) return;

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/chat`, {
        question: chatInput
      });
      
      setChatResponse({
        text: response.data.answer,
        loading: false
      });
      setChatInput('');
    } catch (error) {
      console.error('챗봇 응답 에러:', error);
      setChatResponse({
        text: "죄송합니다. 답변을 생성하는 중 문제가 발생했습니다.",
        loading: false,
        error: true
      });
    }
  };

  if (!showList) {
    return (
      <div className="main-container">
        <div className="main-buttons">
          <Link to="/create-diary" className="main-button">
            <div className="button-icon">✏️</div>
            <div className="button-text">오늘 기록하기</div>
            <div className="button-description">새로운 순간을 기록해보세요</div>
          </Link>
          <div className="main-button" onClick={() => setShowList(true)}>
            <div className="button-icon">📖</div>
            <div className="button-text">다시 살펴보기</div>
            <div className="button-description">소중한 순간들을 다시 만나보세요</div>
          </div>
        </div>

        <div className="chatbot-section">
          <div className="chatbot-container">
            <div className="chatbot-header">
              <span className="chatbot-icon">🤖</span>
              <h3>육아 도우미</h3>
            </div>
            <div className="chatbot-search">
              <input
                type="text"
                placeholder="육아에 대해 무엇이든 물어보세요!"
                className="chatbot-input"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit()}
              />
              <button className="chatbot-button" onClick={handleChatSubmit}>
                <span className="button-icon">💬</span>
                질문하기
              </button>
            </div>
            {chatResponse && (
              <div className={`chatbot-response ${chatResponse.loading ? 'loading' : ''} ${chatResponse.error ? 'error' : ''}`}>
                {chatResponse.loading ? (
                  <div className="loading-indicator">
                    <span>답변 생성 중</span>
                    <div className="loading-dots">
                      <span>.</span><span>.</span><span>.</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="response-icon">
                      {chatResponse.error ? '❌' : '💡'}
                    </div>
                    <p>{chatResponse.text}</p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="diary-list-container">
      <h2>우리 아이의 성장일기</h2>
      <div className="diary-grid">
        {diaries.map((diary) => (
          <div 
            key={diary._id} 
            className="diary-card"
            onClick={() => handleDiaryClick(diary)}
          >
            {diary.imageUrl && (
              <div className="diary-card-image">
                <img 
                  src={diary.imageUrl.replace(process.env.REACT_APP_API_URL, '')} 
                  alt="일기 이미지" 
                />
              </div>
            )}
            <div className="diary-card-content">
              <h3>{diary.title}</h3>
              <p className="diary-preview">{diary.content}</p>
              <div className="diary-date">
                {new Date(diary.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedDiary && (
        <div className="diary-popup-backdrop" onClick={handleBackdropClick}>
          <div className="diary-popup">
            <button className="popup-close" onClick={handleClosePopup}>×</button>
            <div className="popup-content">
              {selectedDiary.imageUrl && (
                <div className="popup-image">
                  <img 
                    src={selectedDiary.imageUrl.replace(process.env.REACT_APP_API_URL, '')}
                    alt="일기 이미지"
                  />
                </div>
              )}
              <div className="popup-text">
                <h2>{selectedDiary.title}</h2>
                <div className="popup-date">
                  {new Date(selectedDiary.createdAt).toLocaleDateString()}
                </div>
                <p>{selectedDiary.content}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <button className="back-button" onClick={() => setShowList(false)}>
        메인으로 돌아가기
      </button>
    </div>
  );
}

export default DiaryList; 