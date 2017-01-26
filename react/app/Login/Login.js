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
            loginEmail: '',
            loginPassword: '',
            signUpEmail: '',
            signUpPassword: '',
            signUpPasswordConf: ''
        };
        
        this.handleLogin = this.handleLogin.bind(this);
        this.handleSignUp = this.handleSignUp.bind(this);
        this.handleLoginFocus = this.handleLoginFocus.bind(this);
        this.handleLoginBlur = this.handleLoginBlur.bind(this);
        this.handleSignUpFocus = this.handleSignUpFocus.bind(this);
        this.handleSignUpBlur = this.handleSignUpBlur.bind(this);
        this.handleLoginEmailChange = this.handleLoginEmailChange.bind(this);
        this.handleLoginPasswordChange = this.handleLoginPasswordChange.bind(this);
        this.handleSignUpEmailChange = this.handleSignUpEmailChange.bind(this);
        this.handleSignUpPasswordChange = this.handleSignUpPasswordChange.bind(this);
        this.handleSignUpPasswordConfChange = this.handleSignUpPasswordConfChange.bind(this);
    }
    
    componentDidMount()
    {
        window.addEventListener('keydown', function(e){
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
        }.bind(this), false);
        
        //When login is accepted
        socket.on('loginSuccess', function(id)
        {
            this.props.onLogin(id);
        }.bind(this));
    }
    
    handleLogin()
    {
        //Send login request to server
        this.props.getUsername(this.state.loginEmail);
        socket.emit('login', this.state.loginEmail, this.state.loginPassword);
    }
    
    handleSignUp()
    {
        //Send sign up request to server
        if(this.state.signUpPassword == this.state.signUpPasswordConf)
        {
            socket.emit('signUp', this.state.signUpEmail, this.state.signUpPassword);
        }
    }
    
    handleLoginEmailChange(e)
    {
        this.setState({
            loginEmail: e.target.value
        });
    }
    
    handleLoginPasswordChange(e)
    {
        this.setState({
            loginPassword: e.target.value
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
                        <LoginForm email={this.state.loginEmail} password={this.state.loginPassword} onEmailChange={this.handleLoginEmailChange} onPasswordChange={this.handleLoginPasswordChange} onLogin={this.handleLogin} onFocus={this.handleLoginFocus} onBlur={this.handleLoginBlur} />
                    </div>
                    <div>
                        <h1>Sign up</h1>
                        <SignUpForm email={this.state.signUpEmail} password={this.state.signUpPassword} passwordconf={this.state.signUpPasswordConf} onEmailChange={this.handleSignUpEmailChange} onPasswordChange={this.handleSignUpPasswordChange} onPasswordConfChange={this.handleSignUpPasswordConfChange} onSignUp={this.handleSignUp} onFocus={this.handleSignUpFocus} onBlur={this.handleSignUpBlur} />
                    </div>
                </div>
            </div>
        );
    }
}
