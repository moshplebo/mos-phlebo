import React, {Component} from 'react'
import {Wrapper, Container, Row, Cell} from '../../toolbox/Grid.jsx'
import PageBlock from '../../components/PageBlock.jsx'

export default class PageView extends Component {
    render() {
        let pageBlocks = []
        if (this.props.components && this.props.components.length > 0) {
            pageBlocks = this.props.components.map((component) => {
                return (
                    <PageBlock key={component.r_key} {...component}/>
                )
            })
        }
        return (
            <Wrapper>
                <Container>
                    <Row>
                        <Cell>
                            <div className='page'>
                                <h1 className='page__title'>{this.props.h1}</h1>
                                {pageBlocks}
                            </div>
                        </Cell>
                    </Row>
                </Container>
            </Wrapper>
        )
    }
}
