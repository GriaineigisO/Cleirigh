import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

// Custom keyboard handler to insert line breaks without creating <p> tag
const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline"],
    ["blockquote"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
  ],
  keyboard: {
    bindings: {
      // Custom handler for the Enter key
      linebreak: {
        key: 13, // Enter key
        handler: function (range, context) {
          const quill = this.quill;
          
          // Prevent the default Enter behavior (creating a new <p> tag)
          quill.insertText(range.index, "\n");
          quill.setSelection(range.index + 1); // Move cursor after inserted newline
        },
      },
    },
  },
};

export default function MyEditor({ value, onChange, style }) {
  return (
    <ReactQuill
      value={value}
      onChange={onChange}
      modules={modules}
      style={style}
    />
  );
}
