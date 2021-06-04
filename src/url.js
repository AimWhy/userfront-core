import axios from "axios";

import { apiUrl } from "./constants.js";
import { store } from "./store.js";
import { removeAllCookies } from "./cookies.js";

/**
 * Get the value of a query attribute, e.g. ?attr=value
 * @param {String} attrName
 */
export function getQueryAttr(attrName) {
  if (
    !window.location.href ||
    window.location.href.indexOf(`${attrName}=`) < 0
  ) {
    return;
  }
  return decodeURIComponent(
    window.location.href.split(`${attrName}=`)[1].split("&")[0]
  );
}

// TODO replace with direct check of the access token.
/**
 * If the access token is valid, redirect the browser to the
 * tenant's login redirection path (path after login).
 */
export async function redirectIfLoggedIn() {
  if (!store.accessToken) {
    return removeAllCookies();
  }
  if (getQueryAttr("redirect")) {
    return redirectToPath(getQueryAttr("redirect"));
  }

  try {
    const { data } = await axios.get(`${apiUrl}self`, {
      headers: {
        authorization: `Bearer ${store.accessToken}`,
      },
    });
    if (data.tenant && data.tenant.loginRedirectPath) {
      redirectToPath(data.tenant.loginRedirectPath);
    }
  } catch (err) {
    removeAllCookies();
  }
}

/**
 * Redirect to path portion of a URL.
 */
export function redirectToPath(pathOrUrl) {
  try {
    document;
  } catch (error) {
    return;
  }
  if (!pathOrUrl) return;
  const el = document.createElement("a");
  el.href = pathOrUrl;
  let path = `${el.pathname}${el.hash}${el.search}`;
  if (el.pathname !== window.location.pathname) {
    window.location.assign(path);
  }
}

export default {
  redirectIfLoggedIn,
};
