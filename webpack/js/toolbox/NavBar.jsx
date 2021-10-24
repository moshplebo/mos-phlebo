import React, {Component} from 'react'
import NavTabs from './NavTabs.jsx';
import ReactiveLink from './ReactiveLink.jsx';
import classNames from 'classnames';
import Store from '../store.js'
import {Wrapper, Container, Row, Cell} from '../toolbox/Grid.jsx'
import BackCallForm from '../components/BackCallForm.jsx'

class Navbar extends Component {
    constructor(props) {
        super(props);

        this.state = {fixed: false}
        this.setFixed = this.setFixed.bind(this)
        this.showModal = this.showModal.bind(this);
    }

    setFixed() {
        let headerHeight = 0
        headerHeight += document.getElementById('header').scrollHeight

        if (window.scrollY >= headerHeight) {
            this.setState({fixed: true})
        } else {
            this.setState({fixed: false})
        }
    }

    showModal() {
        Store.setData({
                modal: true,
                modalData: {
                    content: <BackCallForm cur_date={this.props.cur_date} cur_time={this.props.cur_time}/>,
                    modalClose: true
                }
            },
            true);
    }

    showSidebar() {
        Store.setData({drawer: true}, true)
    }

    componentDidMount() {
        window.addEventListener('scroll', this.setFixed)
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.setFixed)
    }

    render() {
        return (
            <div id='navbar'
                 className={classNames('navbar wrapper', this.props.className, {'navbar-fixed': this.state.fixed})}>
                <Container>
                    <Row>
                        <Cell>
                            <div className="btn-call__containter">
                                <button className='btn btn-bordered btn-call' onClick={this.showModal}>
                                    ЗАПИСЬ НА ПРИЕМ
                                </button>
                            </div>
                            <button onClick={this.showSidebar} className="menu-btn">
                                <i className="mdi mdi-menu"></i>
                            </button>

                            <NavTabs tabs={this.props.tabs}/>
                        </Cell>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default Navbar;
