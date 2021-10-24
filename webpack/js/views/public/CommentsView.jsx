import React, {Component} from 'react'
import Isvg from 'react-inlinesvg';
import {Wrapper, Container, Row, Cell} from '../../toolbox/Grid.jsx'
import Store from '../../store.js'
const close = require('../../../css/assets/images/close.svg')

export default class CommentsView extends Component {
    constructor(props) {
        super(props);

        this.openPhoto = this.openPhoto.bind(this);
    }

    openPhoto(value) {
        let modalClose = ''
        modalClose =
            <div key="close" className="modal-close">
                <div className="close">
                    <Isvg src={close}/>
                </div>
            </div>

        Store.setData({
            modal: true,
            modalData: {content: <PhotoModal photo={value}/>, className: 'one_photo--modal',
                additionalContent: [modalClose]}
        }, true);
    }

    render() {
        let comments = [];
        this.props.comments.map((element) => {
            let img;
            if (element.img) {
                img =
                    <img
                        className="comment__preview"
                        src={element.img}
                        alt={element.fio}
                        onClick={() => {
                            this.openPhoto(element)
                        }}
                    />
            } else {
                img = ""
            }
            comments.push(
                <Row key={element.id} className='comment'>
                    <div>
                        <Cell xs="1-3" className="comment__preview-cell">
                            {img}
                        </Cell>
                        <Cell xs="2-3">
                            <h2 className='comment__name'>
                                {element.fio}
                                <div className='comment__date'>
                                    <i className="mdi mdi-calendar-clock"/> {element.date}
                                </div>
                            </h2>
                            <div dangerouslySetInnerHTML={{__html: element.text}}/>
                        </Cell>
                    </div>
                </Row>
            )
        });
        comments = comments.length > 0 ? comments : <h2>Отзывы не найдены</h2>;

        return (
            <Wrapper>
                <Container>
                    <Row>
                        <Cell>
                            <div className='page'>
                                <h1 className='page__title'>{this.props.h1}</h1>
                                {comments}
                            </div>
                        </Cell>
                    </Row>
                </Container>
            </Wrapper>
        )
    }
}

class PhotoModal extends Component {
    render() {
        return (
            <div>
                <img src={this.props.photo.img} alt={this.props.photo.fio}/>
            </div>
        )
    }
}
