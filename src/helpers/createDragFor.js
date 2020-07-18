export const createDragFor = ({
  target,
  onDragStart = () => undefined,
  onDragMove = () => undefined,
  onDragEnd = () => undefined,
}) => {

  let dragStartPoint = null;

  if (target) {
    target.addEventListener("mousedown", function(e){
      const _x = e.offsetX;
      const _y = e.offsetY;
      dragStartPoint = {
        x: _x,
        y: _y,
      };
      onDragStart(dragStartPoint);
    });
    target.addEventListener("mouseup", function(e){
      dragStartPoint = null;
      onDragEnd();
    });
    target.addEventListener("mousemove", function(e){
      if(dragStartPoint){
        const _deltaX = e.offsetX - dragStartPoint.x;
        const _deltaY = e.offsetY - dragStartPoint.y;
        const _delta = {
          x: _deltaX,
          y: _deltaY,
        };
        onDragMove({
          startPoint: dragStartPoint,
          delta: _delta,
        });
      }
    });
  }

};