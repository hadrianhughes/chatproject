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
            argCommands: [
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
                },
                {
                    image: 'http://pix.iemoji.com/images/emoji/apple/ios-9/256/face-with-tears-of-joy.png',
                    value: 'joy'
                }
            ],
            mouseOnEmoji: false,
            msgMenuOpen: false,
            mouseX: 0,
            mouseY: 0,
            mouseOnMsgMenu: false,
            mutedUsers: []
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
        this.muteUser = this.muteUser.bind(this);
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
        
        socket.on('newMsg', function(msg, user, priv)
        {
            this.addMessage(user, msg, priv);
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
    
    componentWillUnmount()
    {
        window.removeEventListener('mousedown', this.handleMouseDown);
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
                    let argument;
                    let message = this.state.message;
                    if(command)
                    {
                        if(command.index == 0)
                        {
                            const parts = command.input.split(' ');
                            command = parts[0];
                            if(this.state.argCommands.indexOf(command) > -1)
                            {
                                if(parts[1]) argument = parts[1];
                                
                                //Prepare message portion
                                const fullCommand = parts[0] + ' ' + parts[1];
                                message = this.state.message.replace(fullCommand, '');
                                if(message[0] == ' ') message = message.substring(1);
                            }
                            else
                            {
                                message = this.state.message.replace(parts[0], '');
                                if(message[0] == ' ') message = message.substring(1);
                            }
                        }
                    }
                    
                    //Send message
                    socket.emit('newMsg', this.props.userId, this.state.filter, message, command, argument);
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
    
    addMessage(user, message, priv)
    {
        let newMessages = this.state.messages;
        newMessages.push({
            user: user,
            value: message,
            priv: priv
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
            if(cleaned.length > 4)
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
                    if(parts[j][0] == '#')
                    {
                        items.push({
                            word: parts[j],
                            color: 'rgb(' + Math.floor(Math.random() * 255) + ', ' + Math.floor(Math.random() * 255) + ', ' + Math.floor(Math.random() * 255) + ')'
                        });
                    }
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
    
    messageUser(user)
    {
        this.setState({
            message: '/pm ' + user + ' ',
            msgMenuOpen: false
        });
        this.refs.inputArea.refs.inputBox.focus();
    }
    
    mentionUser(user)
    {
        let newMessage = this.state.message;
        newMessage += '@' + user + ' ';
        this.setState({
            message: newMessage,
            msgMenuOpen: false
        });
        this.refs.inputArea.refs.inputBox.focus();
    }
    
    muteUser(user)
    {
        if(user != this.props.username)
        {
            if(this.state.mutedUsers.indexOf(user) < 0)
            {
                let newUsers = this.state.mutedUsers;
                newUsers.push(user);
                this.setState({
                    mutedUsers: newUsers,
                    msgMenuOpen: false
                });
            }
        }
        else
        {
            this.setState({
                msgMenuOpen: false
            });
        }
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
                            <MessageList list={this.state.messages} muted={this.state.mutedUsers} username={this.props.username} emojis={this.state.emojis} onMsgClick={(e, user) => this.handleMsgClick(e, user)} />
                            <InputArea ref="inputArea" onChange={this.handleInputChange} messageValue={this.state.message} messageLimit={this.state.messageLimit} onKeyDown={this.handleKeyDown} onKeyUp={this.handleKeyUp} onEmojiClick={this.handleEmojiClick} onAddEmoji={(string) => this.addEmoji(string)} emojis={this.state.emojis} emojisOpen={this.state.emojisOpen} onMouseDown={this.handleMouseDownEmoji} onMouseUp={this.handleMouseUpEmoji} />
                            <div className={remainingColor}>Remaining characters: {remainingChars} | Current filter: {this.state.filter} | {this.state.filter.length > 0 ? <a href="#" onClick={this.handleLeave}>Leave filter</a> : null}</div>
                            {this.state.msgMenuOpen ? <MessageMenu x={this.state.mouseX} y={this.state.mouseY} user={this.state.clickedUser} me={this.props.username} onMouseDown={this.handleMouseDownMsgMenu} onMouseUp={this.handleMouseUpMsgMenu} onMessageUser={(user) => this.messageUser(user)} onMentionUser={(user) => this.mentionUser(user)} onMuteUser={(user) => this.muteUser(user)} /> : null}
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }
}
