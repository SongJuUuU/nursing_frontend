import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navigation from './components/Navigation';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import DiaryList from './components/Diary/DiaryList';
import DiaryForm from './components/Diary/DiaryForm';
import './styles/main.css';

function App() {
  return (
    <Router basename="/">
      <div className="App">
        <div className="background-decoration">
          <div className="wave wave-1"></div>
          <div className="wave wave-2"></div>
          <div className="wave wave-3"></div>
        </div>
        <Navigation />
        <Switch>
          <Route exact path="/" component={DiaryList} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/create-diary" component={DiaryForm} />
        </Switch>
      </div>
    </Router>
  );
}

export default App; 