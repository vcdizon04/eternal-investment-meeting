import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import { Router } from 'react-router-dom';
import './App.scss';
import { UserProvider } from './contexts/user';
import LeftSidebar from './components/shared/left-sidebar';
import Header from './components/shared/header';
import Routes from './routes/Routes';
import history from './history';
import Cookies from 'js-cookie';

function App() {

  const userOnCookie = Cookies.getJSON('user');
  const [user, setUser] = useState(userOnCookie);

  useEffect(() => {
    setUser(userOnCookie)
  })

  return (
    <Router history={history}>
    <UserProvider value={{ user, setUser }}>
      <div className="App">
        <div className="wrapper">
          <div className="wrapper-inner">
            { user && <LeftSidebar /> }
            <div className={'main-panel ' + ( !user && 'auth' )}>
              { user && <Header /> }
              <div className="main-content">
                <div className="container-fluid h-100">
                  <Routes />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserProvider>
  </Router>
  );
}

export default App;
