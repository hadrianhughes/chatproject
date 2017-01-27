import React from 'react';

export default class LoginForm extends React.Component
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
                        <td>Password: </td>
                        <td><input type="password" value={this.props.password} onChange={this.props.onPasswordChange} /></td>
                    </tr>
                    <tr>
                    </tr>
                    <tr>
                        <td>Remember me: </td>
                        <td><input type="checkbox" value={this.props.remember} onChange={this.props.onRememberChange} /></td>
                    </tr>
                    <tr>
                        <td>
                        </td>
                        <td>
                            <button onClick={this.props.onLogin}>Login</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }
}
