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
        this.handleSignUpUsernameChange = this.handleSignUpUsernameChange.bind(this);
        this.handleSignUpEmailChange = this.handleSignUpEmailChange.bind(this);
        this.handleSignUpPasswordChange = this.handleSignUpPasswordChange.bind(this);
        this.handleSignUpPasswordConfChange = this.handleSignUpPasswordConfChange.bind(this);
    }
    
    componentDidMount()
    {
        window.addEventListener('keydown', this.handleKeyDown, false);
        
        //When login is accepted
        socket.on('loginSuccess', function(id)
        {
            console.log(this.state.loginUsername);
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
                        <LoginForm username={this.state.loginUsername} password={this.state.loginPassword} onUsernameChange={this.handleLoginUsernameChange} onPasswordChange={this.handleLoginPasswordChange} onLogin={this.handleLogin} onFocus={this.handleLoginFocus} onBlur={this.handleLoginBlur} />
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
