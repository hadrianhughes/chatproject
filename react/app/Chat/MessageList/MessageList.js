import React from 'react';

export default class MessageList extends React.Component
{
    constructor()
    {
        super();
        
        
    }
    
    render()
    {
        for(let i = 0;i < this.props.list.length;i++)
        {
            this.props.list[i].key = i;
        }
        
        const listContent = this.props.list.map((item) => <li key={item.key}><b>{item.user}</b>{': ' + item.value}</li>);
        
        return(
            <ul>
                {listContent}
            </ul>
        );
    }
}
