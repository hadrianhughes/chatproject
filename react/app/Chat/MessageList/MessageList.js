import React from 'react';

export default class MessageList extends React.Component
{
    render()
    {
        for(let i = 0;i < this.props.list.length;i++)
        {
            this.props.list[i].key = i;
        }
        
        const listContent = this.props.list.map((item) => <li key={item.key} style={{ textAlign: item.user == this.props.username ? 'right' : 'left'}}><b>{item.user}</b>{': ' + item.value}</li>);
        
        return(
            <ul>
                {listContent}
            </ul>
        );
    }
}
