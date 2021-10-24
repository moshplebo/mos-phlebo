import React, {Component} from 'react'
import {Wrapper, Container, Row, Cell} from '../../toolbox/Grid.jsx'
import ReactiveLink from '../../toolbox/ReactiveLink.jsx'

export default class CollectionView extends Component {
    render() {
        let content;
        if (this.props.elements && this.props.elements.length > 0) {
            switch (this.props.type) {
                case 'Article':
                    content = <ArticleCollection {...{elements: this.props.elements}} />;
                    break;
                case 'Healing':
                    content = <HealingCollection {...{elements: this.props.elements}} />;
                    break;
                case 'Novelty':
                    content = <NoveltyCollection {...{elements: this.props.elements}} />;
                    break;
            }
        }

        return (
            <Wrapper>
                <Container>
                    <Row>
                        <Cell>
                            <div className='page'>
                                <h1 className='page__title'>{this.props.h1}</h1>
                                {content}
                            </div>
                        </Cell>
                    </Row>
                </Container>
            </Wrapper>
        )
    }
}

class ArticleCollection extends Component {
    sd = []

    componentDidMount() {
        this.sd.map(n => {
            let wordArray = n.innerHTML.split(' ')
            while (n.scrollHeight > n.offsetHeight) {
                wordArray.pop()
                n.innerHTML = wordArray.join(' ') + '...'
            }
        })
    }

    render() {
        let elements = [];
        this.props.elements.map((element) => {
            elements.push(
                <Row key={element.id} className='article'>
                    <div>
                        <Cell sm="1-3" className="article__preview-cell">
                            <ReactiveLink href={element.href} className='article__preview'>
                                <img src={element.preview_image} alt={element.name}/>
                            </ReactiveLink>
                        </Cell>
                        <Cell sm="2-3">
                            <h2 className='article__name'>
                                <ReactiveLink href={element.href}>
                                    {element.name}
                                </ReactiveLink>
                                <div className='article__date'>
                                    <i className="mdi mdi-calendar-clock"/> {element.date}
                                </div>
                            </h2>
                            <p ref={sd => this.sd.push(sd)} className="article__short-description">
                                {element.short_description}
                            </p>
                            <div className='article__btn'>
                                <ReactiveLink href={element.href} className="btn btn-bordered">
                                    Читать полностью
                                </ReactiveLink>
                            </div>
                        </Cell>
                    </div>
                </Row>
            )
        });
        return <Row className='articles'>{elements}</Row>
    }
}

class HealingCollection extends Component {
    render() {
        let elements = [];
        this.props.elements.map((element) => {
            elements.push(
                <Cell sm="1-2" key={element.id} className="healings__other-cell">
                    <ReactiveLink href={element.href}>
                        {element.name}
                    </ReactiveLink>
                </Cell>
            )
        });
        return (
            <div className="healings__other">{elements}</div>
        )
    }
}

class NoveltyCollection extends Component {
    sd = []

    componentDidMount() {
        this.sd.map(n => {
            let wordArray = n.innerHTML.split(' ')
            while (n.scrollHeight > n.offsetHeight) {
                wordArray.pop()
                n.innerHTML = wordArray.join(' ') + '...'
            }
        })
    }

    render() {
        let elements = [];
        this.props.elements.map((element) => {
            elements.push(
                <Row key={element.id} className='article'>
                    <div>
                        <Cell sm="1-3" className="article__preview-cell">
                            <ReactiveLink href={element.href} className='article__preview'>
                                <img src={element.preview_image} alt={element.name}/>
                            </ReactiveLink>
                        </Cell>
                        <Cell sm="2-3">
                            <h2 className='article__name'>
                                <ReactiveLink href={element.href}>
                                    {element.name}
                                </ReactiveLink>
                                <div className='article__date'>
                                    <i className="mdi mdi-calendar-clock"/> {element.date}
                                </div>
                            </h2>
                            <p ref={sd => this.sd.push(sd)} className="article__short-description">
                                {element.short_description}
                            </p>
                            <div className='article__btn'>
                                <ReactiveLink href={element.href} className="btn btn-bordered article__btn">
                                    Читать полностью
                                </ReactiveLink>
                            </div>
                        </Cell>
                    </div>
                </Row>
            )
        });
        return <Row className='articles'>{elements}</Row>
    }
}
