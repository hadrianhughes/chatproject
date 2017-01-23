import React from 'react';

export default class InputArea extends React.Component
{
    constructor()
    {
        super();
        
        this.state = {
            focused: false
        };
        
        this.handleFocus = this.handleFocus.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
    }
    
    handleFocus()
    {
        this.setState({ focused: true });
    }
    
    handleBlur()
    {
        this.setState({ focused: false });
    }
    
    render()
    {
        const remainingChars = this.props.messageLimit - this.props.messageValue.length;
        let remainingColor = '';
        if(remainingChars < 20)
        {
            remainingColor = 'orangeText';
        }
        else if(remainingChars <= 0)
        {
            remainingCOlor = 'redText';
        }
        
        //Emoji menu
        let emojiItems = [];
        for(let i = 0;i < this.props.emojis.length;i++)
        {
            emojiItems[i] = {};
            emojiItems[i].image = this.props.emojis[i].image;
            emojiItems[i].value = this.props.emojis[i].value;
            emojiItems[i].key = i + 1;
        }
        
        let emojiElements = emojiItems.map((item) => <div title={item.value} className="emoji-icon" style={{backgroundImage: 'url(' + item.image + ')'}} key={item.key}></div>);
        
        const emojiMenu =
        <div id="emoji-menu">
            {emojiElements}
        </div>;
        
        return(
            <div id="input-area" className={this.state.focused ? 'focused' : null}>
                <textarea id="message-box" value={this.props.messageValue} onFocus={this.handleFocus} onBlur={this.handleBlur} onChange={this.props.onChange} onKeyDown={this.props.onKeyDown} onKeyUp={this.props.onKeyUp}></textarea>
                {this.props.emojisOpen ? emojiMenu : null}
                <i className="fa fa-smile-o" aria-hidden="true" onClick={this.props.onEmojiClick}></i>
            </div>
        );
    }
}
