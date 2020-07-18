import React, { useEffect, useRef } from 'react';
import * as PIXI from "pixi.js";


const loader = new PIXI.Loader();
const ticker = new PIXI.Ticker();
const PREVIEW_WIDTH = 300;
const PREVIEW_HEIGHT = 300;


const PreviewArea = ({
  url,
  x,
  y,
  width,
  height,
}) => {

  const appRef = useRef();
  const containerRef = useRef();
  const spriteRef = useRef();
  const graphicsRef = useRef();


  // DID MOUNT
  useEffect(() => {
    appRef.current = new PIXI.autoDetectRenderer({
      width: PREVIEW_WIDTH,
      height: PREVIEW_HEIGHT,
      view: document.getElementById("canvas-preview"),
      transparent: true,
    });
    containerRef.current = new PIXI.Container();

    ticker.add(() => {
      appRef.current.render(containerRef.current);
    });
  }, []);


  useEffect(() => {
    loader.add("preview_img", url);
    loader.onComplete.add((_, resources) => {
      const preview_img = resources["preview_img"].texture;
      const _width = preview_img.width;
      const _previewScale = PREVIEW_WIDTH / _width;

      spriteRef.current = new PIXI.Sprite(preview_img);
      spriteRef.current.x = 0;
      spriteRef.current.y = 0;
      spriteRef.current.scale.x = _previewScale;
      spriteRef.current.scale.y = _previewScale;

      graphicsRef.current = new PIXI.Graphics();

      containerRef.current.addChild(spriteRef.current);
      containerRef.current.addChild(graphicsRef.current);

      ticker.update();
    });
    loader.load();
  }, [url]);


  useEffect(() => {
    if (!graphicsRef.current) return;

    const _scale = PREVIEW_WIDTH / 500;

    graphicsRef.current.clear();
    graphicsRef.current.beginFill();
    graphicsRef.current.drawRect(x * _scale, y * _scale, width * _scale, height * _scale);
    graphicsRef.current.endFill();
    spriteRef.current.mask = graphicsRef.current;
    

    ticker.update();
  }, [x, y, width, height]);


  return (
    <div>
      <canvas id="canvas-preview" />
    </div>
  )
}


export default PreviewArea
