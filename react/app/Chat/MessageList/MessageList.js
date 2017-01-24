import React from 'react';

export default class MessageList extends React.Component
{
    componentDidUpdate()
    {
        $('#chat-column > ul').scrollTop($(document).height());
    }
    
    render()
    {
        for(let i = 0;i < this.props.list.length;i++)
        {
            this.props.list[i].key = i;
            
            for(let j = 0;j < this.props.emojis.length;j++)
            {
                const fullValue = ':' + this.props.emojis[j].value + ':';
                const exp = new RegExp(fullValue, "g");
                
                this.props.list[i].value = this.props.list[i].value.replace(exp, '<img class="emoji" src="' + this.props.emojis[j].image + '" />');
            }
            
            this.props.list[i].text = '<b>' + this.props.list[i].user + '</b>: ' + this.props.list[i].value;
        }
        
        const listContent = this.props.list.map((item) => <li key={item.key} style={{ textAlign: item.user == this.props.username ? 'right' : 'left'}} dangerouslySetInnerHTML={{__html: item.text}}></li>);
        
        return(
            <ul>
                {listContent}
            </ul>
        );
    }
}
