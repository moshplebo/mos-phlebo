import React, {Component} from 'react'
import classNames from 'classnames'
import Isvg from 'react-inlinesvg'
import {Wrapper, Container, Row, Cell} from '../toolbox/Grid.jsx'
import Breadcrumbs from '../toolbox/Breadcrumbs.jsx'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import Store from '../store.js'
import BackCallForm from '../components/BackCallForm.jsx'

const close = require('../../css/assets/images/close.svg')

export default class PublicLayout extends Component {
    constructor(props) {
        super(props)

        this.state = { backCallFixed: false }

        this.handleScroll = this._handleScroll.bind(this)
        this.showModal = this.showModal.bind(this)
    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll)

        let header = document.getElementsByClassName('header__top-content')[0]
        let btn = document.getElementsByClassName('btn--backcall-header')[0]

        let bodyRect =  document.body.getBoundingClientRect(),
            headerRect = header.getBoundingClientRect()

        let topBp = headerRect.height
        let backCallFixed = document.body.scrollTop >= topBp

        this.setState({ topBp: topBp, backCallFixed: backCallFixed })
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.h1 != this.props.h1) {
            let header = document.getElementsByClassName('header__top-content')[0]
            let btn = document.getElementsByClassName('btn--backcall-header')[0]

            let backCallFixed = document.body.scrollTop >= this.state.topBp

            this.setState({ backCallFixed: backCallFixed })
        }
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll)
    }

    _handleScroll() {
        if (document.body.scrollTop >= this.state.topBp) {
            this.setState({ backCallFixed: true })
        } else {
            this.setState({ backCallFixed: false })
        }
    }

    showModal() {
        try { window.yaCounter46138809.reachGoal('open-modul') } catch (e) {}

        let modalClose = ''
        modalClose =
            <div key="close" className="modal-close">
                <div className="close">
                    <Isvg src={close}/>
                </div>
            </div>

        Store.setData({
                modal: true,
                modalData: {
                    content: <BackCallForm cur_date={this.props.cur_date} cur_time={this.props.cur_time}/>,
                    additionalContent: [modalClose]
                }
            },
            true)
    }

    render() {
        const childrenWithProps = React.Children.map(this.props.children,
            (child) => React.cloneElement(child, this.props)
        )

        let breadcrumbs
        if (this.props.breadcrumbs && this.props.breadcrumbs.length > 0) {
            breadcrumbs = (
                <Wrapper>
                    <Container>
                        <Row>
                            <Cell>
                                <Breadcrumbs breadcrumbs={this.props.breadcrumbs}/>
                            </Cell>
                        </Row>
                    </Container>
                </Wrapper>
            )
        }

        return (
            <div>
                <Header main_header={this.props.main_header} cur_time={this.props.cur_time}
                        cur_date={this.props.cur_date} tabs={this.props.top_menu}
                        slider={this.props.slider} h1={this.props.h1} social_vk={this.props.social_vk}
                        social_fb={this.props.social_fb} social_ok={this.props.social_ok} social_ig={this.props.social_ig}/>

                <div className="view-content">
                    {breadcrumbs}

                    {childrenWithProps}

                    <Footer tabs={this.props.footer_menu} social_vk={this.props.social_vk}
                        social_fb={this.props.social_fb} social_ok={this.props.social_ok} social_ig={this.props.social_ig}/>

                    <div style={{right: this.state.fixedRight}}
                         className={classNames('backcall-fixed', {active: this.state.backCallFixed})}>
                        <button className='btn btn-bordered btn--backcall-header' onClick={this.showModal}>
                            ЗАПИСЬ НА ПРИЕМ
                        </button>
                    </div>
                </div>
            </div>

        )
    }
}
