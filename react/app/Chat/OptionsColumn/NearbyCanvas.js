import React from 'react';

export default class NearbyCanvas extends React.Component
{
    constructor(props)
    {
        super(props);
        
        this.state = {
            mounted: false,
            gridHeight: 40,
            canvasWidth: (window.innerWidth / 100) * 25,
            canvasHeight: window.innerHeight - ((window.innerHeight / 100) * 8),
            fontSize: 20
        };
    }
    
    componentDidMount()
    {
        this.setState({
            mounted: true
        });
        
        this.refs.canvas.width = this.state.canvasWidth;
        this.refs.canvas.height = this.state.canvasHeight;
    }
    
    makeBlocks(filters, callback)
    {
        let blocks = [];
        for(let i = 0;i < filters.length;i++)
        {
            blocks.push({
                id: i + 1,
                name: filters[i].value,
                //size: Math.floor(Math.random() * 5) + 4,
                size: filters[i].count + 3,
                //color: 'rgb(' + Math.floor(Math.random() * 255) + ', ' + Math.floor(Math.random() * 255) + ', ' + Math.floor(Math.random() * 255) + ')',
                color: 'rgb(' + (filters[i].value.charCodeAt(0) * 2) + ', ' + (filters[i].value.charCodeAt(filters[i].value.length / 2) + filters[i].value.charCodeAt(0)) + ', ' + (filters[i].value.charCodeAt(filters[i].value.length - 1) + filters[i].value.charCodeAt(filters[i].value.length / 2)) + ')',
                x: 0,
                y: 0,
                centerX: 0,
                centerY: 0,
                onScreen: false
            });
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
        this.makeBlocks(this.props.filters, function(blocks)
        {
            this.makeGrid(blocks, function(grid)
            {
                this.renderCanvas(grid, blocks);
            }.bind(this));
        }.bind(this));
        
        return(
            <canvas id="optionsCanvas" ref="canvas" />
        );
    }
}
