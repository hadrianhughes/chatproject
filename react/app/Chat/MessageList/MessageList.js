import React from 'react';

export default class MessageList extends React.Component
{
    constructor()
    {
        super();
        
        this.state = {
            mouseDown: false
        };
        
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleMsgClick = this.handleMsgClick.bind(this);
    }
    
    componentDidUpdate()
    {
        //Allows scrollbar to work
        if(!this.state.mouseDown) $('#chat-column > ul').scrollTop($(document).height());
    }
    
    handleMouseDown()
    {
        this.setState({
            mouseDown: true
        });
    }
    
    handleMouseUp()
    {
        this.setState({
            mouseDown: false
        });
    }
    
    handleMsgClick()
    {
        console.log('clicked message');
    }
    
    render()
    {
        let newList = [];
        for(let i = 0;i < this.props.list.length;i++)
        {
            if(this.props.muted.indexOf(this.props.list[i].user) < 0)
            {
                //Give key value to item for React
                this.props.list[i].key = i;
                
                //Replace any emojis with actual images
                for(let j = 0;j < this.props.emojis.length;j++)
                {
                    const fullValue = ':' + this.props.emojis[j].value + ':';
                    const exp = new RegExp(fullValue, "g");
                    
                    this.props.list[i].value = this.props.list[i].value.replace(exp, '<img class="emoji" src="' + this.props.emojis[j].image + '" />');
                }
                
                //Highlight if user is mentioned
                if(this.props.list[i].value.indexOf('@' + this.props.username) > -1)
                {
                    this.props.list[i].mentioned = true;
                }
                else
                {
                    this.props.list[i].mentioned = false;
                }
                
                this.props.list[i].text = '<b>' + this.props.list[i].user + '</b><br />' + this.props.list[i].value;
                
                newList.push(this.props.list[i]);
            }
        }
        
        const listContent = newList.map((item) => <li key={item.key} className={item.priv ? "privateMsg" : null, item.mentioned ? "mentionedMsg" : null} style={{ textAlign: item.user == this.props.username ? 'right' : 'left'}} dangerouslySetInnerHTML={{__html: item.text}} onClick={(e) => this.props.onMsgClick(e, item.user)}></li>);
        
        return(
            <ul id="messageList" onMouseDown={this.handleMouseDown} onMouseUp={this.handleMouseUp}>
                {listContent}
            </ul>
        );
    }
}
