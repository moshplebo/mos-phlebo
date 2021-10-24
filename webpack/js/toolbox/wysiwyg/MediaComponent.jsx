import React, {Component} from 'react'

export default class MediaComponent extends Component {
    render() {
        const {block, contentState} = this.props
        const data = contentState.getEntity(block.getEntityAt(0)).getData()

        return (
            <img className='editor-image' src={data.src}/>
        )
    }
}
