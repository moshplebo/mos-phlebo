import React, {Component} from 'react'
import classNames from 'classnames'
import Store from '../store.js'

export default class ReactiveLink extends Component {
    constructor(props) {
        super(props)
        this.state = {ripples: []}
    }

    componentWillUnmount() {
        clearTimeout(this.rippleTimeout)
    }

    rippleTimeout: ''

    handleClick(e, href, el) {
        if (!Modernizr.history || e.shiftKey || e.ctrlKey || e.metaKey) {
            return true
        }
        e.preventDefault()

        if (this.props.stopPropagation) {
            return
        }

        if (this.props.post_link) {
            Store.goToPost(href)
        } else {
            Store.goTo(href)
        }

        if (!this.props.disableRiples) {

            let bound = el.getBoundingClientRect()

            if (e.pageX == 0 && e.pageY == 0) {
                let ripples = this.state.ripples
                ripples.push(
                    {
                        left: bound.width / 2,
                        top: bound.height / 2,
                        key: Date.now().toString()
                    }
                )
                this.setState({ripples})
            } else {
                let ripples = this.state.ripples
                ripples.push(
                    {
                        left: e.clientX - bound.left,
                        top: e.clientY - bound.top,
                        key: Date.now().toString()
                    }
                )
                this.setState({ripples})
            }

            this.rippleTimeout = setTimeout(function () {
                let ripples = this.state.ripples
                ripples.shift()
                this.setState({ripples})
            }.bind(this), 330)

        }
    }

    render() {
        let ripples = this.state.ripples.map(function (element) {
            return (<Ripple key={element.key} {...element}  />)
        })

        let content = this.props.text || this.props.children

        return (
            <a href={this.props.href} ref="link"
               onClick={(event) => this.handleClick(event, this.props.href, this.refs.link)}
               style={{position: 'relative'}}
               className={classNames(this.props.className)}>
                {content}
                {ripples}
            </a>
        )
    }

}

class Ripple extends Component {
    render() {
        return (
            <span style={{left: this.props.left, top: this.props.top}}
                  className={classNames('ripple', {active: this.props.active})}/>
        )
    }
}
