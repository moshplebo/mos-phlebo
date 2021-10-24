import React, { Component } from 'react'
import { Wrapper, Container, Row, Cell } from '../../toolbox/Grid.jsx'
import { Map, Marker, MarkerLayout } from 'yandex-map-react'
import Swipeable from 'react-swipeable'
import classNames from 'classnames'
import Form from '../../toolbox/Form.jsx'
import Store from '../../store.js'
import MaskedInput from 'react-maskedinput'

const map_icon = require('../../../css/assets/images/map.svg')
const phone_icon = require('../../../css/assets/images/phone.svg')
const inn_icon = require('../../../css/assets/images/inn.svg')

export default class ContactsView extends Component {
    constructor(props) {
        super(props)

        this.state = { curTab: '1' }

        this.selectTab = this.selectTab.bind(this)
        this.showModal = this.showModal.bind(this)
    }

    selectTab(e) {
        this.setState({ curTab: e.target.value })
    }

    showModal() {
        Store.setData({
                modal: true,
                modalData: {
                    content: <SuccessModal />,
                    modalClose: true
                }
            },
            true)
    }

    render() {
        let content = ''
        if (this.state.curTab == '1') {
            content =
                <div>
                    <p>
                        <strong>м. "Владыкино":</strong> первый вагон из центра, выход на улицу - налево, возле метро
                                                         остановка автобуса №259, маршруток №53 и №359 до остановки
                                                         "Высоковольтный проезд"
                    </p>
                    <p>
                        <strong>м. "Алтуфьево":</strong> последний вагон из центра, выход на улицу - дважды направо,
                                                         возле метро остановка автобуса №259, троллейбус №73 до
                                                         остановки "Высоковольтный проезд"
                    </p>
                    <p>
                        <strong>м. "Бибирево":</strong> последний вагон из центра, выход к торговому центру "Миллион
                                                        мелочей". Автобус №282 и №53 до остановки "Высоковольтный
                                                        проезд".
                    </p>
                    <p>
                        <strong>м. "Отрадное":</strong> Первый вагон из центра, выход к кинотеатру "Байконур" (налево)
                                                        автобус №637 и маршрутка №571 – остановка "Высоковольтный
                                                        проезд"
                    </p>
                </div>
        } else {
            content =
                <div>
                    <p>
                        <strong>Из центра:</strong> съезд с Третьего транспортного кольца на Шереметьевскую улицу, затем
                                                    - поворот под мост на Огородный проезд. По Огородному проезду через
                                                    улицу Комдива Орлова до
                                                    Алтуфьевского шоссе. По шоссе 3,5 км до моста через железную дорогу,
                                                    первый съезд направо к
                                                    бизнес-центру «Алтуфьевское шоссе 48» налево (въезд №1).
                    </p>
                    <p>
                        <strong>Из области:</strong> съезд с МКАД на 85 км, на Алтуфьевское шоссе, затем двигаться 3 км
                                                     до перекрестка с Бибиревской улицей. На перекрестке съезд направо
                                                     на дублер Алтуфьевского шоссе,
                                                     по которому необходимо проехать 400 метров параллельно основной
                                                     трассе. Разворот под мост.
                                                     Справа от Вас располагается бизнес-центр «Алтуфьевское шоссе 48».
                                                     Вам необходим въезд №1 (ближе к области).
                    </p>
                </div>
        }

        return (
            <Wrapper>
                <Container>
                    <Row>
                        <Cell>
                            <div className='page contacts'>
                                <h1 className='page__title'>{this.props.h1}</h1>
                                <Row>
                                    <Cell sm='2-5'>
                                        <table className='contacts__table'>
                                            <tbody>
                                                <tr>
                                                    <td className='contacts__icon'><img src={map_icon} /></td>
                                                    <td className='contacts__info'>127566, Москва, Алтуфьевское шоссе,
                                                                                   48к1,
                                                                                   первый корпус центра, справа от
                                                                                   въезда
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className='contacts__icon'><img src={phone_icon} /></td>
                                                    <td className='contacts__info'>
                                                        <a href='tel:+74956276708' className='ya-phone'>
                                                            +7 (495) 627-67-08
                                                        </a>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className='contacts__icon'><img src={inn_icon} /></td>
                                                    <td className='contacts__info'>
                                                        <span>ИНН 7715860230</span>
                                                        <span>ОГРН 1117746261270</span>
                                                        <span>Лицензия ЛО 77-01-004851</span>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </Cell>
                                    <Form method='post' action='/backcall' onSubmit={this.showModal}
                                        onSuccess={() => {
                                            try { window.yaCounter46138809.reachGoal('feedback') } catch (e) {}
                                        }}>
                                        <Cell sm='3-5'>
                                            <h2>Написать нам</h2>
                                            <Row>
                                                <Cell sm='2-5'>
                                                    <ContactInput name='backcall[name]' required='required'
                                                        label='&nbsp;Имя&nbsp;' />
                                                    <ContactInput name='backcall[phone]' type='tel' required='required'
                                                        label='&nbsp;Телефон&nbsp;' />
                                                    <ContactInput name='backcall[email]' type='email'
                                                        label='&nbsp;E-mail (необязательно)&nbsp;' />
                                                </Cell>
                                                <Cell sm='3-5'>
                                                <textarea className='contacts__text' name='backcall[text]'
                                                    placeholder='Ваше сообщение' required='required' />
                                                </Cell>
                                            </Row>
                                        </Cell>
                                        <Cell className='contacts__button'>
                                            <input type='submit' value='Отправить сообщение'
                                                className='btn btn-bordered contacts__submit' />
                                        </Cell>
                                    </Form>
                                </Row>
                                <Row className='contacts__row'>
                                    <Cell>
                                        <h2>Как добраться</h2>
                                    </Cell>
                                    <Cell sm='2-5'>
                                        <Row>
                                            <Cell className='contacts__tabs'>
                                                <button
                                                    className={classNames('btn btn-bordered contacts__tab',
                                                        { active: this.state.curTab == '1' })}
                                                    value='1' onClick={this.selectTab}>
                                                    На&nbsp;общественном&nbsp;транспорте
                                                </button>
                                                <button
                                                    className={classNames('btn btn-bordered contacts__tab',
                                                        { active: this.state.curTab == '2' })}
                                                    value='2' onClick={this.selectTab}>
                                                    На&nbsp;автомобиле
                                                </button>
                                            </Cell>
                                            <Cell sm='1-3'>
                                            </Cell>
                                        </Row>
                                        {content}
                                    </Cell>
                                    <Cell sm='3-5'>
                                        <Maps />
                                    </Cell>
                                </Row>
                            </div>
                        </Cell>
                    </Row>
                </Container>
            </Wrapper>
        )
    }
}

class Maps extends Component {
    constructor(props) {
        super(props)

        this.swipingLeft = this.swipingLeft.bind(this)
        this.swipingRight = this.swipingRight.bind(this)
    }

    swipingLeft(e) {
        e.preventDefault()
        e.stopPropagation()
    }

    swipingRight(e) {
        e.preventDefault()
        e.stopPropagation()
    }

    render() {
        let point = {
            lat: 55.875965,
            lon: 37.588108
        }

        let mapState = {
            controls: ['zoomControl'],
        }

        return (
            <Swipeable onSwipingRight={this.swipingRight} onSwipingLeft={this.swipingLeft}>
                <div className='map'>
                    <Map width={'100%'}
                        height={'25em'}
                        state={mapState}
                        center={[point.lat, point.lon]}
                        zoom={17}
                    >
                        <Marker lat={point.lat} lon={point.lon}>
                            <MarkerLayout>
                                <div style={{ width: '40px', height: '40px' }}>
                                    <img src={map_icon} />
                                </div>
                            </MarkerLayout>
                        </Marker>
                    </Map>
                </div>
            </Swipeable>
        )
    }
}

class SuccessModal extends Component {
    render() {
        return (
            <div>
                <h2 className='contacts__success'>Сообщение успешно отправлено!</h2>
            </div>
        )
    }
}

class ContactInput extends Component {
    constructor(props) {
        super(props)

        this.state = {
            value: this.props.value || '',
            type: this.props.type || 'text',
            required: this.props.required,
            pattern: props.pattern || '.*',
        }

        //double backslash -> one backslash https://www.w3schools.com/js/js_strings.asp
        if (this.state.type == 'email') {
            this.state.pattern = '[a-z0-9._+-]+@[a-z0-9.-]+\\.[a-z]{2,8}'
        }

        this.handleChange = this.handleChange.bind(this)
        this.onChange = this.props.onChange || function (name, value) {
        }
    }

    handleChange(event) {
        this.setState({ value: event.target.value })
        this.onChange(this.props.name, event.target.value)
    }

    render() {
        let input
        if (this.state.type == 'tel') {
            input =
                <MaskedInput className='contacts__input'
                    name={this.props.name}
                    required={this.state.required}
                    value={this.state.value}
                    mask='+7 111 111-11-11'
                    placeholder=''
                    onChange={this.handleChange} />
        } else {
            input =
                <input className='contacts__input'
                    type={this.state.type}
                    name={this.props.name}
                    required={this.state.required}
                    pattern={this.state.pattern}
                    value={this.state.value}
                    onChange={this.handleChange} />
        }

        return (
            <label className='contacts__label'>
                {input}
                <span className='contacts__span'>&nbsp;{this.props.label}&nbsp;</span>
            </label>
        )
    }
}
