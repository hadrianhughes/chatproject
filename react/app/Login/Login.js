import React from 'react';

import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';

export default class Login extends React.Component
{
    constructor()
    {
        super();
        
        this.state = {
            loginFocused: false,
            signUpFocused: false,
            loginUsername: '',
            loginPassword: '',
            loginRemember: false,
            signUpUsername: '',
            signUpEmail: '',
            signUpPassword: '',
            signUpPasswordConf: ''
        };
        
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.handleSignUp = this.handleSignUp.bind(this);
        this.handleLoginFocus = this.handleLoginFocus.bind(this);
        this.handleLoginBlur = this.handleLoginBlur.bind(this);
        this.handleSignUpFocus = this.handleSignUpFocus.bind(this);
        this.handleSignUpBlur = this.handleSignUpBlur.bind(this);
        this.handleLoginUsernameChange = this.handleLoginUsernameChange.bind(this);
        this.handleLoginPasswordChange = this.handleLoginPasswordChange.bind(this);
        this.handleLoginRememberChange = this.handleLoginRememberChange.bind(this);
        this.handleSignUpUsernameChange = this.handleSignUpUsernameChange.bind(this);
        this.handleSignUpEmailChange = this.handleSignUpEmailChange.bind(this);
        this.handleSignUpPasswordChange = this.handleSignUpPasswordChange.bind(this);
        this.handleSignUpPasswordConfChange = this.handleSignUpPasswordConfChange.bind(this);
    }
    
    componentDidMount()
    {
        let userId = sessionStorage.getItem('chatLoginId');
        if(!userId) userId = localStorage.getItem('chatLoginId');
        let userString = sessionStorage.getItem('chatRandString');
        if(!userString) userString = localStorage.getItem('chatRandString');
        
        if(userId && userString)
        {
            socket.emit('autoLogin', userId, userString);
        }
        
        
        window.addEventListener('keydown', this.handleKeyDown, false);
        
        //When login is accepted
        socket.on('loginSuccess', function(id, randNum)
        {
            if(this.state.loginRemember)
            {
                //Save to local storage
                localStorage.setItem('chatLoginId', id);
                localStorage.setItem('chatRandString', randNum);
            }
            else
            {
                //Save to session storage
                sessionStorage.setItem('chatLoginId', id);
                sessionStorage.setItem('chatRandString', randNum);
            }
            this.props.onLogin(id, this.state.loginUsername);
        }.bind(this));
    }
    
    componentWillUnmount()
    {
        window.removeEventListener('keydown', this.handleKeyDown);
    }
    
    handleKeyDown(e)
    {
        if(e.key == 'Enter')
        {
            if(this.state.loginFocused)
            {
                this.handleLogin();
            }
            else if(this.state.signUpFocused)
            {
                this.handleSignUp();
            }
        }
    }
    
    handleLogin()
    {
        //Send login request to server
        socket.emit('login', this.state.loginUsername, this.state.loginPassword);
    }
    
    handleSignUp()
    {
        //Send sign up request to server
        if(this.state.signUpPassword == this.state.signUpPasswordConf)
        {
            socket.emit('signUp', this.state.signUpUsername, this.state.signUpEmail, this.state.signUpPassword);
        }
    }
    
    handleLoginUsernameChange(e)
    {
        this.setState({
            loginUsername: e.target.value
        });
    }
    
    handleLoginPasswordChange(e)
    {
        this.setState({
            loginPassword: e.target.value
        });
    }
    
    handleLoginRememberChange(e)
    {
        this.setState({
            loginRemember: e.target.value
        });
    }
    
    handleSignUpUsernameChange(e)
    {
        this.setState({
            signUpUsername: e.target.value
        });
    }
    
    handleSignUpEmailChange(e)
    {
        this.setState({
            signUpEmail: e.target.value
        });
    }
    
    handleSignUpPasswordChange(e)
    {
        this.setState({
            signUpPassword: e.target.value
        });
    }
    
    handleSignUpPasswordConfChange(e)
    {
        this.setState({
            signUpPasswordConf: e.target.value
        });
    }
    
    handleLoginFocus()
    {
        this.setState({
            loginFocused: true
        });
    }
    
    handleLoginBlur()
    {
        this.setState({
            loginFocused: false
        });
    }
    
    handleSignUpFocus()
    {
        this.setState({
            signUpFocused: true
        });
    }
    
    handleSignUpBlur()
    {
        this.setState({
            signUpFocused: false
        });
    }
    
    render()
    {
        return(
            <div id="loginBg">
                <div id="loginForm">
                    <div>
                        <h1>Login</h1>
                        <LoginForm username={this.state.loginUsername} password={this.state.loginPassword} remember={this.state.loginRemember} onUsernameChange={this.handleLoginUsernameChange} onPasswordChange={this.handleLoginPasswordChange} onRememberChange={this.handleLoginRememberChange} onLogin={this.handleLogin} onFocus={this.handleLoginFocus} onBlur={this.handleLoginBlur} />
                    </div>
                    <div>
                        <h1>Sign up</h1>
                        <SignUpForm email={this.state.signUpEmail} password={this.state.signUpPassword} passwordconf={this.state.signUpPasswordConf} onUsernameChange={this.handleSignUpUsernameChange} onEmailChange={this.handleSignUpEmailChange} onPasswordChange={this.handleSignUpPasswordChange} onPasswordConfChange={this.handleSignUpPasswordConfChange} onSignUp={this.handleSignUp} onFocus={this.handleSignUpFocus} onBlur={this.handleSignUpBlur} />
                    </div>
                </div>
            </div>
        );
    }
}
