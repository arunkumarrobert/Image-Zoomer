document.addEventListener('DOMContentLoaded', function () {
    // Query the elements
    const image = document.getElementById('image');
    const knob = document.getElementById('knob');
    const leftSide = knob.previousElementSibling;
    const rightSide = knob.nextElementSibling;

    // The current position of mouse
    let x = 0;
    let y = 0;
    let leftWidth = 0;

    const minScale = 0.1;
    const maxScale = 2;
    const step = (maxScale - minScale) / 100;

    // Create new image element
    const cloneImage = new Image();
    cloneImage.addEventListener('load', function (e) {
        // Get the natural size
        const width = e.target.naturalWidth;
        const height = e.target.naturalHeight;

        // Set the size for image
        image.style.width = `${width}px`;
        image.style.height = `${height}px`;

        const scale = image.parentNode.getBoundingClientRect().width / width;
        image.style.transform = `scale(${scale}, ${scale})`;

        leftSide.style.width = `${(scale - minScale) / step}%`;
    });
    // Clone it
    cloneImage.src = image.src;

    // Handle the mousedown event
    // that's triggered when user drags the knob
    const mouseDownHandler = function (e) {
        // Get the current mouse position
        x = e.clientX;
        y = e.clientY;
        leftWidth = leftSide.getBoundingClientRect().width;

        // Attach the listeners to `document`
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    };

    const mouseMoveHandler = function (e) {
        // How far the mouse has been moved
        const dx = e.clientX - x;
        const dy = e.clientY - y;

        const containerWidth = knob.parentNode.getBoundingClientRect().width;
        let newLeftWidth = ((leftWidth + dx) * 100) / containerWidth;
        newLeftWidth = Math.max(newLeftWidth, 0);
        newLeftWidth = Math.min(newLeftWidth, 100);

        leftSide.style.width = `${newLeftWidth}%`;

        leftSide.style.userSelect = 'none';
        leftSide.style.pointerEvents = 'none';

        rightSide.style.userSelect = 'none';
        rightSide.style.pointerEvents = 'none';

        const scale = minScale + newLeftWidth * step;
        image.style.transform = `scale(${scale}, ${scale})`;
    };

    // Triggered when user drops the knob
    const mouseUpHandler = function () {
        leftSide.style.removeProperty('user-select');
        leftSide.style.removeProperty('pointer-events');

        rightSide.style.removeProperty('user-select');
        rightSide.style.removeProperty('pointer-events');

        // Remove the handlers of `mousemove` and `mouseup`
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
    };

    // Attach the handler
    knob.addEventListener('mousedown', mouseDownHandler);
});