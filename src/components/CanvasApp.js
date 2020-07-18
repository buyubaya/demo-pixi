import React, { useEffect } from "react";
import * as PIXI from "pixi.js";


const CanvasApp = () => {

  useEffect(() => {
    const CanvasApp = new PIXI.autoDetectRenderer({
      width: 500,
      height: 500,
      view: document.getElementById("canvas-app")
    });

    const CanvasContainer = new PIXI.Container();

    CanvasApp.render(CanvasContainer);
  }, []);
  

  return (
    <div>
      <h1>HELLO</h1>

      <canvas id="canvas-app" />
    </div>
  )
}


export default CanvasApp
