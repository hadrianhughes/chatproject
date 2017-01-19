import React from 'react';

export default class LoginForm extends React.Component
{
    constructor()
    {
        super();
        
        this.state = {
            email: '',
            password: ''
        };
        
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
    }
    
    handleEmailChange(e)
    {
        this.setState({ email: e.target.value });
    }
    
    handlePasswordChange(e)
    {
        this.setState({ password: e.target.value });
    }
    
    handleLogin()
    {
        if(this.state.email.indexOf('@') > 0)
        {
            if(this.state.password.length >= 10)
            {
                this.props.onLogin(this.state.email, this.state.password);
            }
            else
            {
                alert('Your password must be at least 10 characters long.')
            }
        }
        else
        {
            alert('Please enter a valid email address.');
        }
    }
    
    render()
    {
        return(
            <table>
                <tbody>
                    <tr>
                        <td>Email: </td>
                        <td><input type="text" value={this.state.email} onChange={this.handleEmailChange} /></td>
                    </tr>
                    <tr>
                        <td>Password: </td>
                        <td><input type="password" value={this.state.password} onChange={this.handlePasswordChange} /></td>
                    </tr>
                    <tr>
                        <td>
                        </td>
                        <td>
                            <button onClick={this.handleLogin}>Login</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }
}
