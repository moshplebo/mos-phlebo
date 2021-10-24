import React, { Component } from 'react'
import Wysiwyg from './wysiwyg/Wysiwyg.jsx'

export default class InputWysiwyg extends Component {
    constructor(props) {
        super(props);

        this.state = { content: this.props.content || "", loading: true }
        this.handleChage = this._handleChage.bind(this)
    }

    componentDidMount() {
        this.setState({ loading: false })
    }

    _handleChage(newContent) {
        this.setState({ content: newContent });
    }

    render() {
        const hiddenArea = {
            width: 0,
            height: 0,
            position: 'absolute',
            left: -999999
        }

        return (
            <div>
                {!this.state.loading
                    ? <Wysiwyg onChange={this.handleChage} content={this.state.content} />
                    : <div className="animate_spin"><i className="mdi mdi-reload "/></div>}
                <textarea name={this.props.name}
                    value={this.state.content} readOnly={true} style={hiddenArea} />
            </div>
        )
    }

}
