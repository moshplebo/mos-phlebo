import Draft from 'draft-js'
const {
    EditorState,
    ContentBlock,
    Modifier,
    genKey
} = Draft;
import {isListBlock} from 'draftjs-utils';

export function insertBlockAfter(editorState, blockKey, newType, data) {
    const content = editorState.getCurrentContent();
    const blockMap = content.getBlockMap();
    const block = blockMap.get(blockKey);
    const blocksBefore = blockMap.toSeq().takeUntil((v) => (v === block));
    const blocksAfter = blockMap.toSeq().skipUntil((v) => (v === block)).rest();
    const newBlockKey = genKey();

    const newBlock = new ContentBlock({
        key: newBlockKey,
        type: 'unstyled',
        text: '',
        characterList: block.getCharacterList().slice(0, 0),
        depth: 0,
        data: data
    });

    const newBlockMap = blocksBefore.concat(
        [[blockKey, block], [newBlockKey, newBlock]],
        blocksAfter,
    ).toOrderedMap();

    const selection = editorState.getSelection();
    const newContent = content.merge({
        blockMap: newBlockMap,
        selectionBefore: selection,
        selectionAfter: selection.merge({
            anchorKey: newBlockKey,
            anchorOffset: 0,
            focusKey: newBlockKey,
            focusOffset: 0,
            isBackward: false
        })
    });

    return EditorState.push(editorState, newContent, 'split-block');
}

export function isEmptyListItem(block) {
    return isListBlock(block) && block.getLength() == 0;
}

export function removeCurrentBlock(editorState, blockKey) {
    const content = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    const block = content.getBlockForKey(blockKey);

    const newContentState = Modifier.setBlockType(
        content,
        selection,
        'unstyled'
    )

    return EditorState.push(editorState, newContentState, 'change-block-type');
}
