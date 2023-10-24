"use client"

import { useCallback, useEffect, useState } from "react"
import Parser from "web-tree-sitter"
import { renderTree } from "./tree-utils"


const sourceCode = `import { useCallback, useEffect } from "react"
import Parser from "web-tree-sitter"

export default () => {
  const init = useCallback(async () => {
    await Parser.init({
      locateFile(scriptName: string) {
        return scriptName;
      },
    });

    const parser = new Parser;

    const JavaScript = await Parser.Language.load('/tree-sitter-javascript.wasm');
    parser.setLanguage(JavaScript);

    const sourceCode = 'let x = 1; console.log(x);';
    const tree = parser.parse(sourceCode);
    console.log(tree.rootNode.toString());
  }, [])

  useEffect(() => { init() }, [])

  return <div>hi there</div>
}
`

export default () => {
  const [treeText, setTreeText] = useState("")
  const [tree, setTree] = useState<Parser.Tree | null>(null)
  const [styleCode, setStyledCode] = useState(sourceCode)
  const init = useCallback(async () => {
    await Parser.init({
      locateFile(scriptName: string) {
        return scriptName;
      },
    });

    const parser = new Parser;

    const language = await Parser.Language.load('/tree-sitter-javascript.wasm');
    parser.setLanguage(language);

    const tree = parser.parse(sourceCode);
    setTree(tree)
    const treeText = await renderTree(tree)
    setTreeText(treeText || "")
  }, [])

  useEffect(() => { init() }, [])

  return <div>
    <div
      style={{
        whiteSpace: "pre",
        fontFamily:
          `"Menlo","Consolas","Roboto Mono","Ubuntu Monospace","Noto Mono","Oxygen Mono","Liberation Mono",monospace,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"`,
        fontSize: 13
      }}
      dangerouslySetInnerHTML={{ __html: styleCode }}
    />

    <details>
      <summary>Tree</summary>
      <pre>
        {treeText}
      </pre>
    </details>
  </div>
}


