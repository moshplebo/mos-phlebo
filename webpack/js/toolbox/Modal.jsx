import React, {Component} from 'react'
import classNames from 'classnames';
import Swipeable from 'react-swipeable';
import Store from '../store.js'

export default class Modal extends Component {
    constructor(props) {
        super(props)

        this.onScrollHandler = this.onScrollHandler.bind(this)
        this.onScrollContentHandler = this.onScrollContentHandler.bind(this)
    }

    componentWillMount() {
        if (this.props.willMount) {
            this.props.willMount()
        }
    }

    componentDidMount() {
        document.addEventListener("keydown", this.onEscapePress)

        if (this.props.didMount) {
            this.props.didMount()
        }
    }

    componentWillUnmount() {
        if (this.props.willUnmount) {
            this.props.willUnmount()
        }
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
        var scrollTop = elem.scrollTop
        var scrollHeight = elem.scrollHeight
        var height = elem.clientHeight
        var wheelDelta = deltaY || e.deltaY
        var isDeltaPositive = wheelDelta > 0

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

    closeModal() {
        Store.setData({modal: false}, true)
    }

    onEscapePress(e) {
        if (e.keyCode == 27) {
            Store.setData({modal: false}, true)
        }
    }

    render() {
        let modalClose
        if (this.props.modalClose) {
            if (this.props.modalCloseComponent) {
                modalClose = this.props.modalCloseComponent
            } else {
                modalClose = <i className="mdi mdi-close"></i>
            }
            modalClose = <div className="modal-close" onClick={this.closeModal}>{modalClose}</div>
        }

        let actions = []
        let actionsBlock
        if (this.props.cancel) {
            actions.push(
                <button
                    className={classNames('btn', this.props.cancel.className)}
                    onClick={this.closeModal}>
                    {this.props.cancel.text || 'Закрыть'}
                </button>
            )
        }
        if (actions.length > 0) {
            actionsBlock = (
                <div className="modal-actions">
                    {actions}
                </div>
            )
        }

        let header
        if (this.props.header) {
            header = <h3>{this.props.header}</h3>
        }

        return (
            <Swipeable key="fader" className="fader" ref='fader'
                       onWheel={this.onScrollHandler}
                       onSwipingUp={this.onScrollHandler}
                       onSwipingDown={this.onScrollHandler}>
                <div ref={fc => this.fc = fc} className={classNames("modal fader_content", this.props.className)}
                     onClick={this.onClickContentHandler}
                     onWheel={(event) => this.onScrollContentHandler(event, this.fc)}>
                    {modalClose}
                    <Swipeable
                        onSwipingDown={(event, deltaY) => this.onScrollContentHandler(event, this.fc, -deltaY)}
                        onSwipingUp={(event, deltaY) => this.onScrollContentHandler(event, this.fc, deltaY)}
                        onSwiped={(event) => (this.swipe = 0)}>
                        {header}
                        {this.props.content}
                        {actionsBlock}
                    </Swipeable>
                </div>
                {this.props.additionalContent}
            </Swipeable>
        )
    }
}
