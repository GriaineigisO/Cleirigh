import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

// Custom keyboard handler to insert a linebreak without creating <p> tag
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
        handler: function (range) {
          const quill = this.quill;
          const cursorPosition = range.index;

          // Insert line break <br> instead of a new paragraph <p>
          quill.insertEmbed(cursorPosition, "break", true); // Insert a <br> tag

          // Move the cursor to the next position
          quill.setSelection(cursorPosition + 1);
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
