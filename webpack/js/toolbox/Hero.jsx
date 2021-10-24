import React, {Component} from 'react'
import classNames from 'classnames';
import {Wrapper, Container, Row, Cell} from './Grid.jsx'
import ReactiveLink from './ReactiveLink.jsx'

export default class Hero extends Component {

    render() {

        return (

            <Wrapper className={classNames('hero', this.props.className)} style={this.props.style}>
                <div className={classNames({'hero-toned': this.props.toned})}>
                    <Container>
                        <Row>
                            <Cell>
                                {this.props.children}
                            </Cell>
                        </Row>
                    </Container>
                </div>
            </Wrapper>
        );
    }

}
