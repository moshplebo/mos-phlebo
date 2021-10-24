import React, { Component } from 'react'
import classNames from 'classnames';

export default class Dialog extends Component {
    constructor(props) {
        super(props);

        this.state = {}
    }

    render() {
        return (
            <li className={classNames("toolbox__dialog", {hide: this.state.hide})}
                onClick={() => this.setState({hide: true})}>
                {this.props.children}
            </li>
        )
    }
}
