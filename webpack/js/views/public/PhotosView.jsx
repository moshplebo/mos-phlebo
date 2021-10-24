import React, {Component} from 'react'
import Isvg from 'react-inlinesvg';
import {Wrapper, Container, Row, Cell} from '../../toolbox/Grid.jsx'
import Store from '../../store.js'
import Carousel from '../../../js/components/Carousel.jsx'

const left = require('../../../css/assets/images/left.svg')
const right = require('../../../css/assets/images/right.svg')
const close = require('../../../css/assets/images/close.svg')

export default class PhotosView extends Component {
    render() {
        let categories = [];
        this.props.photo_categories.map((category) => {
            if (category.photos.length != 0) {
                categories.push(
                    <div key={category.id} className='photo-category'>
                        <div className='photo-category__block'>
                            <h2><a name={"cat" + category.id}/>{category.name}</h2>
                            <PhotoBlock {...category} />
                        </div>
                    </div>
                )
            }
        });
        categories = categories.length > 0 ? categories : <h2>Фотографии не найдены</h2>;

        return (
            <Wrapper>
                <Container>
                    <Row>
                        <Cell>
                            <div className='page'>
                                <h1 className='page__title'>{this.props.h1}</h1>
                                {categories}
                            </div>
                        </Cell>
                    </Row>
                </Container>
            </Wrapper>
        )
    }
}

class PhotoBlock extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showAll: false,
        };

        this.onShowHandler = this.onShowHandler.bind(this);
        this.onClickHandler = this.onClickHandler.bind(this);
        this.toPrev = this.toPrev.bind(this)
        this.toNext = this.toNext.bind(this)
        this.didMount = this.didMount.bind(this)
        this.willUnmount = this.willUnmount.bind(this)
        this.handleArrowPress = this.handleArrowPress.bind(this)
    }

    onShowHandler() {
        this.setState({showAll: !this.state.showAll})
    }

    didMount() {
        document.addEventListener("keydown", this.handleArrowPress);
    }

    willUnmount() {
        document.removeEventListener("keydown", this.handleArrowPress);
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

    handleArrowPress(event) {
        switch (event.keyCode) {
            case 37:
                this.carousel.goToPrev()
                break;
            case 39:
                this.carousel.goToNext()
                break;
            default:
                break;
        }
    }

    onClickHandler(photos, index) {
        let slides = []
        slides = photos.map((photo) => {
            let text;
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
                            <img src={photo.img_big} alt={photo.metadata.alt}/>
                        </div>
                        {text}
                    </div>
                </div>
            )
        });

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
                        <Isvg src={left}/>
                    </div>
                </div>
                <div className="modal-arrow" onClick={this.toNext}>
                    <div className="arrow-right">
                        <Isvg src={right}/>
                    </div>
                </div>
            </div>

        let modalClose = ''
        modalClose =
            <div key="close" className="modal-close">
                <div className="close">
                    <Isvg src={close}/>
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
        let text;
        let icon;
        let newPhotos = [];
        if (this.state.showAll) {
            text = 'Свернуть';
            icon = <i className='mdi mdi-arrow-up'/>;
            for (let i = 5; i < this.props.photos.length; i++) {
                if (!this.props.photos[i]) {
                    break;
                }
                newPhotos.push(
                    <Cell key={this.props.photos[i].id} sm='1-4' className='photo__cell'>
                        <div onClick={() => {
                            this.onClickHandler(this.props.photos, i)
                        }}>
                            <img src={this.props.photos[i].img} alt={this.props.photos[i].metadata.alt}/>
                        </div>
                    </Cell>
                )
            }
        }
        else {
            text = 'Показать все';
            icon = <i className='mdi mdi-arrow-down'/>;
            newPhotos = []
        }

        let photos = [];
        for (let i = 1; i < 5; i++) {
            if (!this.props.photos[i]) {
                break;
            }
            photos.push(
                <Cell key={this.props.photos[i].id} sm='1-4' className='photo__cell'>
                    <div onClick={() => {
                        this.onClickHandler(this.props.photos, i)
                    }}>
                        <img src={this.props.photos[i].img} alt={this.props.photos[i].metadata.alt}/>
                    </div>
                </Cell>
            )
        }

        let button = null;
        if (this.props.photos.length > 5) {
            button =
                <Cell className='photo-block__btn'>
                    <button type='button' className='btn btn-bordered' onClick={this.onShowHandler}>{text}{icon}
                    </button>
                </Cell>
        }

        return (
            <Row className='photo-block'>
                <Cell md='1-2' className='photo__cell'>
                    <div onClick={() => {
                        this.onClickHandler(this.props.photos, 0)
                    }}>
                        <img src={this.props.photos[0].img} alt={this.props.photos[0].metadata.alt}/>
                    </div>
                </Cell>
                {photos}
                {newPhotos}
                {button}
            </Row>
        )
    }
}
