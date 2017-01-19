import React from 'react';

export default class OptionsCanvas extends React.Component
{
    constructor()
    {
        super();
        
        this.state = { topics: [], grid: [], hovering: false };
        
        this.initCanvas = this.initCanvas.bind(this);
        this.animationLoop = this.animationLoop.bind(this);
        this.updateCanvas = this.updateCanvas.bind(this);
        this.renderCanvas = this.renderCanvas.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
    }
    
    componentDidMount()
    {
        //Set height and width of canvas
        this.refs.optionsCanvas.width = (window.innerWidth / 100) * 25;
        this.refs.optionsCanvas.height = window.innerHeight;
        
        this.initCanvas(this.props.filters);
    }
    
    handleMouseMove(e)
    {
        this.setState({ mouseX: e.clientX, mouseY: e.clientY });
    }
    
    initCanvas(filters)
    {
        //Sort filters by popularity (decreasing)
        for(let i = 0;i < filters.length;i++)
        {
            for(let j = 0;j < filters.length - 1;j++)
            {
                if(filters[j].count < filters[j + 1].count)
                {
                    const tempFilter = filters[j];
                    filters[j] = filters[j + 1];
                    filters[j + 1] = tempFilter;
                }
            }
        }
        
        let topics = [];
        const multiplier = 5 / filters[filters.length - 1].count;
        for(let i = 0;i < filters.length;i++)
        {
            topics[i] = {
                id: i + 1,
                name: filters[i].value,
                pop: Math.floor(filters[i].count * multiplier) + 3,
                x: 0,
                y: 100,
                color: 'rgb(' + Math.floor(Math.random() * 255) + ', ' + Math.floor(Math.random() * 255) + ', ' + Math.floor(Math.random() * 255) + ')',
                centerX: 0,
                centerY: 0,
                onScreen: false,
                hovering: false
            };
        }
        console.log(topics);
        
        //Make grid
        let grid = [];
        for(let i = 0;i < 40;i++)
        {
            grid[i] = [];
            for(let j = 0;j < Math.floor(this.refs.optionsCanvas.width / (this.refs.optionsCanvas.height / 40));j++)
            {
                grid[i][j] = 0;
            }
        }
        
        this.setState({ topics: topics, grid: grid }, function()
        {
            let topicTemp = this.state.topics;
            
            //Assign topics to grid
            //Find an appropriate space for the next topic and draw it to the grid
            //For each topic...
            for(let i = 0;i < this.state.topics.length;i++)
            {
                //Move upwards through grid...
                for(let j = this.state.grid.length - 1;j > 0;j--)
                {
                    //From left to right
                    for(let k = 0;k < this.state.grid[j].length;k++)
                    {
                        //If current grid slot is free and enough slots are to the right and above it to accomodate the block
                        if(this.state.grid[j][k] == 0 && (this.state.grid[j].length - k) >= this.state.topics[i].pop && (this.state.grid.length - (this.state.grid.length - j)) >= this.state.topics[i].pop)
                        {
                            //Make sure slots to the right and above the current slot are not taken
                            let available = true;
                            for(let l = 0;l < this.state.topics[i].pop;l++)
                            {
                                for(let x = 0;x < this.state.topics[i].pop;x++)
                                {
                                    if(this.state.grid[j - l][k + x] != 0)
                                    {
                                        available = false;
                                        break;
                                    }
                                }
                            }
                            
                            if(available)
                            {
                                //Add to grid
                                for(let l = 0;l < this.state.topics[i].pop;l++)
                                {
                                    for(let x = 0;x < this.state.topics[i].pop;x++)
                                    {
                                        this.state.grid[j - l][k + x] = this.state.topics[i].id;
                                    }
                                }
                                
                                //Store value for where center of block is (for text later)
                                topicTemp[i].centerY = j - (this.state.topics[i].pop / 2) + 1;
                                topicTemp[i].centerX = k + (this.state.topics[i].pop / 2);
                                
                                topicTemp[i].onScreen = true;
                                
                                //Break out of both j and k for loops
                                k = this.state.grid[j].length;
                                j = 0;
                            }
                        }
                    }
                }
            }
            
            this.setState({ topics: topicTemp }, function()
            {
                requestAnimationFrame(this.animationLoop);
            }.bind(this));
        }.bind(this));
    }
    
    animationLoop()
    {
        this.updateCanvas();
        this.renderCanvas();
        
        requestAnimationFrame(this.animationLoop);
    }
    
    updateCanvas()
    {
        //Get mouse position on grid
        let topicTemp = this.state.topics;
        for(let i = 0;i < topicTemp.length;i++)
        {
            topicTemp[i].hovering = false;
        }
    
        const gridX = Math.floor((this.state.mouseX / this.refs.optionsCanvas.width) * this.state.grid[0].length);
        const gridY = Math.floor((this.state.mouseY / this.refs.optionsCanvas.height) * this.state.grid.length);
        
        
        if(gridY && gridX)
        {
            if(this.state.grid[gridY][gridX])
            {
                if(this.state.grid[gridY][gridX] != 0)
                {
                    for(let i = 0;i < this.state.topics.length;i++)
                    {
                        if(this.state.topics[i].id == this.state.grid[gridY][gridX])
                        {
                            topicTemp[i].hovering = true;
                        }
                    }
                }
            }
        }
        
        this.setState({ topics: topicTemp });
    }
    
    renderCanvas()
    {
        const ctx = this.refs.optionsCanvas.getContext('2d');
        
        ctx.font = '20px Arial';
        //Clear canvas
        ctx.clearRect(0, 0, this.refs.optionsCanvas.width, this.refs.optionsCanvas.height);
        
        //Render squares
        //For each grid slot
        for(let i = 0;i < this.state.grid.length;i++)
        {
            for(let j = 0;j < this.state.grid[i].length;j++)
            {
                //If grid slot is not empty
                if(this.state.grid[i][j] != 0)
                {
                    //Failsafe color of red
                    let color = 'rgb(255, 0, 0)';
                    let text = '';
                    let pop = 0;
                    let hovering = false;
                    //Check all topics
                    for(let k = 0;k < this.state.topics.length;k++)
                    {
                        //Find topic with id held in grid slot
                        if(this.state.topics[k].id == this.state.grid[i][j])
                        {
                            //Get appropriate info
                            color = this.state.topics[k].color;
                            text = this.state.topics[k].name;
                            pop = this.state.topics[k].pop;
                            hovering = this.state.topics[k].hovering;
                            break;
                        }
                    }
                    
                    if(hovering)
                    {
                        let colors = color.substring(4);
                        colors = colors.substring(0, colors.length - 1);
                        colors = colors.split(',');
                        const r = Math.ceil(parseInt(colors[0]) * 1.1);
                        const g = Math.ceil(parseInt(colors[1]) * 1.1);
                        const b = Math.ceil(parseInt(colors[2]) * 1.1);
                        ctx.fillStyle = 'rgb(' + r + ', ' + g + ', ' + b + ')';
                    }
                    else
                    {
                        ctx.fillStyle = color;
                    }
                    
                    //Color in current grid slot
                    ctx.beginPath();
                        ctx.fillRect((this.refs.optionsCanvas.width / this.state.grid[i].length) * j, (this.refs.optionsCanvas.height / this.state.grid.length) * i, (this.refs.optionsCanvas.width / this.state.grid[i].length) + 1, (this.refs.optionsCanvas.height / this.state.grid.length) + 1);
                    ctx.closePath();
                }
            }
        }
        
        for(let i = 0;i < this.state.topics.length;i++)
        {
            if(this.state.topics[i].onScreen)
            {
                const maxLength = 6 + this.state.topics[i].pop;
                let substrings = [];
                let k = 0;
                let newString = '';
                while(k <= this.state.topics[i].name.length)
                {
                    if(newString.length >= maxLength || k == this.state.topics[i].name.length)
                    {
                        substrings.push(newString);
                        newString = '';
                    }
                    else
                    {
                        newString += this.state.topics[i].name[k];
                    }
                    
                    k++;
                }
                
                //Render text on square
                for(let j = 0;j < substrings.length;j++)
                {
                    ctx.beginPath();
                    ctx.fillStyle = 'black';
                    
                    ctx.fillText(substrings[j], (this.state.topics[i].centerX * (this.refs.optionsCanvas.width / this.state.grid[0].length)) - (10 * (substrings[j].length / 2)), (this.state.topics[i].centerY * (this.refs.optionsCanvas.height / this.state.grid.length) + 10) + (j * 20));
                    ctx.closePath();
                }
            }
        }
    }
    
    render()
    {
        return(
            <canvas ref="optionsCanvas" id="optionsCanvas" onMouseMove={this.handleMouseMove} />
        );
    }
}
