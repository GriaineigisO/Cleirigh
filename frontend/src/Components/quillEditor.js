import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

// Custom keyboard handler to insert line break without creating <p> tag
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
          const currentFormat = quill.getFormat(range.index); // Get current format at cursor position

          // Insert <br> (line break) instead of creating a <p> tag
          if (!currentFormat["list"]) {
            quill.insertText(range.index, "\n", "break"); // Insert a line break
            quill.setSelection(range.index + 1); // Move cursor after inserted newline
          } else {
            // Handle Enter key for lists
            quill.insertText(range.index, "\n", "list", "bullet"); // Insert newline while keeping the list format
            quill.setSelection(range.index + 1); // Move cursor after inserted newline
          }
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
