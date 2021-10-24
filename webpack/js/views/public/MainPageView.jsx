import React, { Component } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { Map, Marker, MarkerLayout } from 'yandex-map-react'
import { Wrapper, Container, Row, Cell } from '../../toolbox/Grid.jsx'
import classNames from 'classnames'
import Carousel from '../../components/Carousel.jsx'
import ReactiveLink from '../../toolbox/ReactiveLink.jsx'
import Store from '../../store.js'
import BackCallForm from '../../components/BackCallForm.jsx'
import Swipeable from 'react-swipeable'
import Isvg from 'react-inlinesvg'

const heal = [
    require('../../../css/assets/images/heal1.jpg'),
    require('../../../css/assets/images/heal2.jpg'),
    require('../../../css/assets/images/heal3.jpg')
]
const heal_name = ['Варикозные вены', 'Сосудистые звездочки', 'Лечение осложненных форм']
const heal_text = [
    'Лечение магистрального варикоза, характеризующегося наличием выпирающих вен. Это наиболее часто встречающийся в' +
    ' практике тип варикоза.',
    'Лечение ретикулярного варикоза, сопровождающегося образованием косметических дефектов в виде характерных' +
    ' "сеточек" и протяженных тонких венок по типу ветвления дерева.',
    'Состояния, связанные с развитием осложнений: острого томбофлебита или образованием трофических язв.'
]
const map_icon = require('../../../css/assets/images/map.svg')
const vrach_photo = require('../../../css/assets/images/vash_vrach.jpg')
const left = require('../../../css/assets/images/left.svg')
const right = require('../../../css/assets/images/right.svg')
const close = require('../../../css/assets/images/close.svg')

export default class MainPageView extends Component {
    render() {
        let results
        results = this.props.results.length > 2 ? <Results {...this.props} /> : ''
        let articles
        articles = this.props.articles.length > 5 ? <Articles {...this.props.articles} /> : ''
        let comments
        comments = this.props.comments.length > 0 ? <Comments {...this.props} /> : ''
        return (
            <div>
                <MainSlide />
                <Wrapper>
                    <Container>
                        <Biography cur_date={this.props.cur_date} cur_time={this.props.cur_time}
                            content={this.props.biography} head1={this.props.head1}
                            head2={this.props.head2} head3={this.props.head3}
                            url={this.props.main_url}
                        />
                        <Healings first_url={this.props.first_url} middle_url={this.props.middle_url}
                            last_url={this.props.last_url} />
                        {results}
                        {articles}
                    </Container>
                </Wrapper>
                {comments}
                <Maps />
            </div>
        )
    }
}

class MainSlide extends Component {
    render() {
        return (
            <div className='main-slide' />
        )
    }
}

class Biography extends Component {
    constructor(props) {
        super(props)

        this.showModal = this.showModal.bind(this)
    }

    showModal() {
        try { window.yaCounter46138809.reachGoal('open-modul') } catch (e) {}

        let modalClose = ''
        modalClose =
            <div key="close" className="modal-close">
                <div className="close">
                    <Isvg src={close} />
                </div>
            </div>

        Store.setData({
            modal: true, modalData: {
                content: <BackCallForm cur_date={this.props.cur_date}
                    cur_time={this.props.cur_time} />,
                additionalContent: [modalClose]
            }
        }, true)
    }

    render() {
        let head1 = this.props.head1 ? <h2>{this.props.head1}</h2> : ''
        let head2 = this.props.head2 ? <h3>{this.props.head2}</h3> : ''
        let head3 = this.props.head3 ? <h3>{this.props.head3}</h3> : ''
        let content = this.props.content ? <p>{this.props.content}</p> : ''

        return (
            <Row className='biography'>
                <Cell className='biography__photo'>
                    <img src={vrach_photo} alt="Флеболог Калачев" />
                </Cell>
                <Cell className='biography__block'>
                    <h2 className="main-h2 main-h2-top">Ваш врач</h2>
                    {head1}
                    {head2}
                    {head3}
                    {content}
                    <Row className='biography__helper'>
                        <Cell sm='1-4' className='button1'>
                            <ReactiveLink href={this.props.url}>
                                <button className='btn btn-bordered'>ЧИТАТЬ ПОЛНОСТЬЮ</button>
                            </ReactiveLink>
                        </Cell>
                        <Cell sm='1-4' className='button2'>
                            <button className='btn btn-bordered' onClick={this.showModal}>
                                ЗАПИСЬ НА ПРИЕМ
                            </button>
                        </Cell>
                        <Cell sm='1-3' className='biography__contacts'>
                            <p className='biography__time'><i className='mdi mdi-clock' />&nbsp;пн-пт, с 9:00 до 19:00
                            </p>
                            <p className='biography__phone'><i className='mdi mdi-phone' />
                                &nbsp;<a href='tel:+74956276708' className='ya-phone'>+7 (495) 627-67-08</a>
                            </p>
                            <p className='biography__address'><i
                                className='mdi mdi-map-marker' />&nbsp;Москва, Алтуфьевское шоссе, 48</p>
                        </Cell>
                    </Row>
                </Cell>
            </Row>
        )
    }
}

class Healings extends Component {
    render() {
        return (
            <Row className='healings'>
                <h2 className="main-h2">Лечение варикоза различной степени</h2>
                <div className='healings__items'>
                    <Healing img={heal[0]} name={heal_name[0]} text={heal_text[0]} href={this.props.first_url} />
                    <Healing img={heal[1]} name={heal_name[1]} text={heal_text[1]} href={this.props.middle_url} />
                    <Healing img={heal[2]} name={heal_name[2]} text={heal_text[2]} href={this.props.last_url} />
                </div>
            </Row>
        )
    }
}

class Healing extends Component {
    render() {
        return (
            <Cell sm='1-3' className='healings__item'>
                <ReactiveLink href={this.props.href}>
                    <img src={this.props.img} alt={this.props.name} />
                </ReactiveLink>
                <ReactiveLink href={this.props.href}>
                    <h2>{this.props.name}</h2>
                </ReactiveLink>
                <p>{this.props.text}</p>
            </Cell>
        )
    }
}

class Results extends Component {
    render() {
        return (
            <div className='results'>
                <h2 className="main-h2">Результаты лечения: до&nbsp;и&nbsp;после</h2>
                <PhotoCarousel slides={this.props.results} />
            </div>
        )
    }
}

class Articles extends Component {
    render() {
        let sm = ['3-8', '2-8', '3-8', '2-8', '2-8', '4-8']
        let articles_one = []
        let articles_two = []
        for (let i = 0; i < 3; i++) {
            articles_one.push(
                <Cell sm={sm[i]} key={this.props[i].id}>
                    <img src={this.props[i].preview_image} alt={this.props[i].name} />
                    <div>
                        <span className="main-article__preview">{this.props[i].date}</span>
                        <span>{this.props[i].name.toUpperCase()}</span>
                        <span className="main-article__hover">{this.props[i].short_description}</span>
                        <ReactiveLink href={this.props[i].href} className="btn btn-bordered">
                            Читать подробно
                        </ReactiveLink>
                    </div>
                </Cell>
            )
        }
        for (let i = 3; i < 6; i++) {
            articles_two.push(
                <Cell sm={sm[i]} key={this.props[i].id}>
                    <img src={this.props[i].preview_image} alt={this.props[i].name} />
                    <div className="main-article__content">
                        <span className="main-article__preview">{this.props[i].date}</span>
                        <span>{this.props[i].name.toUpperCase()}</span>
                        <span className="main-article__hover">{this.props[i].short_description}</span>
                        <ReactiveLink href={this.props[i].href} className="btn btn-bordered">
                            Читать подробно
                        </ReactiveLink>
                    </div>
                </Cell>
            )
        }
        return (
            <div className='main-articles'>
                <Row className='main-articles__row'>
                    <h2 className="main-h2">Статьи о варикозе</h2>
                    <ReactiveLink href='/articles' className="articles-show">
                        Смотреть все <i className='mdi mdi-arrow-right' />
                    </ReactiveLink>
                </Row>
                <div className='main-articles__table'>
                    <Row>
                        {articles_one}
                    </Row>
                    <Row>
                        {articles_two}
                    </Row>
                </div>
            </div>
        )
    }
}

class Comments extends Component {
    render() {
        return (
            <div className='comments-main'>
                <Wrapper>
                    <Container>
                        <h2 className="main-h2-comments">Отзывы пациентов</h2>
                        <CommentsSlider slides={this.props.comments} />
                    </Container>
                </Wrapper>
            </div>
        )
    }
}

class Maps extends Component {
    constructor(props) {
        super(props)

        this.state = {
            crutchHide: false,
            isHide: false
        }

        this.hideCrutch = this.hideCrutch.bind(this)
        this.swipingLeft = this.swipingLeft.bind(this)
        this.swipingRight = this.swipingRight.bind(this)
        this.onClickHandler = this.onClickHandler.bind(this)
    }

    hideCrutch() {
        this.setState({ crutchHide: true })
    }

    swipingLeft(e) {
        e.preventDefault()
        e.stopPropagation()
    }

    swipingRight(e) {
        e.preventDefault()
        e.stopPropagation()
    }

    onClickHandler() {
        this.setState({ isHide: !this.state.isHide })
    }

    render() {
        let height
        let centerLon
        let zoom

        if (window.innerWidth > 760) {
            height = '600px'
            centerLon = 37.586108
            zoom = 17
        } else {
            height = '300px'
            centerLon = 37.583108
            zoom = 15
        }
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
                        height={height}
                        state={mapState}
                        center={[point.lat, centerLon]}
                        zoom={zoom}
                    >
                        <Marker lat={point.lat} lon={point.lon}
                            onClick={this.onClickHandler}>
                            <MarkerLayout>
                                <div className='map__marker'>
                                    <img src={map_icon} />
                                </div>
                            </MarkerLayout>
                        </Marker>
                    </Map>
                    <div className='map__contacts' style={{ display: this.state.isHide ? 'none' : 'block' }}>
                        <h2 className="map__contacts-header">Контакты</h2>
                        <h3>Клиника Экспертных Медицинских Технологий</h3>
                        <div className='block'>
                            <span><i className='mdi mdi-map-marker' />127566, Москва, Алтуфьевское шоссе, 48</span>
                            <span><i className='mdi mdi-phone' />
                                <a href='tel:+74956276708' className='ya-phone'>
                                    +7 (495) 627-67-08
                                </a>
                            </span>
                            <a href='https://yandex.ru/maps/213/moscow/?z=17&ll=37.588440593917845%2C55.8758684959435&l=map&rtext=~55.875965%2C37.588108&origin=jsapi_2_1_48&from=api-maps&mode=routes&rtt=auto'
                                target="_blank">
                                Как добраться
                            </a>
                        </div>
                        <div className='block'>
                            <span>ИНН 7715860230</span>
                            <span>ОГРН 1117746261270</span>
                            <span>Лицензия ЛО 77-01-004851</span>
                        </div>
                        <i className='mdi mdi-close' onClick={this.onClickHandler} />
                    </div>
                    <div onClick={this.hideCrutch}
                        className={classNames('map-crutch', { 'map-crutch__hide': this.state.crutchHide })}>
                    </div>
                </div>
            </Swipeable>
        )
    }
}

class CommentsSlider extends Component {
    constructor(props) {
        super(props)

        this.openPhoto = this.openPhoto.bind(this)
    }

    openPhoto(value) {
        let modalClose = ''
        modalClose =
            <div key="close" className="modal-close">
                <div className="close">
                    <Isvg src={close} />
                </div>
            </div>

        Store.setData({
            modal: true,
            modalData: {
                content: <CommentModal photo={value} />, className: 'one_photo--modal',
                additionalContent: [modalClose]
            }
        }, true)
    }

    setSlides() {
        let slides = []
        slides = this.props.slides.map((slide) => {
            let sm = '1-1'
            let img = ''
            if (slide.img) {
                sm = '2-3'
                img =
                    <Cell sm='1-3'>
                        <img className='comment-slide__img' src={slide.img} alt={slide.fio}
                            onClick={() => {
                                this.openPhoto(slide)
                            }} />
                    </Cell>
            }
            return (
                <Row key={slide.id} className='comment-slide'>
                    {img}
                    <Cell sm={sm} className='comment-slide__block'>
                        <h2>{slide.fio}</h2>
                        <p className='comment-slide__date'>{slide.date}</p>
                        <span>{slide.text}</span>
                    </Cell>
                </Row>
            )
        })
        return slides
    }

    render() {
        return (
            <div className='comment-slides'>
                <Carousel
                    autoPlay={false}
                    pagination={false}
                    arrows={true}
                    arrowsClass='comment-slider__arrow'
                >
                    {this.setSlides()}
                </Carousel>
            </div>
        )
    }
}

class CommentModal extends Component {
    render() {
        return (
            <div>
                <img src={this.props.photo.img} alt={this.props.photo.fio} />
            </div>
        )
    }
}

class PhotoCarousel extends Component {
    constructor(props) {
        super(props)

        this.state = {
            leftIndex: 0,
            centerIndex: 1,
            rightIndex: 2
        }

        this.toPrevPhoto = this.toPrevPhoto.bind(this)
        this.toNextPhoto = this.toNextPhoto.bind(this)
        this.onClickHandler = this.onClickHandler.bind(this)
        this.swipedLeft = this.swipedLeft.bind(this)
        this.swipedRight = this.swipedRight.bind(this)
        this.swipingLeft = this.swipingLeft.bind(this)
        this.swipingRight = this.swipingRight.bind(this)
        this.didMount = this.didMount.bind(this)
        this.willUnmount = this.willUnmount.bind(this)
        this.handleArrowPress = this.handleArrowPress.bind(this)
        this.toPrev = this.toPrev.bind(this)
        this.toNext = this.toNext.bind(this)
    }

    didMount() {
        document.addEventListener('keydown', this.handleArrowPress)
    }

    willUnmount() {
        document.removeEventListener('keydown', this.handleArrowPress)
    }

    handleArrowPress(event) {
        switch (event.keyCode) {
            case 37:
                this.carousel.goToPrev()
                break
            case 39:
                this.carousel.goToNext()
                break
            default:
                break
        }
    }

    toPrev(e) {
        e.preventDefault()
        e.stopPropagation()
        this.carousel.goToPrev()
    }

    toNext(e) {
        e.preventDefault()
        e.stopPropagation()
        this.carousel.goToNext()
    }

    swipedLeft(e) {
        e.preventDefault()
        e.stopPropagation()
        this.toNextPhoto()
    }

    swipedRight(e) {
        e.preventDefault()
        e.stopPropagation()
        this.toPrevPhoto()
    }

    swipingLeft(e) {
        e.preventDefault()
        e.stopPropagation()
    }

    swipingRight(e) {
        e.preventDefault()
        e.stopPropagation()
    }

    toPrevPhoto() {
        let leftIndex = this.state.leftIndex == 0 ? this.props.slides.length - 1 : this.state.leftIndex - 1
        let centerIndex = this.state.centerIndex == 0 ? this.props.slides.length - 1 : this.state.centerIndex - 1
        let rightIndex = this.state.rightIndex == 0 ? this.props.slides.length - 1 : this.state.rightIndex - 1
        this.setState({
            leftIndex: leftIndex,
            centerIndex: centerIndex,
            rightIndex: rightIndex,
            toPrev: true
        }, () => {
            setTimeout(() => {
                this.setState({ toPrev: false })
            }, 500)
        })
    }

    toNextPhoto() {
        let leftIndex = this.state.leftIndex == this.props.slides.length - 1 ? 0 : this.state.leftIndex + 1
        let centerIndex = this.state.centerIndex == this.props.slides.length - 1 ? 0 : this.state.centerIndex + 1
        let rightIndex = this.state.rightIndex == this.props.slides.length - 1 ? 0 : this.state.rightIndex + 1
        this.setState({
            leftIndex: leftIndex,
            centerIndex: centerIndex,
            rightIndex: rightIndex,
            toPrev: false
        }, () => {
            setTimeout(() => {
                this.setState({ toPrev: true })
            }, 500)
        })
    }

    onClickHandler(photos, index) {
        let slides = []
        slides = photos.map((photo) => {
            let text
            if (photo.metadata.header && photo.metadata.text) {
                text =
                    <div className='photo-modal__text'>
                        <h2>{photo.metadata.header}</h2>
                        <p>{photo.metadata.text}</p>
                    </div>
            }

            return (
                <div key={photo.id} className='photo-modal__container'>
                    <div className='photo-modal'>
                        <div className='photo-modal__preview'>
                            <img src={photo.img_big} alt={photo.metadata.alt} />
                        </div>
                        {text}
                    </div>
                </div>
            )
        })

        let content = ''
        content =
            <Carousel
                ref={carousel => this.carousel = carousel}
                autoPlay={false}
                pagination={false}
                arrows={false}
                startSlide={index}
            >
                {slides}
            </Carousel>

        let arrows = ''
        arrows =
            <div className='modal-arrows' key='arrows'>
                <div className="modal-arrow" onClick={this.toPrev}>
                    <div className="arrow-left">
                        <Isvg src={left} />
                    </div>
                </div>
                <div className="modal-arrow" onClick={this.toNext}>
                    <div className="arrow-right">
                        <Isvg src={right} />
                    </div>
                </div>
            </div>

        let modalClose = ''
        modalClose =
            <div key="close" className="modal-close">
                <div className="close">
                    <Isvg src={close} />
                </div>
            </div>

        Store.setData({
            modal: true, modalData: {
                content: content,
                additionalContent: [arrows, modalClose],
                className: 'gallery--modal',
                didMount: this.didMount,
                willUnmount: this.willUnmount
            }
        }, true)
    }

    render() {
        let slides = []
        slides = this.props.slides.map((slide, index) => {
            return (
                <Cell
                    key={slide.id} sm="1-3"
                    className={classNames('ph-slide', {
                        'ph-slide--left': (index == this.state.leftIndex),
                        'ph-slide--center': (index == this.state.centerIndex),
                        'ph-slide--right': (index == this.state.rightIndex)
                    })}
                >
                    <img src={slide.img} alt={slide.metadata.alt} onClick={() => {
                        this.onClickHandler(this.props.slides, index)
                    }} />
                </Cell>
            )
        })

        let leftIndex = this.state.leftIndex
        let centerIndex = this.state.centerIndex
        let rightIndex = this.state.rightIndex
        return (
            <div className='results-slides'>
                <Swipeable onSwipingRight={this.swipingRight} onSwipingLeft={this.swipingLeft}
                    onSwipedRight={this.swipedRight} onSwipedLeft={this.swipedLeft}>
                    <div className="photo-main">
                        <div className="arrow-left" onClick={this.toPrevPhoto}>
                            <Isvg src={left} />
                        </div>
                        <div className="arrow-right" onClick={this.toNextPhoto}>
                            <Isvg src={right} />
                        </div>
                        <Row className="photo-carousel">
                            <ReactCSSTransitionGroup
                                transitionName={classNames({
                                    'swap': this.state.toPrev,
                                    'prev': !this.state.toPrev
                                })}
                                transitionEnterTimeout={500}
                                transitionLeaveTimeout={500}>
                                {slides[leftIndex]}
                                {slides[centerIndex]}
                                {slides[rightIndex]}
                            </ReactCSSTransitionGroup>
                        </Row>
                    </div>
                </Swipeable>
            </div>
        )
    }
}
