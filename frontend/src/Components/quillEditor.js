import React, { useState, useRef, useCallback } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

// Custom Toolbar Button Handler
const showInfoPopup = (setShowPopup) => {
  setShowPopup((prev) => !prev);
};

// Add custom toolbar handler
const CustomToolbar = ({ setShowPopup }) => (
  <div id="toolbar">
    <span className="ql-formats">
      <select className="ql-header">
        <option value="1"></option>
        <option value="2"></option>
        <option selected></option>
      </select>
    </span>
    <span className="ql-formats">
      <button className="ql-bold"></button>
      <button className="ql-italic"></button>
      <button className="ql-underline"></button>
    </span>
    <span className="ql-formats">
      <button className="ql-blockquote"></button>
      <button className="ql-list" value="ordered"></button>
      <button className="ql-list" value="bullet"></button>
    </span>
    <span className="ql-formats">
      <button className="ql-link"></button>
    </span>
    <span className="ql-formats">
      <button className="ql-info">ℹ️</button> {/* Custom Info Button */}
    </span>
  </div>
);

export default function MyEditor({ value, onChange, style }) {
  const [showPopup, setShowPopup] = useState(false);

  const quillRef = useRef(null);

  // Define modules with custom toolbar button handler
  const modules = {
    toolbar: {
      container: "#toolbar", // Attach to custom toolbar
      handlers: {
        info: () => showInfoPopup(setShowPopup), // Handle custom info button
      },
    },
  };

  // Callback to update text value (onChange)
  const handleChange = useCallback((value) => {
    onChange(value);
  }, [onChange]);

  return (
    <div>
      {/* Custom Toolbar */}
      <CustomToolbar setShowPopup={setShowPopup} />

      {/* React-Quill Editor */}
      <ReactQuill
        ref={quillRef}
        value={value}
        onChange={handleChange} // Prevent re-render on popup state change
        modules={modules}
        style={style}
      />

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
            <button onClick={() => setShowPopup(false)}>Close</button>
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
