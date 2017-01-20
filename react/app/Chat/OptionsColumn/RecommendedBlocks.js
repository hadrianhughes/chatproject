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
        
        let blockList = wordItems.map((item) => <div className="block" style={{backgroundColor: item.color}} key={item.key}>{item.word}</div>);
        
        return(
            <div id="blocks">
                {blockList}
            </div>
        );
    }
}
