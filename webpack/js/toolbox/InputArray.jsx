import React, { Component } from 'react'
import { Row, Cell } from './Grid.jsx'

export default class InputArray extends Component {
    constructor(props) {
        super(props)

        const fields = this.props.values || []
        this.state = { fields: fields }

        this.addInput = this.addInput.bind(this)
        this.drawInput = this.drawInput.bind(this)
    }

    addInput() {
        let fields = this.state.fields
        fields.push(this.props.defaultValue || "")

        this.setState({ fields: fields })
    }

    deleteInput(index) {
        let fields = this.state.fields
        fields.splice(index, 1)

        this.setState({ fields: fields })
    }

    drawInput(value, number) {
        const InputComponent = this.props.component

        return (
            <Row key={number}>
                <Cell xs="7-8">
                    <InputComponent key={value[this.props.inputKey] || value} label={this.props.label} name={`${this.props.name}[]`}
                        value={value} />
                </Cell>
                <Cell xs="1-8" className="remove__button__wrapper remove__button__wrapper--low ">
                    <button type="button" onClick={() => this.deleteInput(number)}>&times;</button>
                </Cell>
            </Row>
        )
    }


    render() {
        let inputs = []

        this.state.fields.map((value, index) => {
            inputs.push(this.drawInput(value, index))
        })

        return (
            <div>
                {inputs}
                <button className="btn-add" style={{fontSize: '130%'}} type="button" onClick={this.addInput}>+</button>
            </div>
        )
    }

}
