import React from 'react';

export default class RecommendedBlocks extends React.Component
{
    constructor()
    {
        super();
        
        this.state = {
            mouseDown: false
        };
        
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
    }
    
    componentDidUpdate()
    {
        if(!this.state.mouseDown) $('#blocks').scrollTop($(document).height());
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
            mouseUp: false
        });
    }
    
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
        
        /*let blockList = [];
        let cumuWidth = 0;
        for(let i = 0;i < wordItems.length;i++)
        {
            //Make a temporary span to contain text
            const elem = document.createElement('span');
            elem.innerHTML = wordItems[i].word;
            elem.setAttribute('id', 'temp_test_div');
            document.body.appendChild(elem);
            //Get the width and height of the span
            const divWidth = document.getElementById('temp_test_div').offsetWidth + (this.state.divPadding * 2);
            const divHeight = document.getElementById('temp_test_div').offsetHeight + (this.state.divPadding * 2);
            //Remove span from DOM
            document.body.removeChild(document.getElementById('temp_test_div'));
            
            blockList.push(
                <a href="#" onClick={() => this.props.onConnect(wordItems[i].word)} key={wordItems[i].key}><div className="block" style={{backgroundColor: wordItems[i].color}}>{wordItems[i].word}</div></a>
            );
        }*/
        
        return(
            <div id="blocks" ref="container">
                {blockList}
            </div>
        );
    }
}
