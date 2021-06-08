import e from"js-cookie";import t from"axios";import n from"jsonwebtoken";const o="https://api.userfront.com/v0/",r=/((^127\.)|(^10\.)|(^172\.1[6-9]\.)|(^172\.2[0-9]\.)|(^172\.3[0-1]\.)|(^192\.168\.))\d{1,3}\.\d{1,3}/g;function a(e){try{const t=e||window.location.hostname;return!(!t.match(/localhost/g)&&!t.match(r))}catch(e){return!0}}const i={user:{},mode:a()?"test":"live"};function s(){["access","id","refresh"].map(t=>{try{const n=e.get(i[t+"TokenName"]);n&&(i[t+"Token"]=n)}catch(e){console.warn(`Problem setting ${t} token.`)}})}function c(t,n,o){const r=`${o}.${i.tenantId}`;n=n||{secure:"live"===i.mode,sameSite:"Lax"},"refresh"===o&&(n.sameSite="Strict"),e.set(r,t,n)}function d(t){e.remove(t),e.remove(t,{secure:!0,sameSite:"Lax"}),e.remove(t,{secure:!0,sameSite:"None"}),e.remove(t,{secure:!1,sameSite:"Lax"}),e.remove(t,{secure:!1,sameSite:"None"})}function u(){d(i.accessTokenName),d(i.idTokenName),d(i.refreshTokenName),i.accessToken=void 0,i.idToken=void 0,i.refreshToken=void 0}function h(e){if(window.location.href&&!(window.location.href.indexOf(e+"=")<0))return decodeURIComponent(window.location.href.split(e+"=")[1].split("&")[0])}function l(e){try{document}catch(e){return}if(!e)return;const t=document.createElement("a");t.href=e,t.pathname!==window.location.pathname&&window.location.assign(`${t.pathname}${t.hash}${t.search}`)}function w(e){if(!e)throw new Error("Missing provider");if(!i.tenantId)throw new Error("Missing tenant ID");let t=`https://api.userfront.com/v0/auth/${e}/login?tenant_id=${i.tenantId}&origin=${window.location.origin}`;const n=h("redirect");return n&&(t+="&redirect="+encodeURIComponent(n)),t}const f="https://auth.userfront.net";let m;function p(){return m}function k(e){if(e&&e.origin===f&&e.data&&e.data.type){if(200!==e.data.status&&"logout"!==e.data.type)return console.warn(`Problem with ${e.data.type} request.`);switch(e.data.type){case"exchange":console.log("exchange");break;case"refresh":c((t=e.data.body.tokens).access.value,t.access.cookieOptions,"access"),c(t.id.value,t.id.cookieOptions,"id"),c(t.refresh.value,t.refresh.cookieOptions,"refresh"),s();break;case"logout":console.log("logout");break;default:return}var t}}function g(){if(!i.idToken)return console.warn("Cannot define user: missing ID token");i.user=i.user||{};const e=n.decode(i.idToken),t=["email","username","name","image","data","confirmedAt","createdAt","updatedAt","mode","userId","userUuid","tenantId","isConfirmed"];for(const n of t){if("update"===n)return;i.user[n]=e[n]}}const y=i.user;y.update=async function(e){return!e||Object.keys(e).length<1?console.warn("Missing user properties to update"):(await t.put(o+"self",e,{headers:{authorization:"Bearer "+i.accessToken}}),await async function(){const e=p();e&&e.contentWindow.postMessage({type:"refresh"},"*")}(),g(),i.user)};let T=[],v=!1;var E={addInitCallback:function(e){e&&"function"==typeof e&&T.push(e)},init:function(e){if(!e)return console.warn("Userfront initialized without tenant ID");i.tenantId=e,i.accessTokenName="access."+e,i.idTokenName="id."+e,i.refreshTokenName="refresh."+e,function(){try{if(m)return;m=document.createElement("iframe"),m.src=f,m.id="uf-auth-frame",m.style.width="0px",m.style.height="0px",m.style.display="none",document.body.appendChild(m),function(){try{window.addEventListener("message",k)}catch(e){}}()}catch(e){}}(),s(),i.idToken&&g();try{T.length>0&&T.forEach(t=>{t&&"function"==typeof t&&t({tenantId:e})}),T=[]}catch(e){}},registerUrlChangedEventListener:function(){if(!v){v=!0;try{history.pushState=(e=history.pushState,function(){var t=e.apply(this,arguments);return window.dispatchEvent(new Event("pushstate")),window.dispatchEvent(new Event("urlchanged")),t}),history.replaceState=(e=>function(){var t=e.apply(this,arguments);return window.dispatchEvent(new Event("replacestate")),window.dispatchEvent(new Event("urlchanged")),t})(history.replaceState),window.addEventListener("popstate",()=>{window.dispatchEvent(new Event("urlchanged"))})}catch(e){}var e}},logout:async function(){if(!i.accessToken)return u();try{const{data:e}=await t.get(o+"auth/logout",{headers:{authorization:"Bearer "+i.accessToken}});u(),l(e.redirectTo)}catch(e){u()}},setMode:async function(){try{const{data:e}=await t.get(`${o}tenants/${i.tenantId}/mode`);i.mode=e.mode||"test"}catch(e){i.mode="test"}},login:async function({method:e,email:t,username:n,emailOrUsername:o,password:r,token:a,uuid:s}){if(!e)throw new Error('Userfront.login called without "method" property');switch(e){case"azure":case"facebook":case"github":case"google":case"linkedin":return function(e){if(!e)throw new Error("Missing provider");const t=w(e);window.location.assign(t)}(e);case"password":return async function({email:e,username:t,emailOrUsername:n,password:o}){const{data:r}=await axios.post(apiUrl+"auth/basic",{tenantId:i.tenantId,emailOrUsername:e||t||n,password:o});if(!r.tokens)throw new Error("Please try again.");setCookiesAndTokens(r.tokens),redirectToPath(h("redirect")||r.redirectTo||"/")}({email:t,username:n,emailOrUsername:o,password:r});case"link":return async function(e,t){if(e||(e=h("token")),t||(t=h("uuid")),!e||!t)return;const{data:n}=await axios.put(apiUrl+"auth/link",{token:e,uuid:t,tenantId:i.tenantId});if(!n.tokens)throw new Error("Problem logging in.");setCookiesAndTokens(n.tokens),redirectToPath(h("redirect")||n.redirectTo||"/")}(a,s);default:throw new Error('Userfront.login called with invalid "method" property')}},resetPassword:async function({uuid:e,token:t,password:n}){if(t||(t=h("token")),e||(e=h("uuid")),!t||!e)throw new Error("Missing token or uuid");const{data:o}=await axios.put(apiUrl+"auth/reset",{tenantId:i.tenantId,uuid:e,token:t,password:n});if(!o.tokens)throw new Error("There was a problem resetting your password. Please try again.");setCookiesAndTokens(o.tokens),redirectToPath(h("redirect")||o.redirectTo||"/")},sendLoginLink:async function(e){try{const{data:t}=await axios.post(apiUrl+"auth/link",{email:e,tenantId:i.tenantId});return t}catch(e){throw new Error("Problem sending link")}},sendResetLink:async function(e){try{const{data:t}=await axios.post(apiUrl+"auth/reset/link",{email:e,tenantId:i.tenantId});return t}catch(e){throw new Error("Problem sending link")}},signup:async function({method:e,username:t,name:n,email:o,password:r}){if(!e)throw new Error('Userfront.signup called without "method" property');switch(e){case"azure":case"facebook":case"github":case"google":case"linkedin":return function(e){if(!e)throw new Error("Missing provider");const t=w(e);window.location.assign(t)}(e);case"password":return async function({username:e,name:t,email:n,password:o}){const{data:r}=await axios.post(apiUrl+"auth/create",{tenantId:i.tenantId,username:e,name:t,email:n,password:o});if(!r.tokens)throw new Error("Please try again.");setCookiesAndTokens(r.tokens),redirectToPath(h("redirect")||r.redirectTo||"/")}({username:t,name:n,email:o,password:r});default:throw new Error('Userfront.signup called with invalid "method" property')}},store:i,accessToken:function(){return i.accessToken=e.get(i.accessTokenName),i.accessToken},idToken:function(){return i.idToken=e.get(i.idTokenName),i.idToken},redirectIfLoggedIn:async function(){if(!i.accessToken)return u();if(h("redirect"))return l(h("redirect"));try{const{data:e}=await t.get(o+"self",{headers:{authorization:"Bearer "+i.accessToken}});e.tenant&&e.tenant.loginRedirectPath&&l(e.tenant.loginRedirectPath)}catch(e){u()}},user:y,isTestHostname:a};export default E;
//# sourceMappingURL=userfront-core.modern.js.map
