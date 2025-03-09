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
  ]
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
