function e(e){return e&&"object"==typeof e&&"default"in e?e.default:e}var t=e(require("js-cookie")),n=e(require("axios")),r=e(require("jsonwebtoken"));const o="https://api.userfront.com/v0/",i=/((^127\.)|(^10\.)|(^172\.1[6-9]\.)|(^172\.2[0-9]\.)|(^172\.3[0-1]\.)|(^192\.168\.))\d{1,3}\.\d{1,3}/g;function s(e){try{const t=e||window.location.hostname;return!(!t.match(/localhost/g)&&!t.match(i))}catch(e){return!0}}const a={user:{},mode:s()?"test":"live"};function c(){["access","id","refresh"].map(e=>{try{const n=t.get(a[e+"TokenName"]);n&&(a[e+"Token"]=n)}catch(t){console.warn(`Problem setting ${e} token.`)}})}function u(e,n,r){const o=`${r}.${a.tenantId}`;n=n||{secure:"live"===a.mode,sameSite:"Lax"},"refresh"===r&&(n.sameSite="Strict"),t.set(o,e,n)}function d(e){t.remove(e),t.remove(e,{secure:!0,sameSite:"Lax"}),t.remove(e,{secure:!0,sameSite:"None"}),t.remove(e,{secure:!1,sameSite:"Lax"}),t.remove(e,{secure:!1,sameSite:"None"})}function h(){d(a.accessTokenName),d(a.idTokenName),d(a.refreshTokenName),a.accessToken=void 0,a.idToken=void 0,a.refreshToken=void 0}function l(e){if(window.location.href&&!(window.location.href.indexOf(e+"=")<0))return decodeURIComponent(window.location.href.split(e+"=")[1].split("&")[0])}function m(e){try{document}catch(e){return}if(!e)return;const t=document.createElement("a");t.href=e,t.pathname!==window.location.pathname&&window.location.assign(`${t.pathname}${t.hash}${t.search}`)}function f(e,t){try{var n=e()}catch(e){return t(e)}return n&&n.then?n.then(void 0,t):n}function w(e){if(!e)throw new Error("Missing provider");if(!a.tenantId)throw new Error("Missing tenant ID");let t=`https://api.userfront.com/v0/auth/${e}/login?tenant_id=${a.tenantId}&origin=${window.location.origin}`;const n=l("redirect");return n&&(t+="&redirect="+encodeURIComponent(n)),t}const p="https://auth.userfront.net";let k;function v(){return k}function g(e){if(e&&e.origin===p&&e.data&&e.data.type){if(200!==e.data.status&&"logout"!==e.data.type)return console.warn(`Problem with ${e.data.type} request.`);switch(e.data.type){case"exchange":console.log("exchange");break;case"refresh":u((t=e.data.body.tokens).access.value,t.access.cookieOptions,"access"),u(t.id.value,t.id.cookieOptions,"id"),u(t.refresh.value,t.refresh.cookieOptions,"refresh"),c();break;case"logout":console.log("logout");break;default:return}var t}}const y=function(){try{const e=v();return e?(e.contentWindow.postMessage({type:"refresh"},"*"),Promise.resolve()):Promise.resolve()}catch(e){return Promise.reject(e)}};function P(){if(!a.idToken)return console.warn("Cannot define user: missing ID token");a.user=a.user||{};const e=r.decode(a.idToken),t=["email","username","name","image","data","confirmedAt","createdAt","updatedAt","mode","userId","userUuid","tenantId","isConfirmed"];for(const n of t){if("update"===n)return;a.user[n]=e[n]}}const T=a.user;T.update=function(e){try{return!e||Object.keys(e).length<1?Promise.resolve(console.warn("Missing user properties to update")):Promise.resolve(n.put(o+"self",e,{headers:{authorization:"Bearer "+a.accessToken}})).then(function(){return Promise.resolve(y()).then(function(){return P(),a.user})})}catch(e){return Promise.reject(e)}};let E=[],I=!1;module.exports={addInitCallback:function(e){e&&"function"==typeof e&&E.push(e)},init:function(e){if(!e)return console.warn("Userfront initialized without tenant ID");a.tenantId=e,a.accessTokenName="access."+e,a.idTokenName="id."+e,a.refreshTokenName="refresh."+e,function(){try{if(k)return;k=document.createElement("iframe"),k.src=p,k.id="uf-auth-frame",k.style.width="0px",k.style.height="0px",k.style.display="none",document.body.appendChild(k),function(){try{window.addEventListener("message",g)}catch(e){}}()}catch(e){}}(),c(),a.idToken&&P();try{E.length>0&&E.forEach(t=>{t&&"function"==typeof t&&t({tenantId:e})}),E=[]}catch(e){}},registerUrlChangedEventListener:function(){if(!I){I=!0;try{history.pushState=(e=history.pushState,function(){var t=e.apply(this,arguments);return window.dispatchEvent(new Event("pushstate")),window.dispatchEvent(new Event("urlchanged")),t}),history.replaceState=(e=>function(){var t=e.apply(this,arguments);return window.dispatchEvent(new Event("replacestate")),window.dispatchEvent(new Event("urlchanged")),t})(history.replaceState),window.addEventListener("popstate",()=>{window.dispatchEvent(new Event("urlchanged"))})}catch(e){}var e}},logout:function(){try{if(!a.accessToken)return Promise.resolve(h());const e=function(e,t){try{var r=Promise.resolve(n.get(o+"auth/logout",{headers:{authorization:"Bearer "+a.accessToken}})).then(function({data:e}){h(),m(e.redirectTo)})}catch(e){return t()}return r&&r.then?r.then(void 0,t):r}(0,function(){h()});return Promise.resolve(e&&e.then?e.then(function(){}):void 0)}catch(e){return Promise.reject(e)}},setMode:function(){try{const e=function(e,t){try{var r=Promise.resolve(n.get(`${o}tenants/${a.tenantId}/mode`)).then(function({data:e}){a.mode=e.mode||"test"})}catch(e){return t()}return r&&r.then?r.then(void 0,t):r}(0,function(){a.mode="test"});return Promise.resolve(e&&e.then?e.then(function(){}):void 0)}catch(e){return Promise.reject(e)}},login:function({method:e,email:t,username:n,emailOrUsername:r,password:o,token:i,uuid:s}){try{if(!e)throw new Error('Userfront.login called without "method" property');switch(e){case"azure":case"facebook":case"github":case"google":case"linkedin":return Promise.resolve(function(e){if(!e)throw new Error("Missing provider");const t=w(e);window.location.assign(t)}(e));case"password":return function({email:e,username:t,emailOrUsername:n,password:r}){try{return Promise.resolve(axios.post(apiUrl+"auth/basic",{tenantId:a.tenantId,emailOrUsername:e||t||n,password:r})).then(function({data:e}){if(!e.tokens)throw new Error("Please try again.");setCookiesAndTokens(e.tokens),redirectToPath(l("redirect")||e.redirectTo||"/")})}catch(e){return Promise.reject(e)}}({email:t,username:n,emailOrUsername:r,password:o});case"link":return function(e,t){try{return e||(e=l("token")),t||(t=l("uuid")),e&&t?Promise.resolve(axios.put(apiUrl+"auth/link",{token:e,uuid:t,tenantId:a.tenantId})).then(function({data:e}){if(!e.tokens)throw new Error("Problem logging in.");setCookiesAndTokens(e.tokens),redirectToPath(l("redirect")||e.redirectTo||"/")}):Promise.resolve()}catch(e){return Promise.reject(e)}}(i,s);default:throw new Error('Userfront.login called with invalid "method" property')}}catch(e){return Promise.reject(e)}},resetPassword:function({uuid:e,token:t,password:n}){try{if(t||(t=l("token")),e||(e=l("uuid")),!t||!e)throw new Error("Missing token or uuid");return Promise.resolve(axios.put(apiUrl+"auth/reset",{tenantId:a.tenantId,uuid:e,token:t,password:n})).then(function({data:e}){if(!e.tokens)throw new Error("There was a problem resetting your password. Please try again.");setCookiesAndTokens(e.tokens),redirectToPath(l("redirect")||e.redirectTo||"/")})}catch(e){return Promise.reject(e)}},sendLoginLink:function(e){try{return Promise.resolve(f(function(){return Promise.resolve(axios.post(apiUrl+"auth/link",{email:e,tenantId:a.tenantId})).then(function({data:e}){return e})},function(){throw new Error("Problem sending link")}))}catch(e){return Promise.reject(e)}},sendResetLink:function(e){try{return Promise.resolve(f(function(){return Promise.resolve(axios.post(apiUrl+"auth/reset/link",{email:e,tenantId:a.tenantId})).then(function({data:e}){return e})},function(){throw new Error("Problem sending link")}))}catch(e){return Promise.reject(e)}},signup:function({method:e,username:t,name:n,email:r,password:o}){try{if(!e)throw new Error('Userfront.signup called without "method" property');switch(e){case"azure":case"facebook":case"github":case"google":case"linkedin":return Promise.resolve(function(e){if(!e)throw new Error("Missing provider");const t=w(e);window.location.assign(t)}(e));case"password":return function({username:e,name:t,email:n,password:r}){try{return Promise.resolve(axios.post(apiUrl+"auth/create",{tenantId:a.tenantId,username:e,name:t,email:n,password:r})).then(function({data:e}){if(!e.tokens)throw new Error("Please try again.");setCookiesAndTokens(e.tokens),redirectToPath(l("redirect")||e.redirectTo||"/")})}catch(e){return Promise.reject(e)}}({username:t,name:n,email:r,password:o});default:throw new Error('Userfront.signup called with invalid "method" property')}}catch(e){return Promise.reject(e)}},store:a,accessToken:function(){return a.accessToken=t.get(a.accessTokenName),a.accessToken},idToken:function(){return a.idToken=t.get(a.idTokenName),a.idToken},redirectIfLoggedIn:function(){try{if(!a.accessToken)return Promise.resolve(h());if(l("redirect"))return Promise.resolve(m(l("redirect")));const e=function(e,t){try{var r=Promise.resolve(n.get(o+"self",{headers:{authorization:"Bearer "+a.accessToken}})).then(function({data:e}){e.tenant&&e.tenant.loginRedirectPath&&m(e.tenant.loginRedirectPath)})}catch(e){return t()}return r&&r.then?r.then(void 0,t):r}(0,function(){h()});return Promise.resolve(e&&e.then?e.then(function(){}):void 0)}catch(e){return Promise.reject(e)}},user:T,isTestHostname:s};
//# sourceMappingURL=userfront-core.js.map
