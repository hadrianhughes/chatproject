import React from 'react';

export default class SignUpForm extends React.Component
{
    constructor()
    {
        super();
        
        this.state = {
            email: '',
            password: '',
            password_conf: ''
        };
        
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handlePasswordConfChange = this.handlePasswordConfChange.bind(this);
        this.handleSignUp = this.handleSignUp.bind(this);
    }
    
    handleEmailChange(e)
    {
        this.setState({ email: e.target.value });
    }
    
    handlePasswordChange(e)
    {
        this.setState({ password: e.target.value });
    }
    
    handlePasswordConfChange(e)
    {
        this.setState({ password_conf: e.target.value });
    }
    
    handleSignUp()
    {
        if(this.state.email.indexOf('@') > 0)
        {
            if(this.state.password === this.state.password_conf)
            {
                if(this.state.password.length >= 10)
                {
                    this.props.onSignUp(this.state.email, this.state.password);
                }
                else
                {
                    alert('Password must be at least 10 characters long.');
                }
            }
            else
            {
                alert('Passwords do not match.')
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
                        <td>Confirm password: </td>
                        <td><input type="password" value={this.state.password_conf} onChange={this.handlePasswordConfChange} /></td>
                    </tr>
                    <tr>
                        <td>
                        </td>
                        <td>
                            <button onClick={this.handleSignUp}>Sign up</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }
}
