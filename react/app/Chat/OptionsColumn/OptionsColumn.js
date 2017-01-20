import React from 'react';

import OptionsCanvas from './OptionsCanvas';
import RecommendedCanvas from './RecommendedCanvas';
import NearbyCanvas from './NearbyCanvas';

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
                {this.state.isRecommended && this.props.words ? <RecommendedCanvas words={this.props.words} /> : null}
                {this.state.isNearby && this.props.filters ? <NearbyCanvas filters={this.props.filters} /> : null}
                {/*{this.props.filters.length > 0 ? <OptionsCanvas filters={this.props.filters} words={this.props.words} /> : null}*/}
            </td>
        );
    }
}
