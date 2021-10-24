import React, {Component} from 'react'
import LinkForm from './LinkForm.jsx'
import Store from '../../../../store.js'

function findLinkEntities(contentBlock, callback, contentState) {
    contentBlock.findEntityRanges(
        (character) => {
            const entityKey = character.getEntity();
            return (
                entityKey !== null &&
                contentState.getEntity(entityKey).type === 'LINK'
            );
        },
        callback
    );
}

class Link extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {contentState} = this.props;
        const entityKey = contentState.getLastCreatedEntityKey();
        const {url, target} = contentState.getEntity(entityKey).data;
        return (
            <a className='editor-link' target={target} href={url}>
                {this.props.children}
            </a>
        )
    }
}

const LinkDecorator = {
    strategy: findLinkEntities,
    component: Link
}

export default LinkDecorator;
