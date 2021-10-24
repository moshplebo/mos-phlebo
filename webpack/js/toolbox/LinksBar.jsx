import React, {Component} from 'react'
import classNames from 'classnames';
import ReactiveLink from './ReactiveLink'

export default class LinksBar extends Component {

    render() {

        let i = 0;
        let links = this.props.links.map(function(element) {
            i++;
            return (<ReactiveLink key={i} {...element} disableRiples={true} />);
        });

        return (
            <div className={classNames("links_bar", this.props.className)}>
                {links}
            </div>
        );
    }

}
