import React from 'react';
import ReactDOM from 'react-dom';

import Chat from './Chat/Chat';
import Login from './Login/Login';

class App extends React.Component
{
    constructor()
    {
        super();
        
        this.state = {
            isLogin: true,
            isChat: false,
            login: ''
        };
        
        this.handleLogin = this.handleLogin.bind(this);
        this.changeToLogin = this.changeToLogin.bind(this);
    }
    
    handleLogin(id)
    {
        //Store account id in state for login later
        this.setState({ login: id, isLogin: false, isChat: true });
    }
    
    changeToLogin()
    {
        this.setState({ isLogin: true, isChat: false });
    }
    
    render()
    {
        return(
            <div>
                {this.state.isLogin ? <Login onLogin={(id) => this.handleLogin(id)} /> : null}
                {this.state.isChat ? <Chat userId={this.state.login} backToLogin={this.changeToLogin} /> : null}
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('app'));
