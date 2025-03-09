import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

// Custom Toolbar Component
const CustomToolbar = ({ onInfoClick }) => (
  <div id="toolbar">
    <select className="ql-header">
      <option value="1"></option>
      <option value="2"></option>
      <option selected></option>
    </select>
    <button className="ql-bold"></button>
    <button className="ql-italic"></button>
    <button className="ql-underline"></button>
    <button className="ql-blockquote"></button>
    <button className="ql-list" value="ordered"></button>
    <button className="ql-list" value="bullet"></button>
    <button className="ql-link"></button>
    {/* Custom Info Button */}
    <button className="ql-info" onClick={onInfoClick}>ℹ️</button>
  </div>
);

export default function MyEditor({ value, onChange, style }) {
  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  return (
    <div>
      {/* Custom Toolbar */}
      <CustomToolbar onInfoClick={togglePopup} />
      <ReactQuill
        value={value}
        onChange={onChange}
        modules={{
          toolbar: {
            container: "#toolbar",
          },
          keyboard: {
            bindings: {
              linebreak: {
                key: 13,
                handler: function (range, context) {
                  const quill = this.quill;
                  quill.insertText(range.index, "\n");
                  quill.setSelection(range.index + 1);
                },
              },
            },
          },
        }}
        style={style}
      />

      {/* Popup for Keybindings */}
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>Keyboard Shortcuts</h3>
            <ul>
              <li><b>Shift + Enter</b> → Insert a new line without starting a new paragraph</li>
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
      
      {/* CSS Styles for Popup */}
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
