import { KeyboardKeyHold } from "hold-event";

let cameraSpeed = 0.1;

const KEYCODE = {
    W: 87,
    A: 65,
    S: 83,
    D: 68,
    E: 69,
    Q: 81,
    LEFTSHIFT: 16,
};

const wKey = new KeyboardKeyHold(KEYCODE.W, 100);
const aKey = new KeyboardKeyHold(KEYCODE.A, 100);
const sKey = new KeyboardKeyHold(KEYCODE.S, 100);
const dKey = new KeyboardKeyHold(KEYCODE.D, 100);
const eKey = new KeyboardKeyHold(KEYCODE.E, 100);
const qKey = new KeyboardKeyHold(KEYCODE.Q, 100);
const leftShiftKey = new KeyboardKeyHold(KEYCODE.LEFTSHIFT, 100);

export function threejsKeyboard(controls) {
    function aEvent(event) {
        controls.truck(-cameraSpeed * event.deltaTime, 0, true);
    }
    function dEvent(event) {
        controls.truck(cameraSpeed * event.deltaTime, 0, true);
    }
    function wEvent(event) {
        controls.forward(cameraSpeed * event.deltaTime, true);
    }
    function sEvent(event) {
        controls.forward(-cameraSpeed * event.deltaTime, true);
    }
    function eEvent(event) {
        controls.truck(0, -cameraSpeed * event.deltaTime, true);
    }
    function qEvent(event) {
        controls.truck(0, cameraSpeed * event.deltaTime, true);
    }
    function leftShiftHoldEvent() {
        cameraSpeed = 1;
    }
    function leftShiftReleaseEvent() {
        cameraSpeed = 0.1;
    }

    function keyboardBind() {
        aKey.addEventListener("holding", aEvent);
        dKey.addEventListener("holding", dEvent);
        wKey.addEventListener("holding", wEvent);
        sKey.addEventListener("holding", sEvent);
        eKey.addEventListener("holding", eEvent);
        qKey.addEventListener("holding", qEvent);

        leftShiftKey.addEventListener("holding", leftShiftHoldEvent);

        leftShiftKey.addEventListener("holdEnd", leftShiftReleaseEvent);
    }

    function keyboardBindDispose() {
        aKey.removeEventListener("holding", aEvent);
        dKey.removeEventListener("holding", dEvent);
        wKey.removeEventListener("holding", wEvent);
        sKey.removeEventListener("holding", sEvent);
        eKey.removeEventListener("holding", eEvent);
        qKey.removeEventListener("holding", qEvent);

        leftShiftKey.removeEventListener("holding", leftShiftHoldEvent);

        leftShiftKey.removeEventListener("holdEnd", leftShiftReleaseEvent);
    }
    return { keyboardBind, keyboardBindDispose };
}
