import React, {Component} from 'react'
import classNames from 'classnames';
import ReactiveLink from '../../toolbox/ReactiveLink.jsx'
import Hero from '../../toolbox/Hero.jsx'

export default class ErrorView extends Component {

    render() {
        let link_href = this.props.link_href || '/'
        let link_text = this.props.link_text || 'Перейти на главную страницу'

        return (

            <Hero className="hero-first">
                <h1>{this.props.h1}</h1>
                <p className="h1-subheader">{this.props.text}</p>
                <p>
                    <a href={link_href} className="btn btn-primary">{link_text}</a>
                </p>
            </Hero>

        );
    }

}
