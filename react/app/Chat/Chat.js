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
            words: [],
            shiftDown: false
        };
        
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.addMessage = this.addMessage.bind(this);
        this.setWords = this.setWords.bind(this);
        this.handleConnect = this.handleConnect.bind(this);
    }
    
    componentDidMount()
    {
        console.log(this.props.userId);
        
        socket.emit('loginCheck', this.props.userId);
        
        socket.on('loginCorrect', function(correct)
        {
            if(correct)
            {
                $.get('http://ipinfo.io', function(res)
                {
                    const location = res.loc.split(',');
                    const lat = parseFloat(location[0]);
                    const long = parseFloat(location[1]);
                    
                    socket.emit('myLocation', lat, long);
                    socket.emit('getFilters');
                }, 'jsonp');
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
        
        socket.on('connectedFilter', function(name)
        {
            this.setState({
                filter: name
            });
            console.log('Connected to filter: ' + name);
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
            if(!this.state.shiftDown)
            {
                e.preventDefault();
                if(this.state.message.length > 0)
                {
                    //Send message
                    socket.emit('newMsg', this.props.userId, this.state.filter, this.state.message);
                    this.setState({ message: '' });
                }
            }
        }
        else if(e.key === 'Shift')
        {
            this.setState({
                shiftDown: true
            });
        }
    }
    
    handleKeyUp(e)
    {
        if(e.key === 'Shift')
        {
            this.setState({
                shiftDown: false
            });
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
                let items = [];
                for(let j = 0;j < parts.length;j++)
                {
                    items.push({
                        word: parts[j],
                        color: 'rgb(' + Math.floor(Math.random() * 255) + ', ' + Math.floor(Math.random() * 255) + ', ' + Math.floor(Math.random() * 255) + ')'
                    });
                }
                words = words.concat(items);
            }
        }
        
        let newWords = [];
        for(let i = 0;i < words.length;i++)
        {
            let present = false;
            for(let j = 0;j < newWords.length;j++)
            {
                if(newWords[j].word == words[i].word)
                {
                    present = true;
                    break;
                }
            }
            
            if(!present)
            {
                newWords.push(words[i]);
            }
        }
        //console.log(words);
        
        this.setState({
            words: newWords
        });
    }
    
    handleConnect(name)
    {
        socket.emit('filterConnect', name);
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
                        <OptionsColumn filters={this.state.filters} words={this.state.words} onConnect={(name) => this.handleConnect(name)} />
                        <td id="chat-column">
                            <MessageList list={this.state.messages} username={this.props.username} />
                            <InputArea onChange={this.handleInputChange} messageValue={this.state.message} messageLimit={this.state.messageLimit} onKeyDown={this.handleKeyDown} onKeyUp={this.handleKeyUp} />
                            <div className={remainingColor}>Remaining characters: {remainingChars} | Current filter: {this.state.filter}</div>
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }
}
