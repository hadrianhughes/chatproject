import React from 'react';

import InputArea from './InputArea/InputArea.js';
import OptionsColumn from './OptionsColumn/OptionsColumn.js';
import MessageList from './MessageList/MessageList';
import MessageMenu from './MessageList/MessageMenu';

export default class App extends React.Component
{
    constructor()
    {
        super();
        
        this.state = {
            commands: [
                '/pm'
            ],
            message: '',
            messageLimit: 200,
            messages: [],
            filter: '',
            filters: [],
            words: [],
            shiftDown: false,
            emojisOpen: false,
            emojis: [
                {
                    image: 'https://s-media-cache-ak0.pinimg.com/originals/af/ad/f0/afadf0890779ca4ba2b3e5c7940d6539.png',
                    value: 'smile'
                }
            ],
            mouseOnEmoji: false,
            msgMenuOpen: false,
            mouseX: 0,
            mouseY: 0,
            mouseOnMsgMenu: false
        };
        
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.addMessage = this.addMessage.bind(this);
        this.setWords = this.setWords.bind(this);
        this.handleConnect = this.handleConnect.bind(this);
        this.handleLeave = this.handleLeave.bind(this);
        this.handleEmojiClick = this.handleEmojiClick.bind(this);
        this.addEmoji = this.addEmoji.bind(this);
        this.handleMouseDownEmoji = this.handleMouseDownEmoji.bind(this);
        this.handleMouseUpEmoji = this.handleMouseUpEmoji.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMsgClick = this.handleMsgClick.bind(this);
        this.handleMouseDownMsgMenu = this.handleMouseDownMsgMenu.bind(this);
        this.handleMouseUpMsgMenu = this.handleMouseUpMsgMenu.bind(this);
        this.messageUser = this.messageUser.bind(this);
        this.mentionUser = this.mentionUser.bind(this);
    }
    
    componentDidMount()
    {
        window.addEventListener('mousedown', this.handleMouseDown, false);
        
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
        
        socket.on('leaveRoom', function()
        {
            socket.emit('leaveFilter');
        });
        
        socket.on('logout', function()
        {
            this.props.backToLogin();
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
        
        socket.on('leftFilter', function()
        {
            this.setState({
                filter: ''
            });
        }.bind(this));
    }
    
    handleMouseDown()
    {
        if(!this.state.mouseOnEmoji)
        {
            this.setState({
                emojisOpen: false
            });
        }
        if(!this.state.mouseOnMsgMenu)
        {
            this.setState({
                msgMenuOpen: false
            });
        }
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
                    //Find commands at start of message
                    let command = this.state.message.match(/\/.*/);
                    if(command)
                    {
                        if(command.index == 0)
                        {
                            command = command.input.split(' ')[0];
                            
                        }
                    }
                    
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
            const cleaned = messages[i].value.replace(/,|\.|\n|\r|\t|<img.*\/>/g, '');
            if(cleaned.length > 3)
            {
                let parts = cleaned.split(' ');
                for(let j = 0;j < parts.length;j++)
                {
                    if(parts[j].length < 1)
                    {
                        parts.splice(j, 1);
                    }
                }
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
        
        this.setState({
            words: newWords
        });
    }
    
    handleConnect(name)
    {
        socket.emit('filterConnect', name);
    }
    
    handleLeave()
    {
        socket.emit('leaveFilter');
    }
    
    handleEmojiClick()
    {
        const newVal = this.state.emojisOpen ? false : true;
        
        this.setState({
            emojisOpen: newVal
        });
    }
    
    addEmoji(string)
    {
        let newMessage = this.state.message;
        newMessage += ':' + string + ': ';
        this.setState({
            message: newMessage,
            emojisOpen: false
        });
    }
    
    handleMouseDownEmoji()
    {
        this.setState({
            mouseOnEmoji: true
        });
    }
    
    handleMouseUpEmoji()
    {
        this.setState({
            mouseOnEmoji: false
        });
    }
    
    handleMsgClick(e, user)
    {
        this.setState({
            mouseX: e.clientX,
            mouseY: e.clientY,
            clickedUser: user,
            msgMenuOpen: true
        });
    }
    
    handleMouseDownMsgMenu()
    {
        this.setState({
            mouseOnMsgMenu: true
        });
    }
    
    handleMouseUpMsgMenu()
    {
        this.setState({
            mouseOnMsgMenu: false
        });
    }
    
    messageUser()
    {
        this.setState({
            msgMenuOpen: false
        });
    }
    
    mentionUser(user)
    {
        let newMessage = this.state.message;
        newMessage += '@' + user + ' ';
        this.setState({
            message: newMessage,
            msgMenuOpen: false
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
                        <OptionsColumn filters={this.state.filters} words={this.state.words} onConnect={(name) => this.handleConnect(name)} />
                        <td id="chat-column">
                            <MessageList list={this.state.messages} username={this.props.username} emojis={this.state.emojis} onMsgClick={(e, user) => this.handleMsgClick(e, user)} />
                            <InputArea onChange={this.handleInputChange} messageValue={this.state.message} messageLimit={this.state.messageLimit} onKeyDown={this.handleKeyDown} onKeyUp={this.handleKeyUp} onEmojiClick={this.handleEmojiClick} onAddEmoji={(string) => this.addEmoji(string)} emojis={this.state.emojis} emojisOpen={this.state.emojisOpen} onMouseDown={this.handleMouseDownEmoji} onMouseUp={this.handleMouseUpEmoji} />
                            <div className={remainingColor}>Remaining characters: {remainingChars} | Current filter: {this.state.filter} | {this.state.filter.length > 0 ? <a href="#" onClick={this.handleLeave}>Leave filter</a> : null}</div>
                            {this.state.msgMenuOpen ? <MessageMenu x={this.state.mouseX} y={this.state.mouseY} user={this.state.clickedUser} onMouseDown={this.handleMouseDownMsgMenu} onMouseUp={this.handleMouseUpMsgMenu} onMessageUser={(user) => this.messageUser(user)} onMentionUser={this.mentionUser} /> : null}
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }
}
