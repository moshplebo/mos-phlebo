import React, {Component} from 'react'
import ReactiveLink from './ReactiveLink.jsx';
import classNames from 'classnames';
import Store from '../store.js'

export default class NavTabs extends Component {
    render() {
        let i = 0;
        let links = this.props.tabs.map((element) => {
            i++;
            if (element.childs.length > 0) {
                return (<NavTabDropdown key={i} {...element}/>);
            } else {
                return (<NavTab key={i} {...element}/>);
            }
        });

        return (
            <nav ref='nav' className={classNames('nav_tabs', this.props.className)}>
                {links}
            </nav>
        );
    }
}

class NavTab extends Component {
    render() {
        return (
            <ReactiveLink href={this.props.href} post_link={this.props.post_link}
             className={classNames('nav_tab-link', {nav_tab_active: Store.isCurrentOrParentUrl(this.props.href)})}>
                {this.props.text.toUpperCase()}
            </ReactiveLink>
        );
    }
}

class NavTabDropdown extends Component {
    constructor(props) {
        super(props);

        this.state = { dropdown: false };

        this.showDropdown = () => this.setState({dropdown: true});
        this.hideDropdown = () => {
            this.setState({dropdown: false});
        };
    }

    render() {
        let dropDown;
        if (this.props.childs.length > 0) {
            let dropDownItems = this.props.childs.map((element, index) => {
                return (
                    <ReactiveLink key={index} href={element.href} className='nav_tab-dropdown__link'>
                        {element.text}
                    </ReactiveLink>
                );
            });
            dropDown = <div className={classNames("dropdown", {open: this.state.dropdown})}>
                {dropDownItems}
            </div>;
        }

        return (
            <div className="nav_tab-item" onMouseEnter={this.showDropdown} onMouseLeave={this.hideDropdown} onClick={this.hideDropdown}>
                <ReactiveLink href={this.props.href} post_link={this.props.post_link}
                    className={classNames({nav_tab_active: Store.isCurrentOrParentUrl(this.props.href)}, 'nav_tab-item__link')}>
                    {this.props.text.toUpperCase()}
                </ReactiveLink>
                {dropDown}
            </div>
        )
    }
}
