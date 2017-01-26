import React from 'react';

export default class MentionsMenu extends React.Component
{
    render()
    {
        let newList = [];
        for(let i = 0;i < this.props.list.length;i++)
        {
            newList[i] = {};
            newList[i].value = this.props.list[i];
            newList[i].key = i + 1;
        }
        
        const items = newList.map((item) => <li key={item.key} onClick={() => this.props.onClick(item.value)}><a href="#">{item.value}</a></li>);
        
        return(
            <ul className="menu" id="mentionsMenu" onMouseDown={this.props.onMouseDown} onMouseUp={this.props.onMouseUp}>
                {items}
            </ul>
        )
    }
}
