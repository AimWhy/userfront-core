!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports,require("axios"),require("js-cookie")):"function"==typeof define&&define.amd?define(["exports","axios","js-cookie"],t):t((e=e||self).core={},e.axios,e.jsCookie)}(this,function(e,t,r){t=t&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t,r=r&&Object.prototype.hasOwnProperty.call(r,"default")?r.default:r;let n={apiUrl:"https://api.userfront.com/v0/",privateIPRegex:/((^127\.)|(^10\.)|(^172\.1[6-9]\.)|(^172\.2[0-9]\.)|(^172\.3[0-1]\.)|(^192\.168\.))\d{1,3}\.\d{1,3}/g};function o(e,t){try{var r=e()}catch(e){return t(e)}return r&&r.then?r.then(void 0,t):r}const s=function(){try{if(!Q("store").accessToken)return Promise.resolve(Q("removeAllCookies")());const e=o(function(){return Promise.resolve(Q("axios").get(Q("apiUrl")+"auth/logout",{headers:{authorization:"Bearer "+Q("store").accessToken}})).then(function({data:e}){Q("removeAllCookies")(),Q("redirectToPath")(e.redirectTo)})},function(){});return Promise.resolve(e&&e.then?e.then(function(){}):void 0)}catch(e){return Promise.reject(e)}},i=function(){try{if(!Q("store").accessToken)return Promise.resolve(Q("removeAllCookies")());const e=o(function(){return Promise.resolve(Q("axios").get(Q("apiUrl")+"self",{headers:{authorization:"Bearer "+Q("store").accessToken}})).then(function({data:e}){e.tenant&&e.tenant.loginRedirectPath&&Q("redirectToPath")(e.tenant.loginRedirectPath)})},function(){Q("removeAllCookies")()});return Promise.resolve(e&&e.then?e.then(function(){}):void 0)}catch(e){return Promise.reject(e)}},a=function({uuid:e,token:t,password:r}){try{if(t||(t=Q("getQueryAttr")("token")),e||(e=Q("getQueryAttr")("uuid")),!t||!e)throw new Error("Missing token or uuid");return Promise.resolve(Q("axios").put(Q("apiUrl")+"auth/reset",{tenantId:Q("store").tenantId,uuid:e,token:t,password:r})).then(function({data:e}){if(!e.tokens)throw new Error("There was a problem resetting your password. Please try again.");Q("setCookiesAndTokens")(e.tokens),Q("redirectToPath")(Q("getQueryAttr")("redirect")||e.redirectTo||"/")})}catch(e){return Promise.reject(e)}},c=function(e){try{return Promise.resolve(o(function(){return Promise.resolve(Q("axios").post(Q("apiUrl")+"auth/reset/link",{email:e,tenantId:Q("store").tenantId})).then(function({data:e}){return e})},function(){throw new Error("Problem sending link")}))}catch(e){return Promise.reject(e)}},u=function(e){try{return Promise.resolve(o(function(){return Promise.resolve(Q("axios").post(Q("apiUrl")+"auth/link",{email:e,tenantId:Q("store").tenantId})).then(function({data:e}){return e})},function(){throw new Error("Problem sending link")}))}catch(e){return Promise.reject(e)}},d=function(e,t){try{return e||(e=Q("getQueryAttr")("token")),t||(t=Q("getQueryAttr")("uuid")),e&&t?Promise.resolve(Q("axios").put(Q("apiUrl")+"auth/link",{token:e,uuid:t,tenantId:Q("store").tenantId})).then(function({data:e}){if(!e.tokens)throw new Error("Problem logging in.");Q("setCookiesAndTokens")(e.tokens),Q("redirectToPath")(Q("getQueryAttr")("redirect")||e.redirectTo||"/")}):Promise.resolve()}catch(e){return Promise.reject(e)}},l=function({email:e,username:t,emailOrUsername:r,password:n}){try{return Promise.resolve(Q("axios").post(Q("apiUrl")+"auth/basic",{tenantId:Q("store").tenantId,emailOrUsername:e||t||r,password:n})).then(function({data:e}){if(!e.tokens)throw new Error("Please try again.");Q("setCookiesAndTokens")(e.tokens),Q("redirectToPath")(Q("getQueryAttr")("redirect")||e.redirectTo||"/")})}catch(e){return Promise.reject(e)}},h=function({method:e,email:t,username:r,emailOrUsername:n,password:o,token:s,uuid:i}){try{if(!e)throw new Error('Userfront.login called without "method" property');switch(e){case"azure":case"facebook":case"github":case"google":case"linkedin":return Promise.resolve(Q("loginWithSSO")(e));case"password":return Promise.resolve(Q("loginWithPassword")({email:t,username:r,emailOrUsername:n,password:o}));case"link":return Promise.resolve(Q("loginWithLink")(s,i));default:throw new Error('Userfront.login called with invalid "method" property')}}catch(e){return Promise.reject(e)}},_=function({username:e,name:t,email:r,password:n}){try{return Promise.resolve(Q("axios").post(Q("apiUrl")+"auth/create",{tenantId:Q("store").tenantId,username:e,name:t,email:r,password:n})).then(function({data:e}){if(!e.tokens)throw new Error("Please try again.");Q("setCookiesAndTokens")(e.tokens),Q("redirectToPath")(Q("getQueryAttr")("redirect")||e.redirectTo||"/")})}catch(e){return Promise.reject(e)}},f=function({method:e,username:t,name:r,email:n,password:o}){try{if(!e)throw new Error('Userfront.signup called without "method" property');switch(e){case"azure":case"facebook":case"github":case"google":case"linkedin":return Promise.resolve(Q("signupWithSSO")(e));case"password":return Promise.resolve(Q("signupWithPassword")({username:t,name:r,email:n,password:o}));default:throw new Error('Userfront.signup called with invalid "method" property')}}catch(e){return Promise.reject(e)}},m=function(){try{const e=o(function(){return Promise.resolve(Q("axios").get(`${Q("apiUrl")}tenants/${Q("store").tenantId}/mode`)).then(function({data:e}){Q("store").mode=e.mode||"test"})},function(){Q("store").mode="test"});return Promise.resolve(e&&e.then?e.then(function(){}):void 0)}catch(e){return Promise.reject(e)}},{apiUrl:k,privateIPRegex:w}=Q("constants"),p=e=>{try{const t=e||window.location.hostname;return!(!t.match(/localhost/g)&&!t.match(Q("privateIPRegex")))}catch(e){return!0}},g={mode:Q("isTestHostname")()?"test":"live"};function v(e){if(!e)return console.warn("Userfront initialized without tenant ID");Q("store").tenantId=e,Q("store").accessTokenName="access."+e,Q("store").idTokenName="id."+e,Q("store").refreshTokenName="refresh."+e,Q("setTokensFromCookies")()}function P(){return Q("store").accessToken=Q("Cookies").get(Q("store").accessTokenName),Q("store").accessToken}function T(){return Q("store").idToken=Q("Cookies").get(Q("store").idTokenName),Q("store").idToken}function E(e){if(window.location.href&&!(window.location.href.indexOf(e+"=")<0))return decodeURIComponent(window.location.href.split(e+"=")[1].split("&")[0])}function y(e){if(!e)throw new Error("Missing provider");if(!Q("store").tenantId)throw new Error("Missing tenant ID");return`https://api.userfront.com/v0/auth/${e}/login?tenant_id=${Q("store").tenantId}&origin=${window.location.origin}&pathname=${window.location.pathname}`}function I(e){if(!e)throw new Error("Missing provider");const t=Q("getProviderLink")(e);window.location.assign(t)}function R(e){if(!e)throw new Error("Missing provider");const t=Q("getProviderLink")(e);window.location.assign(t)}function L(e){if(!e)return;const t=document.createElement("a");t.href=e,t.pathname!==window.location.pathname&&(window.location.href=`${t.pathname}${t.hash}${t.search}`)}function C(e,t,r){const n=`${r}.${Q("store").tenantId}`;t=t||{secure:"live"===Q("store").mode,sameSite:"Lax"},"refresh"===r&&(t.sameSite="Strict"),Q("Cookies").set(n,e,t)}function O(e){Q("Cookies").remove(e),Q("Cookies").remove(e,{secure:!0,sameSite:"Lax"}),Q("Cookies").remove(e,{secure:!0,sameSite:"None"}),Q("Cookies").remove(e,{secure:!1,sameSite:"Lax"}),Q("Cookies").remove(e,{secure:!1,sameSite:"None"})}function A(){Q("removeCookie")(Q("store").accessTokenName),Q("removeCookie")(Q("store").idTokenName),Q("removeCookie")(Q("store").refreshTokenName),Q("store").accessToken=void 0,Q("store").idToken=void 0,Q("store").refreshToken=void 0}function b(){Q("store").accessToken=Q("Cookies").get(Q("store").accessTokenName),Q("store").idToken=Q("Cookies").get(Q("store").idTokenName),Q("store").refreshToken=Q("Cookies").get(Q("store").refreshTokenName)}function U(e){Q("setCookie")(e.access.value,e.access.cookieOptions,"access"),Q("setCookie")(e.id.value,e.id.cookieOptions,"id"),Q("setCookie")(e.refresh.value,e.refresh.cookieOptions,"refresh"),Q("setTokensFromCookies")()}let j=!1;function N(){if(!Q("isRegistered")){!function(e,t){let r=G();void 0===r.isRegistered?j=!0:r.isRegistered=!0}();try{history.pushState=(e=history.pushState,function(){var t=e.apply(this,arguments);return window.dispatchEvent(new Event("pushstate")),window.dispatchEvent(new Event("urlchanged")),t}),history.replaceState=(e=>function(){var t=e.apply(this,arguments);return window.dispatchEvent(new Event("replacestate")),window.dispatchEvent(new Event("urlchanged")),t})(history.replaceState),window.addEventListener("popstate",()=>{window.dispatchEvent(new Event("urlchanged"))})}catch(e){}var e}}let x={accessToken:Q("accessToken"),getQueryAttr:Q("getQueryAttr"),idToken:Q("idToken"),init:Q("init"),isTestHostname:Q("isTestHostname"),login:Q("login"),logout:Q("logout"),redirectIfLoggedIn:Q("redirectIfLoggedIn"),registerUrlChangedEventListener:Q("registerUrlChangedEventListener"),resetPassword:Q("resetPassword"),sendLoginLink:Q("sendLoginLink"),sendResetLink:Q("sendResetLink"),setMode:Q("setMode"),setCookie:Q("setCookie"),signup:Q("signup"),store:Q("store")};function $(){try{if(global)return global}catch(e){try{if(window)return window}catch(e){return this}}}var S=null;function D(){if(null===S){let e=$();e.__$$GLOBAL_REWIRE_NEXT_MODULE_ID__||(e.__$$GLOBAL_REWIRE_NEXT_MODULE_ID__=0),S=__$$GLOBAL_REWIRE_NEXT_MODULE_ID__++}return S}function W(){let e=$();return e.__$$GLOBAL_REWIRE_REGISTRY__||(e.__$$GLOBAL_REWIRE_REGISTRY__=Object.create(null)),e.__$$GLOBAL_REWIRE_REGISTRY__}function G(){let e=D(),t=W(),r=t[e];return r||(t[e]=Object.create(null),r=t[e]),r}!function(){let e=$();e.__rewire_reset_all__||(e.__rewire_reset_all__=function(){e.__$$GLOBAL_REWIRE_REGISTRY__=Object.create(null)})}();let M={};function Q(e){let o=G();if(void 0===o[e])return function(e){switch(e){case"constants":return n;case"privateIPRegex":return w;case"isTestHostname":return p;case"store":return g;case"setTokensFromCookies":return b;case"Cookies":return r;case"axios":return t;case"apiUrl":return k;case"signupWithSSO":return I;case"signupWithPassword":return _;case"getProviderLink":return y;case"setCookiesAndTokens":return U;case"redirectToPath":return L;case"getQueryAttr":return E;case"loginWithSSO":return R;case"loginWithPassword":return l;case"loginWithLink":return d;case"removeAllCookies":return A;case"removeCookie":return O;case"setCookie":return C;case"isRegistered":return j;case"accessToken":return P;case"idToken":return T;case"init":return v;case"login":return h;case"logout":return s;case"redirectIfLoggedIn":return i;case"registerUrlChangedEventListener":return N;case"resetPassword":return a;case"sendLoginLink":return u;case"sendResetLink":return c;case"setMode":return m;case"signup":return f}}(e);var x=o[e];return"__INTENTIONAL_UNDEFINED__"===x?void 0:x}function B(e,t){let r=G();return"object"==typeof e?(Object.keys(e).forEach(function(t){r[t]=e[t]}),function(){Object.keys(e).forEach(function(t){z(e)})}):(r[e]=void 0===t?"__INTENTIONAL_UNDEFINED__":t,function(){z(e)})}function z(e){let t=G();delete t[e],0==Object.keys(t).length&&delete W()[D]}function F(e){let t=G();var r=Object.keys(e),n={};function o(){r.forEach(function(e){t[e]=n[e]})}return function(s){r.forEach(function(r){n[r]=t[r],t[r]=e[r]});let i=s();return i&&"function"==typeof i.then?i.then(o).catch(o):o(),i}}!function(){function e(e,t){Object.defineProperty(M,e,{value:t,enumerable:!1,configurable:!0})}e("__get__",Q),e("__GetDependency__",Q),e("__Rewire__",B),e("__set__",B),e("__reset__",z),e("__ResetDependency__",z),e("__with__",F)}();let H=typeof x;function Y(e,t){Object.defineProperty(x,e,{value:t,enumerable:!1,configurable:!0})}"object"!==H&&"function"!==H||!Object.isExtensible(x)||(Y("__get__",Q),Y("__GetDependency__",Q),Y("__Rewire__",B),Y("__set__",B),Y("__reset__",z),Y("__ResetDependency__",z),Y("__with__",F),Y("__RewireAPI__",M)),e.__GetDependency__=Q,e.__ResetDependency__=z,e.__RewireAPI__=M,e.__Rewire__=B,e.__get__=Q,e.__set__=B,e.default=x});
//# sourceMappingURL=userfront-core.umd.js.map
