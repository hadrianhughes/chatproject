import React from 'react';

export default class LoginForm extends React.Component
{
    render()
    {
        return(
            <table onFocus={this.props.onFocus} onBlur={this.props.onBlur}>
                <tbody>
                    <tr>
                        <td>Email: </td>
                        <td><input type="text" value={this.props.email} onChange={this.props.onEmailChange} /></td>
                    </tr>
                    <tr>
                        <td>Password: </td>
                        <td><input type="password" value={this.props.password} onChange={this.props.onPasswordChange} /></td>
                    </tr>
                    <tr>
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
