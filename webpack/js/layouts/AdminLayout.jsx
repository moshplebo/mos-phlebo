import React, {Component} from 'react'
import classNames from 'classnames';
import ReactiveLink from '../toolbox/ReactiveLink.jsx'
import Store from '../store.js'
import {Wrapper, Container, Row, Cell} from '../toolbox/Grid.jsx'

export default class AdminLayout extends Component {
    render() {
        const childrenWithProps = React.Children.map(this.props.children, (child) => React.cloneElement(child, this.props));

        let left_menu = [];
        this.props.left_menu.map(function(element) {
            let icon = '';
            if (element.icon) {
                icon = (<i className={"mdi mdi-" + element.icon}/>)
            }

            left_menu.push(
                <ReactiveLink key={element.href} className={classNames({
                    'admin_menu_item-active': Store.isCurrentOrParentUrl(element.href)
                }, "admin_menu_item")} href={element.href}>
                    {icon}
                    {element.text}
                </ReactiveLink>
            );
        });

        return (
            <div>
                <AdminNavbar key='admin-navbar' logo={this.props.logo} controls={this.props.controls}
                    user_name={this.props.user_name} logo_text={this.props.logo_text} />
                <Row className="has-navbar-fixed">
                    <div className="admin_menu-wrapper">
                        <nav className="admin_menu">{left_menu}</nav>
                    </div>
                    <div className="admin_content">
                        {childrenWithProps}
                    </div>
                </Row>
            </div>
        );
    }
}


class AdminNavbar extends Component {
    render() {
        let logo = ''

        if (this.props.logo) {
            logo = <img src={this.props.logo} alt="Флеболог Калачев"/>
        } else if (this.props.logo_text) {
            logo = <span>{this.props.logo_text}</span>
        }

        let controls = []

        if (this.props.controls) {
            this.props.controls.map(function(element) {
                controls.push(
                    <ReactiveLink key={element.href} className="btn admin-control nav_tab-item" href={element.href}>
                        <i className={"mdi mdi-"+element.icon}/>
                        <span>{element.text}</span>
                    </ReactiveLink>
                )
            })
        }

        return (
            <nav className="navbar admin-navbar">
                <Row>
                    <div>
                        <a href="/" className='navbar-logo'>
                            {logo}
                        </a>
                    </div>
                    <div>
                        <div className="nav_tabs float-left">
                            {controls}
                        </div>
                        <div className="nav_tabs float-right">
                            <div className="admin-user">
                                <i className="nav_tab-item mdi mdi-account"></i>
                                <span className="nav_tab-item user-name">{this.props.user_name}</span>
                            </div>
                            <ReactiveLink className="nav_tab-item" href="/logout" post_link="true">
                                <i className="mdi mdi-logout"></i>
                            </ReactiveLink>
                        </div>
                    </div>
                </Row>
            </nav>
        );
    }
}
