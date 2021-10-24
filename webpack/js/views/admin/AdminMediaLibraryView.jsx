import React, { Component } from 'react'
import Isvg from 'react-inlinesvg';
import ReactiveLink from '../../toolbox/ReactiveLink.jsx'
import { Wrapper, Row, Cell } from '../../toolbox/Grid.jsx'
import MediaLibrary from '../../toolbox/MediaLibrary.jsx'

export default class AdminMediaLibraryView extends Component {
    render() {
        let block = '';
        switch (this.props.action) {
            case 'index':
                block = <Index {...this.props} />;
                break;
            case 'show':
                block = <Show {...this.props} />;
                break;
        }

        let error = '';
        if (this.props.error) {
            error = <div style={{ width: '600px' }} className="form_common_error" dangerouslySetInnerHTML={{ __html: this.props.error }} />;
        }

        return (
            <Wrapper>
                <h1>{this.props.h1}</h1>
                {error}
                {block}
            </Wrapper>
        );
    }
}

class Index extends Component {
    render() {
        let folders = []

        if (this.props.root_folders) {
            this.props.root_folders.map(function (folder) {
                const icon = require('../../../css/assets/images/icons_media/' + folder.icon + '.svg')
                folders.push(
                    <Cell key={folder.id} xxs="1-2" xs="1-3" sm="1-4" lg="1-8" className="media__root-folder">
                        <ReactiveLink href={folder.src}>
                            <Isvg className="media__svg-icon media__root-folder--logo" src={icon}/>
                            <h3>{folder.name}</h3>
                        </ReactiveLink>
                    </Cell>
                )
            })
        }

        return (
            <div className="media__root">
                {folders}
            </div>
        );
    }
}

class Show extends Component {
    render() {
        return (
            <MediaLibrary url={this.props.url} />
        );
    }
}
