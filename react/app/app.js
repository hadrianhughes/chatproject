import React from 'react';
import ReactDOM from 'react-dom';

import Chat from './Chat/Chat';
import Login from './Login/Login';

class App extends React.Component
{
    constructor()
    {
        super();
        
        let userId = sessionStorage.getItem('chatLoginId');
        if(!userId) userId = localStorage.getItem('chatLoginId');
        let userString = sessionStorage.getItem('chatRandString');
        if(!userString) userString = localStorage.getItem('chatRandString');
        
        if(userId && userString)
        {
            socket.emit('autoLogin', userId, userString);
        }
        
        this.state = {
            isLogin: false,
            isChat: false,
            login: '',
            username: ''
        };
        
        this.handleLogin = this.handleLogin.bind(this);
        this.changeToLogin = this.changeToLogin.bind(this);
    }
    
    componentDidMount()
    {
        socket.on('loginSuccess', function(successful, id, string)
        {
            if(successful)
            {
                this.setState({
                    isLogin: false,
                    isChat: true,
                    login: id,
                    username: ''
                });
            }
            else
            {
                this.setState({
                    isLogin: true,
                    isChat: false,
                    login: '',
                    username: ''
                });
            }
        }.bind(this));
    }
    
    componentWillUnmount()
    {
        socket.removeAllListeners();
    }
    
    handleLogin(id, username)
    {
        //Store account id in state for login later
        this.setState({
            login: id,
            username: username,
            isLogin: false,
            isChat: true
        });
    }
    
    changeToLogin()
    {
        this.setState({
            isLogin: true,
            isChat: false,
            login: '',
            username: ''
        });
    }
    
    render()
    {
        console.log(this.state.isLogin, this.state.isChat);
        return(
            <div>
                {this.state.isLogin ? <Login onLogin={(id, username) => this.handleLogin(id, username)} /> : null}
                {this.state.isChat ? <Chat userId={this.state.login} backToLogin={this.changeToLogin} username={this.state.username} /> : null}
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('app'));
