import React, {Component} from 'react'
import {Wrapper, Container, Row, Cell} from '../../toolbox/Grid.jsx'
import ReactiveLink from '../../toolbox/ReactiveLink.jsx'

export default class PricesView extends Component {
    render() {
        let prices = [];
        this.props.prices.map((element) => {
            prices.push(
                <tr key={element.id} className='prices--row'>
                    <td className="prices--name">
                        {element.name}
                    </td>
                    <td className="prices--cost">
                        {element.cost}
                    </td>
                </tr>
            )
        });

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
                                <h1 className='page__title'>{this.props.h1}</h1>
                                <Row>
                                    <Cell md="3-4">
                                        <table className="prices--table">
                                            <thead>
                                            </thead>
                                            <tbody>
                                            {prices}
                                            </tbody>
                                        </table>
                                    </Cell>
                                    <Cell md="1-4">
                                        <h2 className="main-h2 healings__other-h2">Методы лечения:</h2>
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
