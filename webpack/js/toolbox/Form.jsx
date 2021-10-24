import React, { Component } from 'react'
import classNames from 'classnames';
import Store from '../store.js'
import serialize from 'form-serialize'

export default class Form extends Component {

    handleSubmit(event, action, method) {

        event.preventDefault();

        if (method == 'get') {
            Store.sendFormGet(action, serialize(event.target, { hash: true }));
        } else {
            Store.sendFormPost(action, new FormData(event.target), method);
        }
        return false;
    }

    render() {

        let csrf = '';
        if (this.props.method != 'get') {
            csrf = <input type="hidden" name='csrf_token' value={Store.csrfToken()} />;
        }

        let enctype = "application/x-www-form-urlencoded"

        if (this.props.withFiles) {
            enctype = "multipart/form-data"
        }

        return (

            <form encType={enctype} action={this.props.action} method={this.props.method}
                onSubmit={(event) => {
                    if (typeof(this.props.onSubmit) == 'function') {
                        this.props.onSubmit()
                    }
                    this.handleSubmit(event, this.props.action, this.props.method)}
                }
                className={this.props.className} id={this.props.id}>
                {csrf}
                {this.props.children}
            </form>

        );
    }

}
