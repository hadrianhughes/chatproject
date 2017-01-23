import React from 'react';

export default class RecommendedBlocks extends React.Component
{
    render()
    {
        let wordItems = [];
        for(let i = 0;i < this.props.words.length;i++)
        {
            wordItems[i] = {
                word: this.props.words[i].word,
                color: this.props.words[i].color,
                key: i + 1
            };
        }
        
        let blockList = wordItems.map((item) => <a href="#" onClick={() => this.props.onConnect(item.word)} key={item.key}><div className="block" style={{backgroundColor: item.color}}>{item.word}</div></a>);
        
        return(
            <div id="blocks">
                {blockList}
            </div>
        );
    }
}
