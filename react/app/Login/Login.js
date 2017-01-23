import React from 'react';

import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';

export default class Login extends React.Component
{
    constructor()
    {
        super();
        
        this.handleLogin = this.handleLogin.bind(this);
        this.handleSignUp = this.handleSignUp.bind(this);
    }
    
    componentDidMount()
    {
        //When login is accepted
        socket.on('loginSuccess', function(id)
        {
            this.props.onLogin(id);
        }.bind(this));
    }
    
    handleLogin(email, password)
    {
        //Send login request to server
        this.props.getUsername(email);
        socket.emit('login', email, password);
    }
    
    handleSignUp(email, password)
    {
        //Send sign up request to server
        socket.emit('signUp', email, password);
    }
    
    render()
    {
        return(
            <div id="loginBg">
                <div id="loginForm">
                    <div>
                        <h1>Login</h1>
                        <LoginForm onLogin={(email, password) => this.handleLogin(email, password)} />
                    </div>
                    <div>
                        <h1>Sign up</h1>
                        <SignUpForm onSignUp={(email, password) => this.handleSignUp(email, password)} />
                    </div>
                </div>
            </div>
        );
    }
}
