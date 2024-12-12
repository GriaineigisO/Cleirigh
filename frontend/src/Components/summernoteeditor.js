import React, { useEffect, useRef } from 'react';
import ReactSummernote from 'react-summernote';
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS
import 'react-summernote/dist/react-summernote.css'; // Summernote CSS

import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Bootstrap JS
import $ from 'jquery'; // jQuery


const SummernoteEditor = ({ content, onChange }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    $(editorRef.current).summernote({
      height: 200, // Set editor height
      callbacks: {
        onChange: (contents) => {
          onChange(contents);
        }
      }
    });

    // Set initial content
    $(editorRef.current).summernote('code', content);

    return () => {
      $(editorRef.current).summernote('destroy');
    };
  }, [content, onChange]);

  return (
    <div ref={editorRef}></div>
  );
};

export default SummernoteEditor;
