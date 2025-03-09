import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function MyEditor({ value, onChange, style }) {
  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => {
    setShowPopup((prev) => !prev); // Avoid unnecessary state updates
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline"],
      ["blockquote", { list: "ordered" }, { list: "bullet" }],
      ["link"],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ["clean"],
      [{ custom: "info" }], // Custom info button
    ],
    keyboard: {
      bindings: {
        linebreak: {
          key: 13,
          shiftKey: true,
          handler: function (range, context) {
            this.quill.insertText(range.index, "\n");
            this.quill.setSelection(range.index + 1);
          },
        },
      },
    },
  };

  return (
    <div>
      {/* React-Quill Editor */}
      <ReactQuill
        value={value}
        onChange={onChange}
        modules={modules}
        style={style}
      />

      {/* Info Button (Outside ReactQuill to prevent unmounting) */}
      <button onClick={togglePopup} style={{ marginTop: "10px" }}>
        ℹ️ Show Info
      </button>

      {/* Popup for Keybindings */}
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>Keyboard Shortcuts</h3>
            <ul>
              <li><b>Shift + Enter</b> → New line without paragraph</li>
              <li><b>Ctrl + B</b> → Bold</li>
              <li><b>Ctrl + I</b> → Italic</li>
              <li><b>Ctrl + U</b> → Underline</li>
              <li><b>Ctrl + Shift + 7</b> → Numbered List</li>
              <li><b>Ctrl + Shift + 8</b> → Bullet List</li>
            </ul>
            <button onClick={togglePopup}>Close</button>
          </div>
        </div>
      )}

      {/* CSS Styles */}
      <style>
        {`
          .popup {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.7);
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .popup-content {
            background: white;
            padding: 20px;
            border-radius: 10px;
            width: 300px;
            text-align: center;
          }
          .popup-content ul {
            list-style: none;
            padding: 0;
          }
          .popup-content ul li {
            text-align: left;
            margin-bottom: 10px;
          }
          .popup-content button {
            margin-top: 10px;
            padding: 5px 10px;
            border: none;
            background: #007bff;
            color: white;
            border-radius: 5px;
            cursor: pointer;
          }
          .popup-content button:hover {
            background: #0056b3;
          }
        `}
      </style>
    </div>
  );
}
