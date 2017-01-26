import React from 'react';

export default class MessageMenu extends React.Component
{
    constructor(props)
    {
        super(props);
        
        this.state = {
            x: props.x - 50,
            y: props.y,
            user: props.user
        };
    }
    
    render()
    {
        return(
            <ul className="menu" style={{top: this.state.y, left: this.state.x}} onMouseDown={this.props.onMouseDown} onMouseUp={this.props.onMouseUp}>
                <li onClick={() => this.props.onMentionUser(this.state.user)}><a href="#"><b>Mention</b><br />{this.state.user}</a></li>
                <li onClick={() => this.props.onMessageUser(this.state.user)}><a href="#"><b>Message</b><br />{this.state.user}</a></li>
                {this.state.user != this.props.me ? <li onClick={() => this.props.onMuteUser(this.state.user)}><a href="#"><b>Mute</b><br />{this.state.user}</a></li> : null}
            </ul>
        );
    }
}
