import React, { useEffect, useState } from "react";
import AceEditor from "react-ace";

import "brace/mode/javascript";
import "brace/mode/python";
import "brace/mode/java";
// Add more languages here as required

import "brace/theme/github";
import hljs from 'highlight.js';

// Import styles for highlight.js supported languages
import 'highlight.js/styles/github.css';

interface CodeAreaProps {
  defaultLanguage?: string;
  code: string;
  setCode: (code: string) => void;
}

const CodeArea: React.FC<CodeAreaProps> = ({ defaultLanguage = "javascript", code, setCode }) => {
  const [language, setLanguage] = useState(defaultLanguage);

  useEffect(() => {
    if (code) {
      const detectedLanguage = hljs.highlightAuto(code).language;
      setLanguage(detectedLanguage || defaultLanguage);
    }
  }, [code, defaultLanguage]);

  const handleChange = (newCode: string) => {
    setCode(newCode);
    console.log(newCode);
  };

  return (
    <div className="p-4 h-1/2">
      <h2 className="text-xl font-bold mb-4">Paste your code here or Just type the name of the algorithm</h2>
      <p className="text-sm text-gray-500 mb-4">
        By pasting you can get review on how close your speech is in explaining
        the code.
      </p>
      <AceEditor
        width="100%"
        height="200px"
        mode={language}
        theme="github"
        value={code}
        onChange={handleChange}
        name="codeArea"
        editorProps={{ $blockScrolling: true }}
        fontSize={14}
        showPrintMargin={false}
        showGutter
        highlightActiveLine
        className="w-full h-full"
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
          showLineNumbers: true,
          tabSize: 2,
        }}
      />
    </div>
  );
};

export default CodeArea;
