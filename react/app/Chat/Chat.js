import React from 'react';

import InputArea from './InputArea/InputArea.js';
import OptionsColumn from './OptionsColumn/OptionsColumn.js';
import MessageList from './MessageList/MessageList';

export default class App extends React.Component
{
    constructor()
    {
        super();
        
        this.state = {
            message: '',
            messageLimit: 200,
            messages: [],
            filter: '',
            filters: []
        };
        
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.addMessage = this.addMessage.bind(this);
    }
    
    componentDidMount()
    {
        socket.emit('loginCheck', this.props.userId);
        
        socket.on('loginCorrect', function(correct)
        {
            if(correct)
            {
                //Send GPS location to server
                if(navigator.geolocation)
                {
                    navigator.geolocation.getCurrentPosition(function(pos)
                    {
                        socket.emit('myLocation', pos.coords.latitude, pos.coords.longitude);
                        socket.emit('getFilters');
                    });
                }
                else
                {
                    alert('Please use a different browser.');
                }
            }
            else
            {
                this.props.backToLogin();
            }
        }.bind(this));
        
        socket.on('filtersList', function(list)
        {
            this.setState({
                filters: list
            });
        }.bind(this));
        
        socket.on('newMsg', function(msg, user)
        {
            this.addMessage(user, msg);
        }.bind(this));
    }
    
    handleInputChange(e)
    {
        if(e.target.value.length <= this.state.messageLimit)
        {
            this.setState({ message: e.target.value });
        }
    }
    
    handleKeyDown(e)
    {
        if(e.key === 'Enter')
        {
            //Send message
            socket.emit('newMsg', this.props.userId, this.state.filter, this.state.message);
            this.setState({ message: '' });
        }
    }
    
    addMessage(user, message)
    {
        let newMessages = this.state.messages;
        newMessages.push({
            user: user,
            value: message
        });
        this.setState({
            messages: newMessages
        });
    }
    
    render()
    {
        const remainingChars = this.state.messageLimit - this.state.message.length;
        let remainingColor = '';
        if(remainingChars <= 0)
        {
            remainingColor = 'redText';
        }
        else if(remainingChars <= 20)
        {
            remainingColor = 'orangeText';
        }
        
        return(
            <table className="max-width max-height">
                <tbody>
                    <tr>
                        <OptionsColumn filters={this.state.filters} />
                        <td id="chat-column">
                            <MessageList list={this.state.messages} />
                            <InputArea onChange={this.handleInputChange} messageValue={this.state.message} messageLimit={this.state.messageLimit} onKeyDown={this.handleKeyDown} />
                            <div className={remainingColor}>Remaining characters: {remainingChars}</div>
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }
}
