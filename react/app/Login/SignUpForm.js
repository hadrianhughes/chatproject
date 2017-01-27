import React from 'react';

export default class SignUpForm extends React.Component
{
    render()
    {
        return(
            <table onFocus={this.props.onFocus} onBlur={this.props.onBlur}>
                <tbody>
                    <tr>
                        <td>Username: </td>
                        <td><input type="text" value={this.props.username} onChange={this.props.onUsernameChange} /></td>
                    </tr>
                    <tr>
                        <td>Email: </td>
                        <td><input type="text" value={this.props.email} onChange={this.props.onEmailChange} /></td>
                    </tr>
                    <tr>
                        <td>Password: </td>
                        <td><input type="password" value={this.props.password} onChange={this.props.onPasswordChange} /></td>
                    </tr>
                    <tr>
                        <td>Confirm password: </td>
                        <td><input type="password" value={this.props.passwordconf} onChange={this.props.onPasswordConfChange} /></td>
                    </tr>
                    <tr>
                        <td>
                        </td>
                        <td>
                            <button onClick={this.props.onSignUp}>Sign up</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }
}
