/*
this is needed when opening the page in an iframe but not if opening a new window
it simply copies the existing session cookie to tgn-session, setting it to SameSite-Nonne;Secure so it can be accessed in the iframe

iframe vs window

iframe
    + frame can be hidden, user doesn't see any integration page
    + console log can be provided to users in notebook console
    - needs cross-site cookie
    - socket connection in parent page

window
    - pops up a window briefly
    + complete isolation of module integration page
*/

//createCookie("tgn-session", readCookie("session"), 1, ";SameSite=None;Secure");
