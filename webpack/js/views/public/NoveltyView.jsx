import React, {Component} from 'react'
import {Wrapper, Container, Row, Cell} from '../../toolbox/Grid.jsx'
import PageBlock from '../../components/PageBlock.jsx'
import ReactiveLink from '../../toolbox/ReactiveLink.jsx'

export default class NoveltyView extends Component {
    sd = []

    componentDidMount() {
        this.sd.map(n => {
            let wordArray = n.innerHTML.split(' ')
            while(n.scrollHeight > n.offsetHeight) {
                wordArray.pop()
                n.innerHTML = wordArray.join(' ') + '...'
            }
        })
    }

    render() {
        let pageBlocks = []
        if (this.props.components && this.props.components.length > 0) {
            pageBlocks = this.props.components.map((component) => {
                return (
                    <PageBlock key={component.r_key} {...component}/>
                )
            })
        }

        let popular_novelties = [];
        this.props.novelties_popular.map((element) => {
            popular_novelties.push(
                <div key={element.id + element.name}>
                    <h5>{element.name}</h5>
                    <p ref={sd => this.sd.push(sd)} className="article__short-description">
                        {element.descr}
                    </p>
                    <div className="articles-popular__btn">
                        <ReactiveLink href={element.href} className="btn btn-bordered">
                            Читать полностью
                        </ReactiveLink>
                    </div>
                </div>
            )
        });

        let prev = '';
        if (this.props.prev) {
            prev =
                <ReactiveLink href={this.props.prev} className="article-content__left">
                    <i className='mdi mdi-arrow-left'/> Предыдущая новость
                </ReactiveLink>
        }

        let next = '';
        if (this.props.next) {
            next =
                <ReactiveLink href={this.props.next} className="article-content__right">
                    Следующая новость <i className='mdi mdi-arrow-right'/>
                </ReactiveLink>
        }

        return (
            <Wrapper>
                <Container>
                    <Row>
                        <Cell>
                            <div className='page article-page'>
                                <h1 className='page__title'>{this.props.h1}</h1>
                                <Row>
                                    <Cell sm="2-3">
                                        <span className="article-page__date">{this.props.date}</span>
                                    </Cell>
                                    <Cell sm="1-3">
                                        <h2 className="article-page__header">Интересные новости</h2>
                                    </Cell>
                                </Row>
                                <Row className="article-page__row">
                                    <Cell sm="2-3" className="article-content">
                                        {pageBlocks}
                                        <Row>
                                            <Cell xxs="1-2">
                                                {prev}
                                            </Cell>
                                            <Cell xxs="1-2">
                                                {next}
                                            </Cell>
                                        </Row>
                                    </Cell>
                                    <Cell sm="1-3" className="articles-popular">
                                        {popular_novelties}
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
