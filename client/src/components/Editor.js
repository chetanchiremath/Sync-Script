import React, { useEffect, useRef } from "react";
import "codemirror/mode/javascript/javascript";
import "codemirror/theme/dracula.css";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import "codemirror/lib/codemirror.css";
import CodeMirror from "codemirror";

function Editor() {
	const editorRef = useRef(null);
	useEffect(() => {
		const init = async () => {
			const editor = CodeMirror.fromTextArea(
				document.getElementById("realtimeEditor"),
				{
					mode: { name: "javascript", json: true },
					theme: "dracula",
					autoCloseTags: true,
					autoCloseBrackets: true,
					lineNumbers: true,
				}
			);
			editorRef.current = editor;

			editor.setSize("100%", "100%");
		};
		init();
	}, []);

	return (
		<div style={{ height: "100%", flexGrow: 1 }}>
			<textarea id="realtimeEditor"></textarea>
		</div>
	);
}

export default Editor;
