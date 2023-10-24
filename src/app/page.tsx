"use client"

import { useCallback, useEffect } from "react"
import Parser from "web-tree-sitter"

export default () => {
  const init = useCallback(async () => {
    await Parser.init({
      locateFile(scriptName: string, scriptDirectory: string) {
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


