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
        
        return(
            <div id="input-area" className={this.state.focused ? 'focused' : null}>
                <textarea id="message-box" value={this.props.messageValue} onFocus={this.handleFocus} onBlur={this.handleBlur} onChange={this.props.onChange} onKeyDown={this.props.onKeyDown} onKeyUp={this.props.onKeyUp}></textarea>
                <i className="fa fa-smile-o" aria-hidden="true"></i>
            </div>
        );
    }
}
