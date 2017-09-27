const CREATE_ATTRIBUTES = [
    "focused",
    "height",
    "incognito",
    "left",
    "state",
    "top",
    "type",
    "width",
];

let lastKnownWindowState = {};

function maybeRememberWindowState() {
    chrome.windows.getAll({windowTypes: ["normal"]}, __maybeRememberWindowState);
}

function __maybeRememberWindowState(windows) {
    for (let window of windows) {
        if (window.focused) {
            lastKnownWindowState = {};
            for (let attribute of CREATE_ATTRIBUTES) {
                lastKnownWindowState[attribute] = window[attribute];
            }
        }
    }
}

function __isSpecialState(windowState) {
    return [
        "fullscreen",
        "maximized",
        "minimized",
    ].indexOf(windowState) != -1;
}

function handleRemove(_tabId, removeInfo) {
    if (removeInfo.isWindowClosing) {
        return;
    }
    chrome.tabs.query({}, __maybeRestoreWindow);
}

function __maybeRestoreWindow(tabs) {
    if (tabs.length > 0) {
        return;
    }

    let targetState = lastKnownWindowState.state;
    if (__isSpecialState(targetState)) {
        lastKnownWindowState.state = "normal";
        chrome.windows.create(lastKnownWindowState, __applyState(targetState));
    } else {
        chrome.windows.create(lastKnownWindowState);
    }
}

function __applyState(state) {
    return (window) => chrome.windows.update(window.id, {state});
}

chrome.windows.onFocusChanged.addListener(maybeRememberWindowState);
chrome.tabs.onActivated.addListener(maybeRememberWindowState);

chrome.tabs.onRemoved.addListener(handleRemove);
