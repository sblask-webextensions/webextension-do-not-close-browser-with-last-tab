const STORAGE_KEY = "lastKnownWindowAttributes";
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

async function maybeRememberWindowState(getWindowFunction) {
    let window;
    try {
        window = await getWindowFunction();
    } catch (error) {
        console.log(error);
    }

    if (!window || window.type !== "normal" || !window.focused) {
        return;
    }

    const windowAttributes = {};
    for (const attribute of CREATE_ATTRIBUTES) {
        windowAttributes[attribute] = window[attribute];
    }
    await chrome.storage.session.set({[STORAGE_KEY]: windowAttributes});
}

async function maybeRestoreWindow(_tabId, removeInfo) {
    if (removeInfo.isWindowClosing) {
        return;
    }
    const tabs = await chrome.tabs.query({});
    if (tabs.length > 0) {
        return;
    }

    const {[STORAGE_KEY]: lastKnownWindowAttributes = {}} = await chrome.storage.session.get(STORAGE_KEY);

    let windowState = lastKnownWindowAttributes.state;
    const restoredWindow = await chrome.windows.create({
        ...lastKnownWindowAttributes,
        state: "normal",
    });

    // special window states have to be set separately, see
    // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/windows/update#state
    if (windowState && windowState !== "normal") {
        if (windowState === "fullscreen") {
            // Fullscreen triggered through Chrome's macOS UI differs from the one
            // triggered by chrome.windows.update (which makes the tab bar disappear)
            // so use maximized instead
            const {os} = await chrome.runtime.getPlatformInfo();
            if (os === "mac") {
                windowState = "maximized";
            }
        }
        await chrome.windows.update(restoredWindow.id, {state: windowState});
    }
}

chrome.runtime.onInstalled.addListener(() =>            maybeRememberWindowState(() => chrome.windows.getLastFocused({windowTypes: ["normal"]})));
chrome.runtime.onStartup.addListener(() =>              maybeRememberWindowState(() => chrome.windows.getLastFocused({windowTypes: ["normal"]})));
chrome.windows.onBoundsChanged.addListener((window) =>  maybeRememberWindowState(() => window));
chrome.windows.onFocusChanged.addListener((windowId) => maybeRememberWindowState(() => windowId === chrome.windows.WINDOW_ID_NONE ? undefined : chrome.windows.get(windowId)));
chrome.tabs.onActivated.addListener(({windowId}) =>     maybeRememberWindowState(() => chrome.windows.get(windowId)));

chrome.tabs.onRemoved.addListener(maybeRestoreWindow);
