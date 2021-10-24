export default function BlockStyleFn(contentBlock) {
  const type = contentBlock.getType();
  if (type === 'unstyled') {
    return 'editor-normal';
  }
}
