export function extractLeftTop(e) {
    let left, top;

    // Handle touch events
    if (e.touches) {
        const touch = e.touches[0] || e.changedTouches[0];
        left = touch.clientX;
        top = touch.clientY;
    } else {
        // Handle mouse events
        left = e.clientX;
        top = e.clientY;
    }

    return { left, top };
}