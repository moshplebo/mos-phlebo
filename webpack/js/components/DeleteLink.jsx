import React, {Component} from 'react'
import Store from '../store.js'
import Superagent from 'superagent'

export default class DeleteLink extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event) {
        if (confirm('Вы уверены?')) {
            Superagent('delete', this.props.href).set('Accept', 'application/json').end(function (err, res) {
                if (res.ok) {
                    let data = JSON.parse(res.text);
                    Store.updatePage(data);
                }
            }.bind(this));
        }
    }

    render() {
        return (
            <button onClick={this.handleClick} type="button" className={this.props.className}>
                {this.props.children}
            </button>
        );
    }
}
