function isTextNode(node: Node) {
  return node.nodeType === 3;
}

function getTextNodesInRange(range: Range) {
  const {
    commonAncestorContainer: ancestor,
    startContainer,
    endContainer,
  } = range;

  /* If range has only one text node, then the startContainer 
  will be the ancestor for the range. Treewalker works only on 
  nodes under the root node. Extra empty space is added in order to 
  streamline the string processing below.*/
  if (isTextNode(ancestor)) {
    return [range.startContainer.textContent + " "];
  }

  /* A TreeWalker to find only textnodes whose parent is <span>
    so that we don't have to traverse all the nodes under ancestor. */
  let walk = document.createTreeWalker(ancestor, NodeFilter.SHOW_TEXT, {
    acceptNode: ({ parentNode }) =>
      parentNode?.nodeName === "SPAN"
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_REJECT,
  });

  /* We need a way to recognize where the textnodes within the range start.
    But what if the startContainer is not within the nodes filtered by
    TreeWalker? Then the textnodes in range must start immediately 
    at the beginning. Thus, isInRange must be set "true" at the outset.  */
  let isInRange = !isTextNode(startContainer);

  let node;
  let result = [];
  while ((node = walk.nextNode())) {
    if (node === startContainer) {
      isInRange = true;
    }
    if (isInRange && isTextNode(node)) {
      result.push(node.textContent + " ");
    }
    if (node === endContainer) {
      break;
    }
  }
  return result;
}

function addMissingSpacesToSelection(range: Range) {
  const { startContainer, endContainer, endOffset, startOffset } = range;

  const stringifiedRange = getTextNodesInRange(range).join("");

  /*
  We need to determine where to slice depending on whether the first and last nodes
  are text nodes or not. Text nodes comes with an offset, other nodes do not.
  */
  let startIndex = isTextNode(startContainer) ? startOffset : 0;
  let endIndex = isTextNode(endContainer)
    ? stringifiedRange.length - (endContainer as Text)?.length + endOffset
    : undefined;

  return stringifiedRange.slice(startIndex, endIndex).trim();
}

export default addMissingSpacesToSelection;
