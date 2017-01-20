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
            filters: [],
            words: []
        };
        
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.addMessage = this.addMessage.bind(this);
        this.setWords = this.setWords.bind(this);
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
            this.setWords(this.state.messages);
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
            if(this.state.message.length > 0)
            {
                //Send message
                socket.emit('newMsg', this.props.userId, this.state.filter, this.state.message);
                this.setState({ message: '' });
            }
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
    
    setWords(messages)
    {
        let words = [];
        for(let i = 0;i < messages.length;i++)
        {
            const cleaned = messages[i].value.replace(/,|\.|\n|\r|\t/g, '');
            if(cleaned.length > 3)
            {
                const parts = cleaned.split(' ');
                words = words.concat(parts);
            }
        }
        
        for(let i = 0;i < words.length;i++)
        {
            for(let j = i + 1;j < words.length;j++)
            {
                if(words[i] == words[j])
                {
                    words.splice(i, 1);
                }
            }
        }
        
        this.setState({
            words: words
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
                        <OptionsColumn filters={this.state.filters} words={this.state.words} />
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
