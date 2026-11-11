/*
 * Runs inline in <head> before first paint. Dark is the default, so only a
 * stored "light" choice needs to change anything.
 */
export const themeScript = `try{if(localStorage.getItem("theme")==="light")document.documentElement.classList.remove("dark")}catch(e){}`;
