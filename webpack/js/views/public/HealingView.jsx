import React, {Component} from 'react'
import {Wrapper, Container, Row, Cell} from '../../toolbox/Grid.jsx'
import PageBlock from '../../components/PageBlock.jsx'
import ReactiveLink from '../../toolbox/ReactiveLink.jsx'

export default class HealingView extends Component {
    render() {
        let pageBlocks = []
        if (this.props.components && this.props.components.length > 0) {
            pageBlocks = this.props.components.map((component) => {
                return (
                    <PageBlock key={component.r_key} {...component}/>
                )
            })
        }

        let other = []
        if (this.props.other && this.props.other.length > 0) {
            other = this.props.other.map((element) => {
                return (
                    <Cell sm="1-1" key={element.id} className="healings__other-cell">
                        <ReactiveLink href={element.href}>
                            {element.name}
                        </ReactiveLink>
                    </Cell>
                )
            })
        }

        return (
            <Wrapper>
                <Container>
                    <Row>
                        <Cell>
                            <div className='page'>
                                <Row>
                                    <Cell>
                                        <h1 className='page__title'>{this.props.h1}</h1>
                                    </Cell>
                                    <Cell md="3-4">
                                        {pageBlocks}
                                    </Cell>
                                    <Cell md="1-4" className="healings__other-back">
                                        <h2 className="main-h2 healings__other-h2">Другие методы лечения:</h2>
                                        <div className="healings__other">
                                            {other}
                                        </div>
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
