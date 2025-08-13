import React from "react";
import { useState } from "react";
import MDEditor from "@uiw/react-md-editor";
export function EditTest() {
  const [value, setValue] = useState("**Hello world!**");

  return (
    <div className="container">
      <MDEditor onChange={setValue} value={value} />
      <MDEditor.Markdown source={value} style={{ whiteSpace: "pre-wrap" }} />
    </div>
  );
}
