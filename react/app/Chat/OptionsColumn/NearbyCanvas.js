import React from 'react';

export default class NearbyCanvas extends React.Component
{
    constructor()
    {
        super();
        
        
    }
    
    render()
    {
        return(
            <canvas id="optionsCanvas" ref="canvas" />
        );
    }
}
