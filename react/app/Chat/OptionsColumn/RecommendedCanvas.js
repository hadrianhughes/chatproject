import React from 'react';

export default class RecommendedCanvas extends React.Component
{
    constructor()
    {
        super();
        
        this.state = {
            mounted: false,
            gridHeight: 40,
            canvasWidth: (window.innerWidth / 100) * 25,
            canvasHeight: window.innerHeight - ((window.innerHeight / 100) * 8),
            fontSize: 20,
            mouseX: 0,
            mouseY: 0
        };
        
        this.makeBlocks = this.makeBlocks.bind(this);
        this.makeGrid = this.makeGrid.bind(this);
        this.getMousePos = this.getMousePos.bind(this);
        this.renderCanvas = this.renderCanvas.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
    }
    
    componentDidMount()
    {
        this.setState({
            mounted: true
        });
        
        this.refs.canvas.width = this.state.canvasWidth;
        this.refs.canvas.height = this.state.canvasHeight;
    }
    
    handleMouseMove(e)
    {
        this.setState({
            mouseX: e.clientX,
            mouseY: e.clientY
        });
    }
    
    getMousePos(blocks, grid, callback)
    {
        //Find grid coords with mouse over
        const gridX = Math.floor((this.state.mouseX / this.state.canvasWidth) * grid[0].length);
        const gridY = Math.floor((this.state.mouseY / this.state.canvasHeight) * grid.length) - 3;
        
        //Default all blocks to not hovered
        for(let i = 0;i < blocks.length;i++)
        {
            blocks[i].hovering = false;
        }
        
        //Find block currently hovered over
        if(gridY && gridX)
        {
            if(grid[gridY])
            {
                if(grid[gridY][gridX])
                {
                    if(grid[gridY][gridX] != 0)
                    {
                        for(let i = 0;i < blocks.length;i++)
                        {
                            if(blocks[i].id == grid[gridY][gridX])
                            {
                                blocks[i].hovering = true;
                            }
                        }
                    }
                }
            }
        }
        
        callback(blocks, grid);
    }
    
    makeBlocks(words, callback)
    {
        let blocks = [];
        for(let i = 0;i < words.length;i++)
        {
            blocks.push({
                id: i + 1,
                name: words[i],
                //size: Math.floor(Math.random() * 5) + 4,
                size: words[i].length,
                //color: 'rgb(' + Math.floor(Math.random() * 255) + ', ' + Math.floor(Math.random() * 255) + ', ' + Math.floor(Math.random() * 255) + ')',
                color: 'rgb(' + ((words[i].charCodeAt(0) - 96) * 10) + ', ' + ((words[i].charCodeAt(words[i].length / 2) - 96) * 10) + ', ' + ((words[i].charCodeAt(words[i].length - 1) - 96) * 10) + ')',
                x: 0,
                y: 0,
                centerX: 0,
                centerY: 0,
                onScreen: false,
                hovering: false
            });
            //console.log(((words[i].charCodeAt(0) - 96) * 10), ((words[i].charCodeAt(words[i].length / 2) - 96) * 10), ((words[i].charCodeAt(words[i].length - 1)) * 10));
        }
        
        callback(blocks);
    }
    
    makeGrid(blocks, callback)
    {
        //Make initial grid state
        let grid = [];
        for(let i = 0;i < this.state.gridHeight;i++)
        {
            grid[i] = [];
            for(let j = 0;j < this.state.canvasWidth / (this.state.canvasHeight / this.state.gridHeight);j++)
            {
                grid[i][j] = 0;
            }
        }
        
        //Sort blocks into descending order
        for(let i = 0;i < blocks.length;i++)
        {
            for(let j = 0;j < blocks.length - 1;j++)
            {
                if(blocks[j].size < blocks[j + 1].size)
                {
                    const blockTemp = blocks[j];
                    blocks[j] = blocks[j + 1];
                    blocks[j + 1] = blockTemp;
                }
            }
        }
        
        //Assign blocks to grid
        for(let i = 0;i < blocks.length;i++)
        {
            //Scan upward through grid
            for(let j = grid.length - 1;j > 0;j--)
            {
                //From left to right
                for(let k = 0;k < grid[j].length;k++)
                {
                    //If current slot is available
                    if(grid[j][k] == 0)
                    {
                        //If there is enough space for the block
                        if(grid[j].length - k >= blocks[i].size && grid.length - (grid.length - j) >= blocks[i].size)
                        {
                            //Make sure no other blocks are filling the space
                            let available = true;
                            for(let l = 0;l < blocks[i].size;l++)
                            {
                                for(let x = 0;x < blocks[i].size;x++)
                                {
                                    if(grid[j - l][k + x] != 0)
                                    {
                                        available = false;
                                        break;
                                    }
                                }
                            }
                            
                            if(available)
                            {
                                blocks[i].onScreen = true;
                                
                                //Put block into grid
                                for(let l = 0;l < blocks[i].size;l++)
                                {
                                    for(let x = 0;x < blocks[i].size;x++)
                                    {
                                        grid[j - l][k + x] = blocks[i].id;
                                    }
                                }
                                
                                //Set center of block for text later
                                blocks[i].centerX = k + Math.floor(blocks[i].size / 2);
                                blocks[i].centerY = j - Math.floor(blocks[i].size / 2);
                                
                                //Break out of for loops
                                k = grid[j].length;
                                j = 0;
                            }
                        }
                    }
                }
            }
        }
        
        callback(grid);
    }
    
    renderCanvas(grid, blocks)
    {
        if(this.refs.canvas)
        {
            const ctx = this.refs.canvas.getContext('2d');
            
            //Clear canvas
            ctx.clearRect(0, 0, this.refs.canvas.width, this.refs.canvas.height);
            
            for(let i = 0;i < grid.length;i++)
            {
                for(let j = 0;j < grid[i].length;j++)
                {
                    if(grid[i][j] != 0)
                    {
                        //Render block to grid
                        ctx.fillStyle = blocks[grid[i][j] - 1].color;
                        if(blocks[grid[i][j] - 1].hovering)
                        {
                            let colors = blocks[grid[i][j] - 1].color.substring(4);
                            colors = colors.substring(0, colors.length - 1);
                            colors = colors.split(',');
                            const r = Math.ceil(parseInt(colors[0]) * 1.1);
                            const g = Math.ceil(parseInt(colors[1]) * 1.1);
                            const b = Math.ceil(parseInt(colors[2]) * 1.1);
                            ctx.fillStyle = 'rgb(' + r + ', ' + g + ', ' + b + ')';
                        }
                        ctx.beginPath();
                        ctx.fillRect(j * (this.state.canvasWidth / grid[i].length), i * (this.state.canvasHeight / grid.length), this.state.canvasWidth / grid[i].length + 1, this.state.canvasHeight / grid.length + 1);
                        ctx.closePath();
                    }
                }
            }
            
            //Render text on blocks
            ctx.font = this.state.fontSize + 'px Arial';
            ctx.fillStyle = 'black';
            for(let i = 0;i < blocks.length;i++)
            {
                if(blocks[i].onScreen)
                {
                    ctx.beginPath();
                        ctx.fillText(blocks[i].name, (blocks[i].centerX * (this.state.canvasWidth / grid[0].length)) - ((this.state.fontSize * blocks[i].name.length) / 5), blocks[i].centerY * (this.state.canvasHeight / grid.length) + this.state.fontSize);
                    ctx.closePath();
                }
            }
        }
    }
    
    render()
    {
        this.makeBlocks(this.props.words, function(blocks)
        {
            this.makeGrid(blocks, function(grid)
            {
                this.getMousePos(blocks, grid, function(blocks, grid)
                {
                    this.renderCanvas(grid, blocks);
                }.bind(this));
            }.bind(this));
        }.bind(this));
        
        return(
            <canvas id="optionsCanvas" ref="canvas" onMouseMove={this.handleMouseMove} />
        );
    }
}
