import React, {Component} from 'react'
import classNames from 'classnames'
import ReactiveLink from './ReactiveLink.jsx'
import Swipeable from 'react-swipeable'
import Store from '../store.js'

export default class Drawer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            active: true
        }

        this.onScrollHandler = this.onScrollHandler.bind(this)
        this.onScrollContentHandler = this.onScrollContentHandler.bind(this)
    }

    onScrollHandler(e) {
        e.persist()
        e.stopPropagation()
        e.preventDefault()
        e.returnValue = false
        return false
    }

    swipe: 0

    onScrollContentHandler(e, elem, deltaY) {
        e.persist()
        e.stopPropagation()
        e.preventDefault()
        const scrollTop = elem.scrollTop
        const scrollHeight = elem.scrollHeight
        const height = elem.clientHeight
        const wheelDelta = deltaY || e.deltaY
        const isDeltaPositive = wheelDelta > 0

        if (isDeltaPositive && wheelDelta > scrollHeight - height - scrollTop) {
            elem.scrollTop = scrollHeight
        }
        else if (!isDeltaPositive && -wheelDelta > scrollTop) {
            elem.scrollTop = 0
        } else {
            if (deltaY) {
                elem.scrollTop += wheelDelta - this.swipe
                this.swipe = deltaY
            } else {
                elem.scrollTop += wheelDelta
            }
        }
    }

    onClickContentHandler(e) {
        e.stopPropagation()
    }

    render() {
        let logo = <img src='/logo.png'/>
        if (this.props.logo) {
            logo = <img src={this.props.logo}/>
        }

        return (
            <Swipeable key='fader' className='fader' ref={fader => this.fader = fader} onWheel={this.onScrollHandler}
                       onSwipingUp={this.onScrollHandler} onSwipingDown={this.onScrollHandler}>
                <aside ref={fc => this.fc = fc} className='drawer fader_content' onClick={this.onClickContentHandler}
                       onWheel={(event) => this.onScrollContentHandler(event, this.fc)}>
                    <Swipeable
                        onSwipingDown={(event, deltaY) => this.onScrollContentHandler(event, this.fc, -deltaY)}
                        onSwipingUp={(event, deltaY) => this.onScrollContentHandler(event, this.fc, deltaY)}
                        onSwiped={(event) => (this.swipe = 0)}>

                        <ReactiveLink href='/' className='drawer-logo'>
                            {logo}
                        </ReactiveLink>

                        <nav className='menu'>
                            <DrawerMenu childs={this.props.menu}/>
                        </nav>
                    </Swipeable>
                </aside>
            </Swipeable>
        )
    }
}


class DrawerMenu extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isOpen: null
        }
    }

    onClick(index, childs = []) {
        if (this.state.isOpen !== index && childs.length > 0) {
            this.setState({
                isOpen: index
            })
        }
    }

    render() {
        let i = 0
        let links = this.props.childs.map((element, index) => {
            i++
            let submenu = ''
            let condition = element.childs && element.childs.length > 0 && !(this.state.isOpen === index)
            if (element.childs && this.state.isOpen === index) {
                submenu = <DrawerMenu childs={element.childs}/>
            }

            return (
                <li key={i} onClick={() => this.onClick(index, element.childs)}>
                    <ReactiveLink {...element} stopPropagation={condition}
                                  className={classNames({active: Store.isCurrentOrParentUrl(element.href)})}>
                        {element.text}
                    </ReactiveLink>

                    {submenu}
                </li>
            )
        })

        return (
            <ul>
                {links}
            </ul>
        )
    }
}
