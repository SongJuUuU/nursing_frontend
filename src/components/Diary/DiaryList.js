import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';
import { differenceInDays } from 'date-fns';

function DiaryList() {
  const [diaries, setDiaries] = useState([]);
  const [showList, setShowList] = useState(false);
  const [selectedDiary, setSelectedDiary] = useState(null);
  const [chatInput, setChatInput] = useState('');
  const [chatResponse, setChatResponse] = useState(null);
  const [babyAge, setBabyAge] = useState(null);
  const [developmentInfo, setDevelopmentInfo] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [savedAnalyses, setSavedAnalyses] = useState([]);
  const [showSavedAnalyses, setShowSavedAnalyses] = useState(false);
  const history = useHistory();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      history.push('/login');
      return;
    }

    // 아기 생일 정보 가져오기
    const fetchBabyInfo = async () => {
      try {
        // 임시로 로컬 스토리지에서 생일 정보를 가져옴
        const babyBirthday = localStorage.getItem('babyBirthday');
        
        if (!babyBirthday) {
          throw new Error('생일 정보가 없습니다.');
        }

        const ageInDays = differenceInDays(new Date(), new Date(babyBirthday));
        setBabyAge(ageInDays);
        fetchDevelopmentInfo(ageInDays);
      } catch (error) {
        console.error('아기 정보 조회 상세 에러:', {
          message: error.message,
          stack: error.stack
        });
        setDevelopmentInfo({
          title: "아기 정보",
          description: "아기의 정보를 불러오는데 실패했습니다. 회원가입 시 입력한 생일 정보를 확인해주세요.",
          suggestion: "새로운 순간을 기록해볼까요?"
        });
      }
    };

    fetchBabyInfo();
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
      // 디버깅: 요청 전 상태 확인
      console.log('=== 챗봇 요청 시작 ===');
      console.log('입력된 질문:', chatInput);
      console.log('요청 URL:', `${process.env.REACT_APP_API_URL}/api/chat`);

      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/chat`, {
        question: chatInput
      });
      
      // 디버깅: 응답 확인
      console.log('챗봇 응답 데이터:', response.data);
      
      setChatResponse({
        text: response.data.answer,
        loading: false
      });
      setChatInput('');
    } catch (error) {
      // 디버깅: 에러 상세 정보
      console.error('챗봇 에러:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      
      setChatResponse({
        text: "죄송합니다. 답변을 생성하는 중 문제가 발생했습니다.",
        loading: false,
        error: true
      });
    }
  };

  // 아이 발달 정보를 ChatGPT API로 요청
  const fetchDevelopmentInfo = async (ageInDays) => {
    try {
      const months = Math.floor(ageInDays / 30);
      const prompt = `아기가 생후 ${months}개월입니다. 이 시기 아기의 발달 특징과 부모가 기록하면 좋을 만한 것들을 알려주세요. 다음 형식으로 답변해주세요: {"title": "현재 시기", "description": "발달 특징", "suggestion": "기록 제안"}`;

      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/chat`, {
        question: prompt
      });

      // API 응답을 JSON으로 파싱
      const developmentData = JSON.parse(response.data.answer);
      setDevelopmentInfo(developmentData);
    } catch (error) {
      console.error('발달 정보 조회 에러:', error);
      // 에러 시 기본 정보 설정
      setDevelopmentInfo({
        title: `생후 ${Math.floor(ageInDays / 30)}개월`,
        description: "아기의 발달 정보를 불러오는데 실패했습니다.",
        suggestion: "오늘의 특별한 순간을 기록해볼까요?"
      });
    }
  };

  // AI 분석 함수 추가
  const analyzeDiaryContent = async (content) => {
    setIsAnalyzing(true);
    try {
      const prompt = `다음은 아이의 일기 내용입니다. 아이의 발달 상태, 행동 특징, 성격 등을 분석해주시고, 부모님께 조언도 해주세요: "${content}"`;
      
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/chat`, {
        question: prompt
      });

      setAiAnalysis(response.data.answer);
    } catch (error) {
      console.error('AI 분석 에러:', error);
      setAiAnalysis('분석에 실패했습니다.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 저장된 분석 결과 불러오기
  useEffect(() => {
    const saved = localStorage.getItem('savedAnalyses');
    if (saved) {
      setSavedAnalyses(JSON.parse(saved));
    }
  }, []);

  // 분석 결과 저장 함수
  const handleSaveAnalysis = () => {
    const newAnalysis = {
      id: Date.now(),
      date: new Date().toISOString(),
      diaryTitle: selectedDiary.title,
      content: aiAnalysis,
      liked: null // null, true, false
    };
    
    const updatedAnalyses = [...savedAnalyses, newAnalysis];
    localStorage.setItem('savedAnalyses', JSON.stringify(updatedAnalyses));
    setSavedAnalyses(updatedAnalyses);
    alert('분석 결과가 저장되었습니다!');
  };

  // 좋아요/싫어요 처리 함수
  const handleFeedback = (analysisId, isLiked) => {
    const updatedAnalyses = savedAnalyses.map(analysis => {
      if (analysis.id === analysisId) {
        return { ...analysis, liked: isLiked };
      }
      return analysis;
    });
    localStorage.setItem('savedAnalyses', JSON.stringify(updatedAnalyses));
    setSavedAnalyses(updatedAnalyses);
  };

  if (!showList) {
    return (
      <div className="main-container">
        <div className="main-content">
          {developmentInfo && !showSavedAnalyses && (
            <div className="development-card">
              <div className="age-badge">{developmentInfo.title}</div>
              <div className="development-info">
                <h3>우리 아이의 발달 특징</h3>
                <p>{developmentInfo.description}</p>
                <div className="suggestion-box">
                  <span className="suggestion-icon">✏️</span>
                  <p>{developmentInfo.suggestion}</p>
                </div>
                <Link to="/create-diary" className="record-button">
                  지금 기록하기
                </Link>
              </div>
            </div>
          )}
          
          {!showSavedAnalyses && (
            <div className="main-buttons">
              <Link to="/create-diary" className="main-button">
                <div className="button-icon">✏️</div>
                <div className="button-text-container">
                  <div className="button-text">오늘 기록하기</div>
                  <div className="button-description">새로운 순간을 기록해보세요</div>
                </div>
              </Link>
              <div className="main-button" onClick={() => setShowList(true)}>
                <div className="button-icon">📖</div>
                <div className="button-text-container">
                  <div className="button-text">다시 살펴보기</div>
                  <div className="button-description">소중한 순간들을 다시 만나보세요</div>
                </div>
              </div>
              <div className="main-button" onClick={() => setShowSavedAnalyses(true)}>
                <div className="button-icon">🤖</div>
                <div className="button-text-container">
                  <div className="button-text">AI 분석 모아보기</div>
                  <div className="button-description">AI가 분석한 우리 아이의 특징들을 모아보세요</div>
                </div>
              </div>
            </div>
          )}

          {showSavedAnalyses && (
            <div className="saved-analyses">
              <h2>저장된 AI 분석</h2>
              <div className="analyses-grid">
                {savedAnalyses.map(analysis => (
                  <div key={analysis.id} className="analysis-card">
                    <div className="analysis-card-header">
                      <h3>{analysis.diaryTitle}</h3>
                      <span className="analysis-date">
                        {new Date(analysis.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p>{analysis.content}</p>
                    <div className="feedback-status">
                      {analysis.liked === true && <span className="liked">👍 도움됐어요</span>}
                      {analysis.liked === false && <span className="disliked">👎 별로예요</span>}
                    </div>
                  </div>
                ))}
              </div>
              <button className="back-button" onClick={() => setShowSavedAnalyses(false)}>
                돌아가기
              </button>
            </div>
          )}

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
                <div className="popup-date">{new Date(selectedDiary.date).toLocaleDateString()}</div>
                <p>{selectedDiary.content}</p>
                
                <button 
                  className="analyze-button"
                  onClick={() => analyzeDiaryContent(selectedDiary.content)}
                  disabled={isAnalyzing}
                >
                  <span className="analyze-icon">✨</span>
                  AI 분석하기
                </button>

                {isAnalyzing && (
                  <div className="analysis-loading">
                    <div className="loading-spinner"></div>
                    <p>아이의 특징을 분석하고 있어요...</p>
                  </div>
                )}

                {aiAnalysis && !isAnalyzing && (
                  <div className="ai-analysis">
                    <div className="analysis-header">
                      <span className="analysis-icon">🤖</span>
                      <h4>AI의 분석</h4>
                    </div>
                    <p>{aiAnalysis}</p>
                    <div className="analysis-actions">
                      <button 
                        className="feedback-button like"
                        onClick={() => handleFeedback(selectedDiary._id, true)}
                      >
                        👍 좋아요
                      </button>
                      <button 
                        className="feedback-button dislike"
                        onClick={() => handleFeedback(selectedDiary._id, false)}
                      >
                        👎 별로에요
                      </button>
                      <button 
                        className="save-button"
                        onClick={handleSaveAnalysis}
                      >
                        💾 저장하기
                      </button>
                    </div>
                  </div>
                )}
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