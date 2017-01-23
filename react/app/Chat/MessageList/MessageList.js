import React from 'react';

export default class MessageList extends React.Component
{
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
        }
        
        //const listContent = this.props.list.map((item) => <li key={item.key} style={{ textAlign: item.user == this.props.username ? 'right' : 'left'}}><b>{item.user}</b>{': ' + item.value}</li>);
        const listContent = this.props.list.map((item) => <li key={item.key} style={{ textAlign: item.user == this.props.username ? 'right' : 'left'}} dangerouslySetInnerHTML={{__html: item.value}}></li>);
        
        return(
            <ul>
                {listContent}
            </ul>
        );
    }
}
