function e(e){return e&&"object"==typeof e&&"default"in e?e.default:e}var t=e(require("js-cookie")),n=e(require("axios"));const r="https://api.userfront.com/v0/",o=/((^127\.)|(^10\.)|(^172\.1[6-9]\.)|(^172\.2[0-9]\.)|(^172\.3[0-1]\.)|(^192\.168\.))\d{1,3}\.\d{1,3}/g;function i(e){try{const t=e||window.location.hostname;return!(!t.match(/localhost/g)&&!t.match(o))}catch(e){return!0}}const s={mode:i()?"test":"live"};function a(){return s.accessToken=t.get(s.accessTokenName),s.accessToken}function c(){return s.idToken=t.get(s.idTokenName),s.idToken}function d(){s.accessToken=t.get(s.accessTokenName),s.idToken=t.get(s.idTokenName),s.refreshToken=t.get(s.refreshTokenName)}function u(e,n,r){const o=`${r}.${s.tenantId}`;n=n||{secure:"live"===s.mode,sameSite:"Lax"},"refresh"===r&&(n.sameSite="Strict"),t.set(o,e,n)}function h(e){t.remove(e),t.remove(e,{secure:!0,sameSite:"Lax"}),t.remove(e,{secure:!0,sameSite:"None"}),t.remove(e,{secure:!1,sameSite:"Lax"}),t.remove(e,{secure:!1,sameSite:"None"})}function l(){h(s.accessTokenName),h(s.idTokenName),h(s.refreshTokenName),s.accessToken=void 0,s.idToken=void 0,s.refreshToken=void 0}const f=function(){try{if(!s.accessToken)return Promise.resolve(l());if(m("redirect"))return Promise.resolve(p(m("redirect")));const e=function(e,t){try{var o=Promise.resolve(n.get(r+"self",{headers:{authorization:"Bearer "+s.accessToken}})).then(function({data:e}){e.tenant&&e.tenant.loginRedirectPath&&p(e.tenant.loginRedirectPath)})}catch(e){return t()}return o&&o.then?o.then(void 0,t):o}(0,function(){l()});return Promise.resolve(e&&e.then?e.then(function(){}):void 0)}catch(e){return Promise.reject(e)}};function m(e){if(window.location.href&&!(window.location.href.indexOf(e+"=")<0))return decodeURIComponent(window.location.href.split(e+"=")[1].split("&")[0])}function p(e){try{document}catch(e){return}if(!e)return;const t=document.createElement("a");t.href=e,t.pathname!==window.location.pathname&&window.location.assign(`${t.pathname}${t.hash}${t.search}`)}function w(e,t){try{var n=e()}catch(e){return t(e)}return n&&n.then?n.then(void 0,t):n}const k=function({uuid:e,token:t,password:n}){try{if(t||(t=m("token")),e||(e=m("uuid")),!t||!e)throw new Error("Missing token or uuid");return Promise.resolve(axios.put(apiUrl+"auth/reset",{tenantId:s.tenantId,uuid:e,token:t,password:n})).then(function({data:e}){if(!e.tokens)throw new Error("There was a problem resetting your password. Please try again.");setCookiesAndTokens(e.tokens),redirectToPath(m("redirect")||e.redirectTo||"/")})}catch(e){return Promise.reject(e)}},g=function(e){try{return Promise.resolve(w(function(){return Promise.resolve(axios.post(apiUrl+"auth/reset/link",{email:e,tenantId:s.tenantId})).then(function({data:e}){return e})},function(){throw new Error("Problem sending link")}))}catch(e){return Promise.reject(e)}},v=function(e){try{return Promise.resolve(w(function(){return Promise.resolve(axios.post(apiUrl+"auth/link",{email:e,tenantId:s.tenantId})).then(function({data:e}){return e})},function(){throw new Error("Problem sending link")}))}catch(e){return Promise.reject(e)}},y=function({method:e,email:t,username:n,emailOrUsername:r,password:o,token:i,uuid:a}){try{if(!e)throw new Error('Userfront.login called without "method" property');switch(e){case"azure":case"facebook":case"github":case"google":case"linkedin":return Promise.resolve(function(e){if(!e)throw new Error("Missing provider");const t=T(e);window.location.assign(t)}(e));case"password":return function({email:e,username:t,emailOrUsername:n,password:r}){try{return Promise.resolve(axios.post(apiUrl+"auth/basic",{tenantId:s.tenantId,emailOrUsername:e||t||n,password:r})).then(function({data:e}){if(!e.tokens)throw new Error("Please try again.");setCookiesAndTokens(e.tokens),redirectToPath(m("redirect")||e.redirectTo||"/")})}catch(e){return Promise.reject(e)}}({email:t,username:n,emailOrUsername:r,password:o});case"link":return function(e,t){try{return e||(e=m("token")),t||(t=m("uuid")),e&&t?Promise.resolve(axios.put(apiUrl+"auth/link",{token:e,uuid:t,tenantId:s.tenantId})).then(function({data:e}){if(!e.tokens)throw new Error("Problem logging in.");setCookiesAndTokens(e.tokens),redirectToPath(m("redirect")||e.redirectTo||"/")}):Promise.resolve()}catch(e){return Promise.reject(e)}}(i,a);default:throw new Error('Userfront.login called with invalid "method" property')}}catch(e){return Promise.reject(e)}},P=function({method:e,username:t,name:n,email:r,password:o}){try{if(!e)throw new Error('Userfront.signup called without "method" property');switch(e){case"azure":case"facebook":case"github":case"google":case"linkedin":return Promise.resolve(function(e){if(!e)throw new Error("Missing provider");const t=T(e);window.location.assign(t)}(e));case"password":return function({username:e,name:t,email:n,password:r}){try{return Promise.resolve(axios.post(apiUrl+"auth/create",{tenantId:s.tenantId,username:e,name:t,email:n,password:r})).then(function({data:e}){if(!e.tokens)throw new Error("Please try again.");setCookiesAndTokens(e.tokens),redirectToPath(m("redirect")||e.redirectTo||"/")})}catch(e){return Promise.reject(e)}}({username:t,name:n,email:r,password:o});default:throw new Error('Userfront.signup called with invalid "method" property')}}catch(e){return Promise.reject(e)}};function T(e){if(!e)throw new Error("Missing provider");if(!s.tenantId)throw new Error("Missing tenant ID");let t=`https://api.userfront.com/v0/auth/${e}/login?tenant_id=${s.tenantId}&origin=${window.location.origin}`;const n=m("redirect");return n&&(t+="&redirect="+encodeURIComponent(n)),t}const E=function(){try{if(!s.accessToken)return Promise.resolve(l());const e=function(e,t){try{var o=Promise.resolve(n.get(r+"auth/logout",{headers:{authorization:"Bearer "+s.accessToken}})).then(function({data:e}){l(),p(e.redirectTo)})}catch(e){return t()}return o&&o.then?o.then(void 0,t):o}(0,function(){l()});return Promise.resolve(e&&e.then?e.then(function(){}):void 0)}catch(e){return Promise.reject(e)}},x=function(){try{const e=function(e,t){try{var o=Promise.resolve(n.get(`${r}tenants/${s.tenantId}/mode`)).then(function({data:e}){s.mode=e.mode||"test"})}catch(e){return t()}return o&&o.then?o.then(void 0,t):o}(0,function(){s.mode="test"});return Promise.resolve(e&&e.then?e.then(function(){}):void 0)}catch(e){return Promise.reject(e)}},I="https://auth.userfront.net";let U;function b(e){var t;if(e&&e.origin===I&&e.data&&e.data.type)switch(e.data.type){case"exchange":console.log("exchange");break;case"refresh":u((t=e.data.body.tokens).access.value,t.access.cookieOptions,"access"),u(t.id.value,t.id.cookieOptions,"id"),u(t.refresh.value,t.refresh.cookieOptions,"refresh"),d();break;case"logout":console.log("logout");break;default:return}}let L=[];function j(e){if(!e)return console.warn("Userfront initialized without tenant ID");s.tenantId=e,s.accessTokenName="access."+e,s.idTokenName="id."+e,s.refreshTokenName="refresh."+e,function(){try{if(U)return;U=document.createElement("iframe"),U.src=I,U.id="uf-auth-frame",U.style.width="0px",U.style.height="0px",U.style.display="none",document.body.appendChild(U),function(){try{window.addEventListener("message",b)}catch(e){}}()}catch(e){}}(),d();try{L.length>0&&L.forEach(t=>{t&&"function"==typeof t&&t({tenantId:e})}),L=[]}catch(e){}}function N(e){e&&"function"==typeof e&&L.push(e)}let S=!1;var C={addInitCallback:N,init:j,registerUrlChangedEventListener:function(){if(!S){S=!0;try{history.pushState=(e=history.pushState,function(){var t=e.apply(this,arguments);return window.dispatchEvent(new Event("pushstate")),window.dispatchEvent(new Event("urlchanged")),t}),history.replaceState=(e=>function(){var t=e.apply(this,arguments);return window.dispatchEvent(new Event("replacestate")),window.dispatchEvent(new Event("urlchanged")),t})(history.replaceState),window.addEventListener("popstate",()=>{window.dispatchEvent(new Event("urlchanged"))})}catch(e){}var e}},logout:E,isTestHostname:i,setMode:x,login:y,resetPassword:k,sendLoginLink:v,sendResetLink:g,signup:P,store:s,accessToken:a,idToken:c,redirectIfLoggedIn:f};exports.accessToken=a,exports.addInitCallback=N,exports.default=C,exports.idToken=c,exports.init=j,exports.isTestHostname=i,exports.login=y,exports.logout=E,exports.redirectIfLoggedIn=f,exports.resetPassword=k,exports.sendLoginLink=v,exports.sendResetLink=g,exports.setMode=x,exports.signup=P,exports.store=s;
//# sourceMappingURL=userfront-core.js.map
