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
            isNearby: false
        };
        
        this.handleRecClick = this.handleRecClick.bind(this);
        this.handleNearbyClick = this.handleNearbyClick.bind(this);
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
        this.setState({
            isNearby: true,
            isRecommended: false
        });
    }
    
    render()
    {
        return(
            <td id="options-column">
                <table>
                    <tbody>
                        <tr>
                            <td><button className={this.state.isRecommended ? "canvas-button active" : "canvas-button"} onClick={this.handleRecClick}>Recommended</button></td>
                            <td><button className={this.state.isNearby ? "canvas-button active" : "canvas-button"} onClick={this.handleNearbyClick}>Nearby</button></td>
                        </tr>
                    </tbody>
                </table>
                {/*this.state.isRecommended ? <RecommendedCanvas words={this.props.words} /> : null*/}
                {/*this.state.isNearby ? <NearbyCanvas filters={this.props.filters} /> : null*/}
                {this.state.isRecommended ? <RecommendedBlocks words={this.props.words} onConnect={this.props.onConnect} /> : null}
                {this.state.isNearby ? <NearbyBlocks filters={this.props.filters} onConnect={(name) => this.props.onConnect(name)} /> : null}
            </td>
        );
    }
}
