import React, { Component } from 'react'
import classNames from 'classnames'
import Isvg from 'react-inlinesvg'
import { Wrapper, Container, Row, Cell } from '../toolbox/Grid.jsx'
import ReactiveLink from '../toolbox/ReactiveLink.jsx'
import NavBar from '../toolbox/NavBar.jsx'
import Store from '../store.js'
import BackCallForm from '../components/BackCallForm.jsx'

const close = require('../../css/assets/images/close.svg')
const vk_icon = require('../../css/assets/images/vk.png')
const fb_icon = require('../../css/assets/images/fb.png')
const ok_icon = require('../../css/assets/images/ok.svg')
const is_icon = require('../../css/assets/images/is.svg')

export default class Header extends Component {
    constructor(props) {
        super(props)

        this.state = {
            curSlide: 0,
            curText: 0,
            opacity: '1'
        }

        this.showModal = this.showModal.bind(this)
        this.tick = this.tick.bind(this)
        this.changeSlider = this.changeSlider.bind(this)
        this.onMouseEnter = this.onMouseEnter.bind(this)
        this.onMouseLeave = this.onMouseLeave.bind(this)
    }

    showModal() {
        try { window.yaCounter46138809.reachGoal('open-modul') } catch (e) {}

        let modalClose = ''
        modalClose =
            <div key='close' className='modal-close'>
                <div className='close'>
                    <Isvg src={close} />
                </div>
            </div>

        Store.setData({
                modal: true,
                modalData: {
                    content: <BackCallForm cur_date={this.props.cur_date} cur_time={this.props.cur_time} />,
                    additionalContent: [modalClose]
                }
            },
            true)
    }

    componentWillReceiveProps(nextProps) {
        if (!Store.isCurrentUrl('/')) {
            this.setState({
                curSlide: 0,
                curText: 0
            })
            clearInterval(this.timer)
        }
    }

    componentDidMount() {
        if (Store.isCurrentUrl('/')) {
            this.props.slider.map((slide) => {
                let img = new Image()
                img.src = slide.img
            })
            this.timer = setInterval(this.tick, 5000)
        } else {
            this.setState({
                curSlide: 0,
                curText: 0
            })
            clearInterval(this.timer)
        }
    }

    componentWillUnmount() {
        clearInterval(this.timer)
    }

    tick() {
        this.setState({ opacity: '0' })
        let next = this.state.curSlide < (this.props.slider.length - 1) ? this.state.curSlide + 1 : 0
        this.setState({
            curSlide: next,
            opacity: '0'
        })
        setTimeout(() => {
            this.setState({
                curText: next,
                opacity: '1'
            })
        }, 1000)
    }

    changeSlider(e) {
        let next = parseInt(e.target.id)
        this.setState({
            curSlide: next,
            opacity: '0'
        })
        setTimeout(() => {
            this.setState({
                curText: next,
                opacity: '1'
            })
        }, 1000)
    }

    onMouseEnter() {
        clearInterval(this.timer)
    }

    onMouseLeave() {
        if (Store.isCurrentUrl('/')) {
            this.timer = setInterval(this.tick, 5000)
        }
    }

    render() {
        let header_info
        let bullets = []
        if (this.props.main_header && this.props.slider) {
            if (this.props.slider[this.state.curText]) {
                header_info =
                    <div className='header__info' style={{ opacity: this.state.opacity }}>
                        <h1>{this.props.slider[this.state.curText].header}</h1>
                        <p>{this.props.slider[this.state.curText].text}</p>
                    </div>
            }

            for (let i = 0; i < this.props.slider.length; i++) {
                bullets.push(
                    <div key={this.props.slider[i].img} className='header__bullet-before'>
                        <div id={i} className={classNames('header__bullet', { active: i == this.state.curSlide })}
                            onClick={this.changeSlider} />
                    </div>
                )
            }
        }

        let backgroundImage
        if (this.props.slider[this.state.curSlide]) {
            backgroundImage = 'url(' + this.props.slider[this.state.curSlide].img + ')'
        }
        return (
            <div className='header__before' style={{ backgroundImage: backgroundImage }}
                onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
                <header className={classNames('header', { 'header__main': this.props.main_header })}>
                    <div id='header' className='header__top-content'>
                        <Wrapper>
                            <Container>
                                <Row className='header__row'>
                                    <Cell className='header__logo'>
                                        <ReactiveLink href='/'>
                                            <img src='/logo.png' alt='Флеболог Калачев' />
                                        </ReactiveLink>
                                    </Cell>
                                    <Cell className='header__name'>
                                        Калачев Иван Ильич
                                    </Cell>
                                    <Cell className='header__text'>
                                        Лечение всех стадий варикозной болезни
                                    </Cell>
                                    <Cell className='header__contacts'>
                                        <span>Москва, Алтуфьевское шоссе, 48</span>
                                        <div className='header__phone'>
                                            <a className='after-border ya-phone' href='tel:+7 (495) 627-67-08'>
                                                +7 (495) 627-67-08
                                            </a>
                                        </div>
                                    </Cell>
                                    <Cell className='header__call'>
                                        {this.props.social_vk!="" ? <a target='_blank' href={this.props.social_vk}><img src={vk_icon} alt='vk' /></a>: null }
                                        {this.props.social_fb!="" ? <a target='_blank' href={this.props.social_fb}><img src={fb_icon} alt='fb' /></a>: null }
                                        {this.props.social_ok!="" ? <a target='_blank' href={this.props.social_ok}><img src={ok_icon} alt='ok' /></a>: null }
                                        {this.props.social_ig!="" ? <a target='_blank' href={this.props.social_ig}><img src={is_icon} alt='is' /></a>: null }                                
                                        <button className='btn btn-bordered btn--backcall-header'
                                            onClick={this.showModal}>
                                            ЗАПИСЬ НА ПРИЕМ
                                        </button>
                                    </Cell>
                                </Row>
                            </Container>
                        </Wrapper>
                    </div>
                    <NavBar cur_date={this.props.cur_date} cur_time={this.props.cur_time} tabs={this.props.tabs} />

                    {header_info}
                    <div className='header__bullets'>
                        {bullets}
                    </div>
                </header>
            </div>
        )
    }
}
