[![pre-commit Status](https://github.com/sblask/webextension-do-not-close-browser-with-last-tab/actions/workflows/pre-commit.yml/badge.svg)](https://github.com/sblask/webextension-do-not-close-browser-with-last-tab/actions/workflows/pre-commit.yml)
[![Chrome Web Store Version](https://img.shields.io/chrome-web-store/v/iiolkehjeklhkdphaakkceadenbcdahj?color=db4437)](https://chromewebstore.google.com/detail/do-not-close-browser-with/iiolkehjeklhkdphaakkceadenbcdahj)

Do not close browser with last tab
==================================

Chrome usually shuts down when its last tab is closed. This extension creates a
new window with the same properties as the closing one when this happens. You
might get a flicker, but the perceived effect will be that a new tab replaces
the closed one.

As there is no way to capture the window properties while the tab is closing,
they are cached whenever the window bounds, the focused window, or the active
tab changes.

This extension only works if the `Continue running background apps when
Chromium is closed` setting (under `Advanced`) is enabled (it is by default).

Known Issues
------------

macOS: Fullscreen windows are restored as maximized because fullscreen
triggered through the extension API hides Chrome's tab bar.

XFCE: The properties of non-maximized windows given by Chrome are incorrect as
they do not account for border and title bar. This results in a displacement
when the window is re-created.

Privacy Policy
--------------

This extension does not collect or send data of any kind to third parties.

Feedback
--------

You can report bugs or make feature requests on
[Github](https://github.com/sblask/webextension-do-not-close-browser-with-last-tab)

Patches are welcome.
