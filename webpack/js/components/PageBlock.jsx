import React, {Component} from 'react'
import {Wrapper, Container, Row, Cell} from '../toolbox/Grid.jsx'
import Store from '../store.js'
import Carousel from './Carousel.jsx'
import Isvg from 'react-inlinesvg';

const left = require('../../css/assets/images/left.svg')
const right = require('../../css/assets/images/right.svg')
const close = require('../../css/assets/images/close.svg')


export default class PageBlock extends Component {
    blockContent() {
        let content
        switch (this.props.kind) {
            case 'wysiwyg_block':
                content =
                    <div className='redactor_content' dangerouslySetInnerHTML={{__html: this.props.metadata.content}}/>
                break
            case 'gallery_block':
                content =
                    <GalleryBlock mediaFiles={this.props.media_files}/>
                break
            case 'wrapper_block':
                content =
                    <WrapperBlock mediaFiles={this.props.media_files} metadata={this.props.metadata}/>
                break
            case 'youtube_block':
                content = 
                    <YoutubeBlock video={this.props.metadata.youtube} autoplay="0" rel="0" modest="0" controls="0"/>
                break
            default:
                content = ''
                break
        }

        return content
    }

    render() {
        return (
            <div>
                {this.blockContent()}
            </div>
        )
    }
}

class GalleryBlock extends Component {
    constructor(props) {
        super(props);

        this.toPrev = this.toPrev.bind(this)
        this.toNext = this.toNext.bind(this)
        this.didMount = this.didMount.bind(this)
        this.willUnmount = this.willUnmount.bind(this)
        this.handleArrowPress = this.handleArrowPress.bind(this)
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

    handleClick(photos, index) {
        let content = ''
        content =
            <Carousel
                ref={carousel => this.carousel = carousel}
                key={"(+new Date).toString()"}
                autoPlay={false}
                pagination={false}
                arrows={false}
                startSlide={index}
            >
                {this.modalImage()}
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
                className: 'gallery--modal flex_carousel',
                didMount: this.didMount,
                willUnmount: this.willUnmount
            }
        }, true)
    }

    modalImage() {
        let images = []

        images = this.props.mediaFiles.map((mf) => {
            return (
                <div key={mf.src} className='modal-carousel-item'>
                    <img src={mf.src} alt={mf.name}/>
                </div>
            )
        })

        return images
    }

    images() {
        let images = []

        images = this.props.mediaFiles.map((mf, index) => {
            return (
                <img key={index} className='page__gallery-item' src={mf.src} alt={mf.name}
                     onClick={(e, i) => this.handleClick(e, index)}/>
            )
        })

        return images
    }

    render() {
        return (
            <div>
                {this.images()}
            </div>
        )
    }
}
class YoutubeBlock extends Component { 
    constructor(props){
        super(props);        

        this.videoSrc = "https://www.youtube.com/embed/" + 
        this.createLink() + "?autoplay=" + 
        this.props.autoplay + "&rel=" + 
        this.props.rel + "&modestbranding=" +
        this.props.modest + "&controls=" +
        this.props.controls
    }
    createLink(){
        let fullLink = this.props.video;
        var match = fullLink.match("v=([a-zA-Z0-9\_\-]+)&?")[1];
        return match;
    }
    render(){
        return(
        <div className="youtube">
         <iframe className="player" type="text/html" allowFullScreen
            src={this.videoSrc}
            frameborder="0"/>
        </div>
        )
        
    }
}
class WrapperBlock extends Component {
    constructor(props) {
        super(props)

        this.handleClick = this.handleClick.bind(this)
    }

    handleClick() {
        let modalContent
        modalContent = <img src={this.props.mediaFiles[0].src} alt={this.props.mediaFiles[0].name}/>
        Store.setData({modal: true, modalData: {content: modalContent, className: "one_photo--modal"}}, true);
    }

    render() {
        let image
        if (this.props.mediaFiles && this.props.mediaFiles[0]) {
            image =
                <Cell className='page__wrapper-item' style={{paddingLeft: 0}}>
                    <img src={this.props.mediaFiles[0].src} alt={this.props.mediaFiles[0].name}
                         style={{float: this.props.metadata.float}} onClick={this.handleClick}/>
                </Cell>
        }

        return (
            <div className='clearfix'>
                {image}
                <div className='redactor_content'
                     dangerouslySetInnerHTML={{__html: this.props.metadata.content}}/>
            </div>
        )
    }
}
