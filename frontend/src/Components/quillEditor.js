import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

// Custom keyboard handler to insert a linebreak without a paragraph
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
      linebreak: {
        key: 13, // Enter key
        handler: function (range, context) {
          const quill = this.quill;
          const currentFormat = quill.getFormat(range.index); // Get current format at cursor position

          // Only insert a newline, not a <p> tag
          if (!currentFormat["list"]) {
            quill.insertText(range.index, "\n"); // Insert line break
            quill.setSelection(range.index + 1); // Move cursor after inserted newline
          } else {
            // Handle Enter key for lists, retaining the list format
            quill.insertText(range.index, "\n", "list", "bullet");
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
