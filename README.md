[![Build Status](https://travis-ci.org/sblask/webextension-do-not-close-browser-with-last-tab.svg?branch=master)](https://travis-ci.org/sblask/webextension-do-not-close-browser-with-last-tab)

Do not close browser with last tab
==================================

Creates a new window with the same properties as the closing one when the last
tab is closed.

As there is neither a way to capture these properties while the tab is closing
nor an event that informs about updates to the properties, they are cached
whenever the focus of the window or a tab changes (which includes creating new
windows and tabs).

This extension only works if the `Continue running background apps when
Chromium is closed` setting (under `Advanced`) is enabled (it is by default).

Known Issues
------------

XFCE: The properties or non-maximized windows given by Chrome are incorrect as
they do not account for border and title bar. This results in a displacement
when the window is re-created.

Feedback
--------

You can report bugs or make feature requests on
[Github](https://github.com/sblask/webextension-do-not-close-browser-with-last-tab)

Patches are welcome.
