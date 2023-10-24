import Parser from "web-tree-sitter";

let isRendering = 0;
let parseCount = 0;

export const renderTree = async (tree: Parser.Tree) => {
  isRendering++;
  const cursor = tree.walk();

  let currentRenderCount = parseCount;
  let row = '';
  let rows = [];
  let finishedRow = false;
  let visitedChildren = false;
  let indentLevel = 0;

  for (let i = 0; ; i++) {
    if (i > 0 && i % 10000 === 0) {
      await new Promise(r => setTimeout(r, 0));
      if (parseCount !== currentRenderCount) {
        cursor.delete();
        isRendering--;
        return;
      }
    }

    let displayName;
    if (cursor.nodeIsMissing) {
      displayName = `MISSING ${cursor.nodeType}`
    } else if (cursor.nodeIsNamed) {
      displayName = cursor.nodeType;
    }

    if (visitedChildren) {
      if (displayName) {
        finishedRow = true;
      }

      if (cursor.gotoNextSibling()) {
        visitedChildren = false;
      } else if (cursor.gotoParent()) {
        visitedChildren = true;
        indentLevel--;
      } else {
        break;
      }
    } else {
      if (displayName) {
        if (finishedRow) {
          row += '';
          rows.push(row);
          finishedRow = false;
        }
        const start = cursor.startPosition;
        const end = cursor.endPosition;
        const id = cursor.nodeId;
        let fieldName = cursor.currentFieldName();
        if (fieldName) {
          fieldName += ': ';
        } else {
          fieldName = '';
        }
        row = `${'  '.repeat(indentLevel)}${fieldName} ${displayName} [${start.row}, ${start.column}] - [${end.row}, ${end.column}]`;
        finishedRow = true;
      }

      if (cursor.gotoFirstChild()) {
        visitedChildren = false;
        indentLevel++;
      } else {
        visitedChildren = true;
      }
    }
  }
  if (finishedRow) {
    row += '';
    rows.push(row);
  }

  cursor.delete();
  isRendering--;

  return rows.join("\n") || ""
}
