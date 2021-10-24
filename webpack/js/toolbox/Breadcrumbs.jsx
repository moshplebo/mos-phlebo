import React, {Component} from 'react'
import classNames from 'classnames';
import ReactiveLink from './ReactiveLink.jsx'

export default class Breadcrumbs extends Component {
    render() {
        let i = 0;
        let breadcrumbs = this.props.breadcrumbs.map((element) => {
            i++;
            return (<span key={element.href}><ReactiveLink key={i} {...element} />&nbsp;&rarr; </span>);
        });

        return (
            <div className={classNames('breadcrumbs', {empty: this.props.breadcrumbs.length == 0})}>
                {breadcrumbs}
            </div>
        );
    }
}
