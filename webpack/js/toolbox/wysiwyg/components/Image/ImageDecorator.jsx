import React, {Component} from 'react'
import Store from '../../../../store.js'

function findImageEntities(contentBlock, callback, contentState) {
    contentBlock.findEntityRanges(
        (character) => {
            const entityKey = character.getEntity();
            return (
                entityKey !== null &&
                contentState.getEntity(entityKey).getType() === 'IMAGE'
            );
        },
        callback
    );
}

class Image extends Component {
    render() {
        const entity = this.props.contentState.getEntity(this.props.entityKey);
        const {src} = entity.data;
        return (
            <div className="redactor__image">
                <img src={src}/>
            </div>
        )
    }
}

const ImageDecorator = {
    strategy: findImageEntities,
    component: Image
}

export default ImageDecorator;
