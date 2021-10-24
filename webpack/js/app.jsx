import React, {Component} from 'react'
import Store from './store.js'
import Swipeable from 'react-swipeable';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {Wrapper, Container, Row, Cell} from './toolbox/Grid.jsx'
import ReactiveLink from './toolbox/ReactiveLink.jsx'
import NavBar from './toolbox/NavBar.jsx'
import Drawer from './toolbox/Drawer.jsx'
import Modal from './toolbox/Modal.jsx'


export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = Store.getData();
    }

    componentWillMount() {
        Store.setState = (data) => {
            this.setState(data);
        };
    }

    componentDidMount() {
        window.onpopstate = function (event) {
            Store.backTo(event.state);
        };
    }

    handleFaderClick(e) {
        Store.setData({drawer: false, modal: false}, true);
    }

    swipedRight(e) {
        Store.setData({drawer: true}, true)
    }

    swipedLeft(e) {
        Store.setData({drawer: false}, true)
    }

    showModal() {
        Store.setData({modal: true, modalData: {header: 'Модальник', cancel: {className: 'btn-primary'}}}, true)
    }

    render() {
        let drawer = '';
        if (this.state.drawer) {
            drawer = <Drawer menu={this.state.drawer_menu}/>;
        } else if (this.state.modal) {
            drawer = <Modal {...this.state.modalData}/>;
        }

        let LayoutClass = Store.getLayout();
        let ViewClass = Store.getView();
        let view = <ViewClass key="view"/>;

        return (
            <Swipeable onSwipingRight={this.swipedRight} onSwipingLeft={this.swipedLeft}>
                <ReactCSSTransitionGroup component="div" transitionName="fader-a" onClick={this.handleFaderClick.bind(this)} transitionEnterTimeout={700} transitionLeaveTimeout={500}>
                    {drawer}
                </ReactCSSTransitionGroup>

                <LayoutClass key="layout" {...this.state}>
                    {view}
                </LayoutClass>
            </Swipeable>

        );
    }
}
