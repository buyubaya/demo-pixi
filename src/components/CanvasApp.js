import React, { useState, useEffect, useRef } from "react";
import * as PIXI from "pixi.js";
import PreviewArea from "./PreviewArea";


const loader = new PIXI.Loader();
const ticker = new PIXI.Ticker();
const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 500;


let dragStartPoint = null;


const CanvasApp = () => {

  const appRef = useRef();
  const containerRef = useRef();
  const graphicsRef = useRef();

  // const [rects, setRects] = useState([]);
  // const [currentRectID, setCurrentRectID] = useState();
  // const [currentGraphics, setCurrentGraphics] = useState();
  // const [dragStartPoint, setDragStartPoint] = useState();
  const [draggingData, setDraggingData] = useState();
  const [previewData, setPreviewData] = useState();


  useEffect(() => {
    const CanvasApp = new PIXI.autoDetectRenderer({
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
      view: document.getElementById("canvas-app"),
      transparent: true,
    });
    appRef.current = CanvasApp;
    const CanvasContainer = new PIXI.Container();
    containerRef.current = CanvasContainer;
    

    loader.add("face_01", "https://inkr-cms-dev.s3.amazonaws.com/2020/6/13/4/2589229-90.jpeg");
        // .add("page_01", "https://inkr-cms-dev.s3.amazonaws.com/processed-images/9d1e9ed9-a0e0-4041-873f-7d56cee8faa6.png");
    loader.onComplete.add((_, resources) => {
      const face_01 = resources["face_01"].texture;
      const _width = face_01.width;
      const _previewScale = CANVAS_WIDTH / _width;

      const sprite = new PIXI.Sprite(face_01);
      sprite.x = 0;
      sprite.y = 0;
      sprite.scale.x = _previewScale;
      sprite.scale.y = _previewScale;


      const graphics = new PIXI.Graphics();
      graphicsRef.current = graphics;

      CanvasContainer.addChild(sprite);
      CanvasContainer.addChild(graphics);
      // RE-RENDER
      ticker.update();
    });
    loader.load();
    

    ticker.add(() => {
      CanvasApp.render(CanvasContainer);
    });
  }, []);



  const isClickInside = (e) => {
    const _x = e.offsetX;
    const _y = e.offsetY;

    const check = graphicsRef.current.containsPoint({
      x: _x,
      y: _y,
    },);

    return check;
  };


  const handleMouseDown = (e) => {
    if (isClickInside(e)) return;

    const _x = e.offsetX;
    const _y = e.offsetY;
    const _dragStartPoint = {
      x: _x,
      y: _y,
    };
    dragStartPoint = _dragStartPoint;
    graphicsRef.current.clear();
    ticker.update();
  };

  const handleMouseUp = (e) => {
    if (isClickInside(e)) return;

    if (dragStartPoint) {
      const _deltaX = e.offsetX - dragStartPoint.x;
      const _deltaY = e.offsetY - dragStartPoint.y;
      setPreviewData({
        ...dragStartPoint,
        width: _deltaX,
        height: _deltaY,
      });
    } else {
      setPreviewData(draggingData);
    }

    dragStartPoint = null;
  };

  const handleMouseLeave = () => {
    if (dragStartPoint) {
      setPreviewData(draggingData);
      dragStartPoint = null;
    }
  };

  const handleMouseMove = (e) => {
    if (!graphicsRef.current) return;

    if(dragStartPoint){
      const _deltaX = e.offsetX - dragStartPoint.x;
      const _deltaY = e.offsetY - dragStartPoint.y;

      graphicsRef.current.clear();
      graphicsRef.current.beginFill(0x0099FF, 0.3);
      graphicsRef.current.lineStyle(1, 0x0099FF, 1, 0, true);
      graphicsRef.current.drawRect(dragStartPoint.x, dragStartPoint.y, _deltaX, _deltaY);
      graphicsRef.current.endFill();
  
      setDraggingData({
        ...dragStartPoint,
        width: _deltaX,
        height: _deltaY,
      });
      
      ticker.update();
    }
  };


  useEffect(() => {
    if (!appRef.current) return;

    const viewRef = appRef.current.view;
    viewRef.addEventListener("mousedown", handleMouseDown);
    viewRef.addEventListener("mouseup", handleMouseUp);
    viewRef.addEventListener("mouseleave", handleMouseLeave);
    viewRef.addEventListener("mousemove", handleMouseMove);

    return () => {
      appRef.current.view.removeEventListener("mousedown", handleMouseDown);
      appRef.current.view.removeEventListener("mouseup", handleMouseUp);
      appRef.current.view.removeEventListener("mouseleave", handleMouseLeave);
      appRef.current.view.removeEventListener("mousemove", handleMouseMove);
    };
  }, [appRef.current, dragStartPoint, handleMouseDown, handleMouseUp, handleMouseMove])


  return (
    <div>
      <div style={{
        display: "flex"
      }}>
        <div style={{ minWidth: CANVAS_WIDTH }}>
          <canvas id="canvas-app" />
        </div>

        <div style={{ minWidth: 300 }}>
          <PreviewArea
            url="https://inkr-cms-dev.s3.amazonaws.com/2020/6/13/4/2589229-90.jpeg"
            {...previewData}
          />
        </div>
      </div>
    </div>
  )
}


export default CanvasApp
