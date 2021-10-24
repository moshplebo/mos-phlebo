import React, {Component} from 'react'
import classNames from 'classnames';
import update from 'react-addons-update';
import Swipeable from 'react-swipeable';
import WindowDimensions from '../toolbox/WindowDimensions.jsx';
import Isvg from 'react-inlinesvg';
const left = require('../../css/assets/images/left.svg')
const right = require('../../css/assets/images/right.svg')

export default class Carousel extends Component {
    static defaultProps = {
        toScroll:               1,
        toShow:                 1,
        slideWidth:             0,
        slideMargin:            0,
        startSlide:             0,
        autoPlay:               false,
        autoPlaySpeed:          3000,
        hoverStop:              true,
        infinite:               true,
        arrows:                 true,
        swipeable:              true,
        ease:                   'ease-out',
        duration:               300,
        arrowsClass:            '',
        pagination:             true,
        paginationClass:        '',
        paginationItemClass:    '',
        width:                  '100%',
        responsive:             {}
    }

    constructor(props) {
        super(props);

        this.state = {
            slides:                 this.props.children,
            transition:             false,
            ...this.props
        }

        this.handleMouseEnter   = this.handleMouseEnter.bind(this);
        this.handleMouseLeave   = this.handleMouseLeave.bind(this);
        this.goTo               = this.goTo.bind(this);
        this.goToPrev           = this.goToPrev.bind(this);
        this.goToNext           = this.goToNext.bind(this);
        this.swipedLeft         = this.swipedLeft.bind(this);
        this.swipedRight        = this.swipedRight.bind(this);
        this.swipingLeft        = this.swipingLeft.bind(this);
        this.swipingRight       = this.swipingRight.bind(this);
        this.setDimensions      = this.setDimensions.bind(this);
    }

    componentWillMount() {
        let initStyle = {
            marginRight: this.state.slideMargin,
            width: `${100/this.state.toShow}%`
        }
        let content = this.state.slides.slice(this.state.startSlide, this.state.toShow).map((slide) => {
            return (
                <div key={slide.key} style={initStyle} className='carousel__item'>
                    {slide}
                </div>
            )
        });
        this.setState({
            content: content
        });
    }

    setDimensionState(callback) {
        const ww = WindowDimensions().width;
        const breakPoints = this.state.responsive;
        let key;

        if (breakPoints && Object.keys(breakPoints).length > 0) {
            let bps = Object.keys(breakPoints);
            bps.sort((a ,b) => {
                a - b;
            });

            bps.forEach((bp) => {
                if (ww >= parseInt(bp)) {
                    key = parseInt(bp);
                }
            });
        }

        if (key) {
            this.setState({
                ...this.state.responsive[key]
            }, () => {
                callback();
            });
        } else {
            callback();
        }
    }

    setInitialDimensions() {
        this.setDimensionState(() => {
            const {slides, toShow, toScroll} = this.state;

            const frame = this.carousel;
            const frameActiveWidth = frame.getBoundingClientRect().width;

            // Slide width
            let slideWidth = this.state.slideWidth;
            if (slideWidth == 0) {
                 slideWidth = frameActiveWidth / toShow;
            }
            let slideMargin = this.state.slideMargin;
            if (toShow > 1 && slideMargin == 0) {
                slideMargin = frameActiveWidth / toShow - slideWidth;
            }
            const slideWithMargin = slideWidth + slideMargin;

            // Count of before or after slides
            const cloneSlides = this.state.infinite ? toShow : 0;

            // Width of before and after areas for slides
            const cloneWidth = cloneSlides * slideWithMargin;

            // Full width of slider frame
            const frameFullWidth = slideWithMargin * slides.length + 2 * cloneWidth;

            const activeSlide = this.state.startSlide;

            this.setState({
                frameFullWidth:     frameFullWidth,
                slideWidth:         slideWidth,
                slideMargin:        slideMargin,
                cloneWidth:         cloneWidth,
                slideWithMargin:    slideWithMargin,
                activeSlide:        activeSlide
            }, () => {
                const transformValue = this.getLeft(activeSlide);
                this.setState({
                    transformValue: transformValue,
                    transition:     false,
                    content:        this.setContent(),
                });
            });
        });
    }

    setDimensions() {
        this.stopAutoPlay();
        this.setDimensionState(() => {
            const {toShow, slides, activeSlide} = this.state;
            const frame = this.carousel;
            const frameActiveWidth = frame.getBoundingClientRect().width;

            let slideWidth = this.state.slideWidth;
            if (this.props.slideWidth == 0) {
                slideWidth = frameActiveWidth / toShow;
            }
            let slideMargin = this.state.slideMargin;
            if (toShow > 1 && (slideMargin == 0 || this.props.slideMargin == 0)) {
                slideMargin = frameActiveWidth / toShow - slideWidth;
            }
            const slideWithMargin = slideWidth + this.state.slideMargin;

            const cloneSlides = this.state.infinite ? toShow : 0;
            const cloneWidth = cloneSlides * slideWithMargin;

            const frameFullWidth = slideWithMargin * slides.length + 2 * cloneWidth;

            this.setState({
                frameFullWidth:     frameFullWidth,
                slideWidth:         slideWidth,
                slideMargin:        slideMargin,
                cloneWidth:         cloneWidth,
                slideWithMargin:    slideWithMargin
            }, () => {
                const transformValue = this.getLeft(activeSlide);
                this.setState({
                    transformValue: transformValue,
                    transition:     false,
                    content:        this.setContent(),
                });
                this.startAutoPlay();
            });
        });
    }

    bindEvents() {
        window.addEventListener('resize', this.setDimensions);
    }

    unbindEvents() {
        window.removeEventListener('resize', this.setDimensions);
    }

    componentDidMount() {
        this.setInitialDimensions();
        this.bindEvents();

        this.setState({
            transition:     false
        }, () => {
            if (this.state.autoPlay) {
                this.startAutoPlay();
            }
        });
    }

    componentWillUnmount() {
        this.unbindEvents();
        this.stopAutoPlay();
    }

    handleMouseEnter(e) {
        if (this.state.hoverStop) {
            this.stopAutoPlay();
        }
    }

    handleMouseLeave(e) {
        this.startAutoPlay();
    }

    startAutoPlay() {
        if (this.state.autoPlay) {
            if (!this.state.autoPlayId || !this.state.autoPlayId) {
                let autoPlayId = setInterval(() => {
                    this.goToNext();
                }, this.state.autoPlaySpeed);

                this.setState({
                    autoPlayId: autoPlayId
                });
            }
        }
    }

    stopAutoPlay() {
        if (this.state.autoPlayId) {
            clearInterval(this.state.autoPlayId);
            this.setState({
                autoPlayId: null
            });
        }
    }

    getLeft(num) {
        const {slides, toShow, toScroll, slideWithMargin, slideMargin} = this.state;
        const slidesCount = slides.length;

        let slideOffset = 0;

        if (this.state.infinite) {
            slideOffset = slideWithMargin * toShow * -1;

            if (slidesCount % toScroll !== 0) {
                if (num + toScroll > slidesCount) {
                    if (num >= slidesCount) {
                        slideOffset = (toShow - (num - slidesCount)) * slideWithMargin * -1;
                    } else {
                        slideOffset = (slidesCount % toScroll) * slideWithMargin * -1;
                    }
                }
            }
        } else {
            if (num + toShow > slidesCount) {
                slideOffset = ((num + toShow) - slidesCount) * slideWithMargin;
            }
        }

        let targetLeft = ((num * slideWithMargin) * -1) + slideOffset;

        return Math.ceil(targetLeft + slideMargin/2);
    }

    goTo(num) {
        const {slides, toScroll} = this.state;
        const slideCount = slides.length;

        let targetSlide;
        if (!this.state.infinite && (num > (slideCount - toScroll) || num < 0)) {
            targetSlide = this.state.activeSlide;
        } else {
            targetSlide = num;
        }

        let newTransformValue = this.getLeft(targetSlide);
        let moveToSlide;

        if (num < 0) {
            if (slideCount % toScroll !== 0) {
                moveToSlide = slideCount - (slideCount % toScroll);
            } else {
                moveToSlide = slideCount + num;
            }
        } else if (num >= slideCount) {
            if (slideCount % toScroll !== 0) {
                moveToSlide = 0;
            } else {
                moveToSlide = num - slideCount;
            }
        }

        this.setState({
            activeSlide:    targetSlide,
            transformValue: newTransformValue,
            transition:     true
        }, () => {
            if (moveToSlide && this.state.infinite) {
                setTimeout(() => {
                    let newTransformValue;
                    newTransformValue = this.getLeft(moveToSlide);
                    this.setState({
                        activeSlide:    moveToSlide,
                        transformValue: newTransformValue,
                        transition:     false
                    });
                }, this.state.duration);
            }
        });
    }

    goToPrev() {
        const {activeSlide, toScroll, toShow, slides} = this.state;

        const unevenOffset = (slides.length % toScroll !== 0);
        const indexOffset = unevenOffset ? 0 : (slides.length - activeSlide) % toScroll;
        const slideOffset = indexOffset === 0 ? toScroll : toShow - indexOffset;

        const num = activeSlide - slideOffset;

        this.goTo(num);
    }

    goToNext() {
        const {activeSlide, toScroll, toShow, slides} = this.state;

        const unevenOffset = (slides.length % toScroll !== 0);
        const indexOffset = unevenOffset ? 0 : (slides.length - activeSlide) % toScroll;
        const slideOffset = indexOffset === 0 ? toScroll : indexOffset;

        const num = activeSlide + slideOffset;

        this.goTo(num);
    }

    swipedLeft(e) {
        if (this.state.swipeable && !this.state.autoPlay) {
            e.preventDefault();
            e.stopPropagation();
            this.goToNext();
        }
    }

    swipedRight(e) {
        if (this.state.swipeable && !this.state.autoPlay) {
            e.preventDefault();
            e.stopPropagation();
            this.goToPrev();
        }
    }

    swipingLeft(e) {
        if (this.state.swipeable && !this.state.autoPlay) {
            e.preventDefault();
            e.stopPropagation();
        }
    }

    swipingRight(e) {
        if (this.state.swipeable && !this.state.autoPlay) {
            e.preventDefault();
            e.stopPropagation();
        }
    }

    carouselStyle() {
        return {
            width: this.state.width
        }
    }

    carouselItemStyle() {
        return {
            marginRight: this.state.slideMargin,
            width: this.state.slideWidth
        }
    }

    carouselItems(slides, clone = false) {
        let items = [];
        items = slides.map((slide) => {
            return (
                <div
                    key={slide.key}
                    style={this.carouselItemStyle()}
                    className={classNames('carousel__item', {'carousel__item--clone': clone})}>
                    {slide}
                </div>
            )
        });
        return items;
    }

    setContent() {
        const slides = this.state.slides;

        let real = this.carouselItems(slides);

        let before = [];
        let after = [];
        if (this.state.infinite) {
            let beforeSlides = slides.slice().reverse();
            for (let i = 0; i < this.state.toShow; i++) {
                before.unshift(
                    this.carouselItems(beforeSlides.slice(i, i + 1), true)
                )

                after.push(
                    this.carouselItems(slides.slice(i, i + 1), true)
                )
            }
        }

        let res = update([], {$push: before});
        res = update(res, {$push: real});
        res = update(res, {$push: after});

        return res;
    }

    pagination() {
        if (typeof this.state.activeSlide === 'undefined' || !this.state.pagination || this.state.toScroll !== this.state.toShow) {
            return null
        } else {
            return <CarouselPagination
                itemsCount={this.state.slides.length / this.state.toScroll}
                className={this.state.paginationClass}
                itemClass={this.state.paginationItemClass}
                active={this.state.activeSlide}
                onClick={this.goTo}
            />
        }
    }

    prevControl() {
        let control;
        if (this.state.arrows) {
            control = <CarouselArrowPrev onClick={this.goToPrev} className={this.state.arrowsClass}/>
        }

        return control;
    }

    nextControl() {
        let control;
        if (this.state.arrows) {
            control = <CarouselArrowNext onClick={this.goToNext} className={this.state.arrowsClass}/>
        }

        return control;
    }

    render() {
        let frameStyle = {
            transform: `translate(${this.state.transformValue}px)`,
            width: this.state.frameFullWidth
        }

        if (this.state.transition) {
            frameStyle['transition'] = `transform ${this.state.duration}ms ${this.state.ease}`
        }

        return (
            <Swipeable onSwipingRight={this.swipingRight} onSwipingLeft={this.swipingLeft} onSwipedRight={this.swipedRight} onSwipedLeft={this.swipedLeft}>
                <div className='carousel-outer' onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
                    {this.prevControl()}
                    <div ref={(carousel) => this.carousel = carousel} className='carousel' style={this.carouselStyle()}>
                        <div style={frameStyle} className='carousel__frame'>
                            {this.state.content}
                        </div>
                        {this.pagination()}
                    </div>
                    {this.nextControl()}
                </div>
            </Swipeable>
        )
    }
}

class CarouselPagination extends Component {
    items() {
        if (this.props.itemsCount > 1) {
            let tmp = Array.apply(null, {length: this.props.itemsCount}).map(Number.call, Number)
            let items = tmp.map((item) => {
                return (
                    <span
                        key={item}
                        onClick={() => this.props.onClick(item)}
                        className={classNames('carousel__pagintaion-item', this.props.itemClass, {active: this.props.active == item})}
                    />
                )
            });

            return items;
        } else {
            return null;
        }
    }

    render() {
        return (
            <div className={classNames('carousel__pagintaion', this.props.className)}>
                {this.items()}
            </div>
        )
    }
}

class CarouselArrowPrev extends Component {
    render() {
        return (
            <button
                onClick={() => this.props.onClick()}
                className={classNames('carousel__arrow', 'carousel__arrow-prev', this.props.className)}>
                <div className="arrow-left">
                    <Isvg src={left}/>
                </div>
            </button>
        )
    }
}

class CarouselArrowNext extends Component {
    render() {
        return (
            <button
                onClick={() => this.props.onClick()}
                className={classNames('carousel__arrow', 'carousel__arrow-next', this.props.className)}>
                <div className="arrow-right">
                    <Isvg src={right}/>
                </div>
            </button>
        )
    }
}
