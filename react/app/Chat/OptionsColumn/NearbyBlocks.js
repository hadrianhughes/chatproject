import React from 'react';

export default class NearbyBlocks extends React.Component
{
    render()
    {
        let filterItems = [];
        for(let i = 0;i < this.props.filters.length;i++)
        {
            filterItems[i] = {
                name: this.props.filters[i].value,
                color: 'rgb(' + Math.floor(Math.random() * 255) + ', ' + Math.floor(Math.random() * 255) + ', ' + Math.floor(Math.random() * 255) + ')',
                size: (24 * this.props.filters[i].value.length) + (this.props.filters[i].count * 10),
                key: i + 1
            };
        }
        
        let filterList = filterItems.map((item) => <a href="#" onClick={() => this.props.onConnect(item.name)} key={item.key}><div className="block" style={{backgroundColor: item.color, width: item.size}}>{item.name}</div></a>);
        
        return(
            <div id="blocks">
                {filterList}
            </div>
        );
    }
}
