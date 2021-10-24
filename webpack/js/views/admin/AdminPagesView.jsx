import React, { Component } from 'react'
import ReactiveLink from '../../toolbox/ReactiveLink.jsx'
import { Wrapper, Container, Row, Cell } from '../../toolbox/Grid.jsx'
import Checkbox from '../../toolbox/Checkbox.jsx'
import Store from '../../store.js'

export default class AdminPagesView extends Component {
    render() {
        let pages = []
        if (this.props.pages && this.props.pages.length > 0) {
            pages = this.props.pages.map((page) => {
                return (
                    <tr key={page.id}>
                        <td>{page.name}</td>
                        <td className='center'>
                            <Cell xs='1-2' className='table__controls'>
                                <ReactiveLink href={page.control_url + '/move_up'} className='' post_link='true'>
                                    <i className='mdi mdi-arrow-up-bold' />
                                </ReactiveLink>
                            </Cell>
                            <Cell xs='1-2' className='table__controls'>
                                <ReactiveLink href={page.control_url + '/move_down'} className='' post_link='true'>
                                    <i className='mdi mdi-arrow-down-bold' />
                                </ReactiveLink>
                            </Cell>
                        </td>
                    </tr>
                )
            })
        }

        return (
            <table className='admin-table'>
                <thead>
                    <tr>
                        <th>Название</th>
                        <th>Управление</th>
                    </tr>
                </thead>
                <tbody>
                    {pages}
                </tbody>
            </table>
        )
    }
}
