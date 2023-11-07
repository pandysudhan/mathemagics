import React from "react";
import TitleArea from "./components/TitleArea";
import DrawableCanvas from "./components/Canvas";


function App() {
  return (
    <div className="flex flex-col h-screen w-screen bg-gradient-to-r from-cyan-500 to-blue-500	items-center ">
      {" "}
      <div className="">
        <TitleArea></TitleArea>
      </div>
      <div className="flex flex-row">
        <DrawableCanvas />
      </div>
    </div>
  );
}

export default App;
