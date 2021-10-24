import React, { Component } from 'react'
import classNames from 'classnames'
import { Wrapper, Container, Row, Cell } from '../toolbox/Grid.jsx'
import ReactiveLink from '../toolbox/ReactiveLink.jsx'
import Store from '../store.js'

const depix = require('../../css/assets/images/depix.png')
const vk_icon = require('../../css/assets/images/vk.png')
const fb_icon = require('../../css/assets/images/fb.png')
const ok_icon = require('../../css/assets/images/ok.svg')
const is_icon = require('../../css/assets/images/is.svg')

export default class Footer extends Component {
    render() {
        let vrach
        vrach = this.props.tabs['vash_vrach'] ?
                <Vrach tabs={this.props.tabs['vash_vrach']} post_link={this.props.post_link} /> : ''

        let varikoz
        varikoz = this.props.tabs['articles'] ?
                  <Varikoz tabs={this.props.tabs['articles']} post_link={this.props.post_link} /> : ''

        let healings
        healings = this.props.tabs['healings'] ?
                   <Healings tabs={this.props.tabs['healings']} post_link={this.props.post_link} /> : ''

        let nonresident
        nonresident = this.props.tabs['inogorodnim_patsientam'] ?
                      <Nonresident tabs={this.props.tabs['inogorodnim_patsientam']}
                          post_link={this.props.post_link} /> : ''

        let operations
        operations = this.props.tabs['sovremennye_operatsii'] ?
                     <Operations tabs={this.props.tabs['sovremennye_operatsii']} post_link={this.props.post_link} /> :
                     ''

        let other_tabs
        other_tabs = [
            this.props.tabs['novelties'], this.props.tabs['fotogalereya'], this.props.tabs['kontakty'],
            this.props.tabs['tseny'], this.props.tabs['comments']
        ]
        let other
        other = other_tabs ? <Other tabs={other_tabs} post_link={this.props.post_link} /> : ''

        return (
            <div className="footer__before">
                <footer className='footer'>
                    <Wrapper>
                        <Container>
                            <Row>
                                <div className='footer__navbar-wrapper'>
                                    <Cell sm="1-4">
                                        {vrach}
                                        {varikoz}
                                        <div className='footer__expert'>
                                            <img src={require('../../css/assets/images/expert_logo.png')}
                                                alt='ООО "Клиника экспертных медицинских технологий"' />
                                            <p>
                                                ООО "Клиника экспертных<br />
                                                медицинских технологий"
                                            </p>
                                        </div>
                                    </Cell>
                                    <Cell sm="1-4">
                                        {healings}
                                    </Cell>
                                    <Cell sm="1-4">
                                        {nonresident}
                                        {operations}
                                    </Cell>
                                    <Cell sm="1-4">
                                        {other}
                                        <div className="footer__social-buttons">
                                           {this.props.social_vk!="" ? <a target='_blank' href={this.props.social_vk}><img src={vk_icon} alt='vk' /></a>: null }
                                           {this.props.social_fb!="" ? <a target='_blank' href={this.props.social_fb}><img src={fb_icon} alt='fb' /></a>: null }
                                           {this.props.social_ok!="" ? <a target='_blank' href={this.props.social_ok}><img src={ok_icon} alt='ok' /></a>: null }
                                           {this.props.social_ig!="" ? <a target='_blank' href={this.props.social_ig}><img src={is_icon} alt='is' /></a>: null } 
                                        </div>
                                        <p className="footer__depix">
                                            Разработка сайта
                                            <a href='http://depix.ru' target='_blank'><img src={depix} /></a>
                                        </p>
                                    </Cell>
                                </div>
                            </Row>
                        </Container>
                    </Wrapper>
                </footer>
            </div>
        )
    }
}

class Vrach extends Component {
    render() {
        let childs = []
        this.props.tabs.childs.map((element) => {
            childs.push(
                <ReactiveLink key={element.id} href={element.href} post_link={this.props.post_link}
                    className={classNames('nav_tab-link', { active: Store.isCurrentOrParentUrl(element.href) })}>
                    {element.text}
                </ReactiveLink>
            )
        })

        return (
            <div className="footer__block">
                <ReactiveLink href={this.props.tabs.href} post_link={this.props.post_link}
                    className={classNames('nav_tab-link', { active: Store.isCurrentOrParentUrl(this.props.tabs.href) })}>
                    {this.props.tabs.text.toUpperCase()}
                </ReactiveLink>
                <div className="footer__childs">
                    {childs}
                </div>
            </div>
        )
    }
}

class Varikoz extends Component {
    render() {
        return (
            <div className="footer__block">
                <ReactiveLink href={this.props.tabs.href} post_link={this.props.post_link}
                    className={classNames('nav_tab-link', { active: Store.isCurrentOrParentUrl(this.props.tabs.href) })}>
                    {this.props.tabs.text.toUpperCase()}
                </ReactiveLink>
            </div>
        )
    }
}

class Healings extends Component {
    render() {
        let childs = []
        this.props.tabs.childs.map((element) => {
            childs.push(
                <ReactiveLink key={element.id} href={element.href} post_link={this.props.post_link}
                    className={classNames('nav_tab-link', { active: Store.isCurrentOrParentUrl(element.href) })}>
                    {element.text}
                </ReactiveLink>
            )
        })

        return (
            <div className="footer__block">
                <ReactiveLink href={this.props.tabs.href} post_link={this.props.post_link}
                    className={classNames('nav_tab-link', { active: Store.isCurrentOrParentUrl(this.props.tabs.href) })}>
                    {this.props.tabs.text.toUpperCase()}
                </ReactiveLink>
                <div className="footer__childs">
                    {childs}
                </div>
            </div>
        )
    }
}

class Nonresident extends Component {
    render() {
        let childs = []
        this.props.tabs.childs.map((element) => {
            childs.push(
                <ReactiveLink key={element.id} href={element.href} post_link={this.props.post_link}
                    className={classNames('nav_tab-link', { active: Store.isCurrentOrParentUrl(element.href) })}>
                    {element.text}
                </ReactiveLink>
            )
        })

        return (
            <div className="footer__block">
                <ReactiveLink href={this.props.tabs.href} post_link={this.props.post_link}
                    className={classNames('nav_tab-link', { active: Store.isCurrentOrParentUrl(this.props.tabs.href) })}>
                    {this.props.tabs.text.toUpperCase()}
                </ReactiveLink>
                <div className="footer__childs">
                    {childs}
                </div>
            </div>
        )
    }
}

class Operations extends Component {
    render() {
        let childs = []
        this.props.tabs.childs.map((element) => {
            childs.push(
                <ReactiveLink key={element.id} href={element.href} post_link={this.props.post_link}
                    className={classNames('nav_tab-link', { active: Store.isCurrentOrParentUrl(element.href) })}>
                    {element.text}
                </ReactiveLink>
            )
        })

        return (
            <div className="footer__block">
                <ReactiveLink href={this.props.tabs.href} post_link={this.props.post_link}
                    className={classNames('nav_tab-link', { active: Store.isCurrentOrParentUrl(this.props.tabs.href) })}>
                    {this.props.tabs.text.toUpperCase()}
                </ReactiveLink>
                <div className="footer__childs">
                    {childs}
                </div>
            </div>
        )
    }
}

class Other extends Component {
    render() {
        let tabs = []
        for (let i = 0; i < this.props.tabs.length; i++) {
            if (this.props.tabs[i]) {
                tabs.push(
                    <ReactiveLink key={this.props.tabs[i].id} href={this.props.tabs[i].href}
                        post_link={this.props.post_link}
                        className={classNames('nav_tab-link', { active: Store.isCurrentOrParentUrl(this.props.tabs[i].href) })}>
                        {this.props.tabs[i].text.toUpperCase()}
                    </ReactiveLink>
                )
            }
        }

        return (
            <div className="footer__block">
                {tabs}
            </div>
        )
    }
}
