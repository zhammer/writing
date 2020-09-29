// like.. the minimum distance of x/y diff between two touches
// that we consider to be a swipe in a direction?
const CANT_THINK_OF_THE_RIGHT_WORD = 100;

// see:
// - touch events: https://developer.mozilla.org/en-US/docs/Web/API/Touch_events
// - svelte actions: https://svelte.dev/tutorial/actions
function swipeable(node: Element) {
  // we track ongoing touches (e.g. touches that have been started
  // but have not yet ended or been cancelled)
  let trackedTouches = new Map<number, Touch>();

  // on touch start, we add all new touches in the event to trackedTouches
  // so that we can figure out displacement on each touche's touchend
  function handleTouchStart(event: TouchEvent) {
    let touches = event.changedTouches;
    for (let i = 0; i < touches.length; i++) {
      let touch = touches[i];
      trackedTouches.set(touch.identifier, touch);
    }
  }

  // cancelled touches. we discard from tracked touches without taking
  // any action.
  function handleTouchCancel(event: TouchEvent) {
    let touches = event.changedTouches;
    for (let i = 0; i < touches.length; i++) {
      let touch = touches[i];
      trackedTouches.delete(touch.identifier);
    }
  }

  function handleTouchEnd(event: TouchEvent) {
    let touches = event.changedTouches;
    for (let i = 0; i < touches.length; i++) {
      let touch = touches[i];
      if (!trackedTouches.has(touch.identifier)) {
        return;
      }

      let touchStart = trackedTouches.get(touch.identifier);
      trackedTouches.delete(touch.identifier);

      let xDiff = touch.clientX - touchStart.clientX;
      let yDiff = touch.clientY - touchStart.clientY;

      let horizontalSwipe = Math.abs(xDiff) > CANT_THINK_OF_THE_RIGHT_WORD;
      let verticalSwipe = Math.abs(yDiff) > CANT_THINK_OF_THE_RIGHT_WORD;

      let swipeEvent:
        | ""
        | "swipeleft"
        | "swiperight"
        | "swipeup"
        | "swipedown" = "";

      if (horizontalSwipe && !verticalSwipe) {
        if (xDiff > 0) {
          swipeEvent = "swiperight";
        } else {
          swipeEvent = "swipeleft";
        }
      }

      if (verticalSwipe && !horizontalSwipe) {
        if (yDiff > 0) {
          swipeEvent = "swipedown";
        } else {
          swipeEvent = "swipeup";
        }
      }

      // we didn't decide on this being a swipe event
      if (swipeEvent === "") {
        return;
      }

      node.dispatchEvent(new CustomEvent(swipeEvent));
    }
  }

  node.addEventListener("touchstart", handleTouchStart);
  node.addEventListener("touchcancel", handleTouchCancel);
  node.addEventListener("touchend", handleTouchEnd);

  return {
    destroy() {
      node.removeEventListener("touchstart", handleTouchStart);
      node.removeEventListener("touchcancel", handleTouchCancel);
      node.removeEventListener("touchend", handleTouchEnd);
    },
  };
}

export default swipeable;
