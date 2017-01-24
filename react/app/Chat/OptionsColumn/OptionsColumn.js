import React from 'react';

import RecommendedBlocks from './RecommendedBlocks';
import NearbyBlocks from './NearbyBlocks';

export default class OptionsColumn extends React.Component
{
    constructor()
    {
        super();
        
        this.state = {
            isRecommended: true,
            isNearby: false,
            componentWidth: 0,
            componentHeight: 0
        };
        
        this.handleRecClick = this.handleRecClick.bind(this);
        this.handleNearbyClick = this.handleNearbyClick.bind(this);
    }
    
    componentDidMount()
    {
        this.setState({
            componentWidth: this.refs.optionsColumn.clientWidth,
            componentHeight: this.refs.optionsColumn.clientHeight
        });
    }
    
    handleRecClick()
    {
        this.setState({
            isRecommended: true,
            isNearby: false
        });
    }
    
    handleNearbyClick()
    {
        socket.emit('getFilters');
        
        this.setState({
            isNearby: true,
            isRecommended: false
        });
    }
    
    render()
    {
        return(
            <td id="options-column" ref="optionsColumn">
                <table>
                    <tbody>
                        <tr>
                            <td><button className={this.state.isRecommended ? "canvas-button active" : "canvas-button"} onClick={this.handleRecClick}>Recommended</button></td>
                            <td><button className={this.state.isNearby ? "canvas-button active" : "canvas-button"} onClick={this.handleNearbyClick}>Nearby</button></td>
                        </tr>
                    </tbody>
                </table>
                {this.state.isRecommended ? <RecommendedBlocks words={this.props.words} width={this.state.componentWidth} height={this.state.componentHeight - (window.innerHeight / 10)} onConnect={this.props.onConnect} /> : null}
                {this.state.isNearby ? <NearbyBlocks filters={this.props.filters} onConnect={(name) => this.props.onConnect(name)} /> : null}
            </td>
        );
    }
}
