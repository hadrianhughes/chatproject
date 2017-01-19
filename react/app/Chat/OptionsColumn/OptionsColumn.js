import React from 'react';

import OptionsCanvas from './OptionsCanvas';

export default class OptionsColumn extends React.Component
{
    render()
    {
        return(
            <td id="options-column">
                <table>
                    <tbody>
                        <tr>
                            <td><button className="canvas-button">Recommended</button></td>
                            <td><button className="canvas-button">Nearby</button></td>
                        </tr>
                    </tbody>
                </table>
                {this.props.filters.length > 0 ? <OptionsCanvas filters={this.props.filters} words={this.props.words} /> : null}
            </td>
        );
    }
}
