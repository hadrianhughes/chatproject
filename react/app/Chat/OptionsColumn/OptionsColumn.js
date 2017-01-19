import React from 'react';

import OptionsCanvas from './OptionsCanvas';

export default class OptionsColumn extends React.Component
{
    render()
    {
        return(
            <td id="options-column">
                {this.props.filters.length > 0 ? <OptionsCanvas filters={this.props.filters} /> : null}
            </td>
        );
    }
}
