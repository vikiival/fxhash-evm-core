let search=new URLSearchParams(window.location.search),alphabet="123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ",b58dec=e=>[...e].reduce((e,t)=>e*alphabet.length+alphabet.indexOf(t)|0,0);var fxhash=search.get("fxhash")||"oo"+Array(49).fill(0).map(e=>alphabet[Math.random()*alphabet.length|0]).join("");let fxhashTrunc=fxhash.slice(2),regex=RegExp(".{"+(fxhash.length/4|0)+"}","g"),hashes=fxhashTrunc.match(regex).map(e=>b58dec(e)),sfc32=(e,t,n,r)=>()=>{n|=0;var a=((e|=0)+(t|=0)|0)+(r|=0)|0;return r=r+1|0,e=t^t>>>9,t=n+(n<<3)|0,n=(n=n<<21|n>>>11)+a|0,(a>>>0)/4294967296};var fxrand=sfc32(...hashes),fxminter=search.get("fxminter")||"tz1"+Array(33).fill(0).map(e=>alphabet[Math.random()*alphabet.length|0]).join("");let fxminterTrunc=fxminter.slice(3);regex=RegExp(".{"+(fxminterTrunc.length/4|0)+"}","g"),hashes=fxminterTrunc.match(regex).map(e=>b58dec(e));var fxrandminter=sfc32(...hashes),isFxpreview="1"===search.get("preview");function fxpreview(){console.log("FXPREVIEW")}const searchParams=search.get("fxparams");let initialInputBytes=searchParams?.replace("0x","");const throttle=(e,t)=>{let n=!1;return function(...r){n||(e.apply(this,r),n=!0,setTimeout(()=>{n=!1},t))}},stringToHex=e=>{let t="";for(let n=0;n<e.length;n++)t+=e.charCodeAt(n).toString(16).padStart(4,"0");return t},completeHexColor=e=>{let t=e.replace("#","");return 6===t.length&&(t=`${t}ff`),3===t.length&&(t=`${t[0]}${t[0]}${t[1]}${t[1]}${t[2]}${t[2]}ff`),t},processors={number:{serialize(e){let t=new DataView(new ArrayBuffer(8));return t.setFloat64(0,e),t.getBigUint64(0).toString(16).padStart(16,"0")},deserialize(e){let t=new DataView(new ArrayBuffer(8));for(let n=0;n<8;n++)t.setUint8(n,parseInt(e.substring(2*n,2*n+2),16));return t.getFloat64(0)},bytesLength:()=>8,constrain(e,t){let n=Number.MIN_SAFE_INTEGER;void 0!==t.options?.min&&(n=Number(t.options.min));let r=Number.MAX_SAFE_INTEGER;void 0!==t.options?.max&&(r=Number(t.options.max)),r=Math.min(r,Number.MAX_SAFE_INTEGER),n=Math.max(n,Number.MIN_SAFE_INTEGER);let a=Math.min(Math.max(e,n),r);if(t?.options?.step){let s=1/t?.options?.step;return Math.round(a*s)/s}return a},random(e){let t=Number.MIN_SAFE_INTEGER;void 0!==e.options?.min&&(t=Number(e.options.min));let n=Number.MAX_SAFE_INTEGER;void 0!==e.options?.max&&(n=Number(e.options.max)),n=Math.min(n,Number.MAX_SAFE_INTEGER),t=Math.max(t,Number.MIN_SAFE_INTEGER);let r=Math.random()*(n-t)+t;if(e?.options?.step){let a=1/e?.options?.step;return Math.round(r*a)/a}return r}},bigint:{serialize(e){let t=new DataView(new ArrayBuffer(8));return t.setBigInt64(0,BigInt(e)),t.getBigUint64(0).toString(16).padStart(16,"0")},deserialize(e){let t=new DataView(new ArrayBuffer(8));for(let n=0;n<8;n++)t.setUint8(n,parseInt(e.substring(2*n,2*n+2),16));return t.getBigInt64(0)},bytesLength:()=>8,random(e){let t=-0x8000000000000000n,n=0x7fffffffffffffffn,r=t,a=n;void 0!==e.options?.min&&(r=BigInt(e.options.min)),void 0!==e.options?.max&&(a=BigInt(e.options.max));let s=a-r,i=s.toString(2).length,o;do o=BigInt("0b"+Array.from(crypto.getRandomValues(new Uint8Array(Math.ceil(i/8)))).map(e=>e.toString(2).padStart(8,"0")).join(""));while(o>s);return o+r}},boolean:{serialize:e=>"boolean"==typeof e&&e||"string"==typeof e&&"true"===e?"01":"00",deserialize:e=>"00"!==e,bytesLength:()=>1,random:()=>.5>Math.random()},color:{serialize:e=>completeHexColor(e),deserialize:e=>e,bytesLength:()=>4,transform(e){let t=parseInt(e.slice(0,2),16),n=parseInt(e.slice(2,4),16),r=parseInt(e.slice(4,6),16),a=parseInt(e.slice(6,8),16);return{hex:{rgb:"#"+e.slice(0,6),rgba:"#"+e},obj:{rgb:{r:t,g:n,b:r},rgba:{r:t,g:n,b:r,a}},arr:{rgb:[t,n,r],rgba:[t,n,r,a]}}},constrain(e,t){let n=e.replace("#","");return n.slice(0,8).padEnd(8,"f")},random:()=>`${[...Array(8)].map(()=>Math.floor(16*Math.random()).toString(16)).join("")}`},string:{serialize(e,t){let n=64;void 0!==t.options?.maxLength&&(n=Number(t.options.maxLength));let r=stringToHex(e.substring(0,n));return r.padEnd(4*n,"0")},deserialize(e){let t=e.match(/.{1,4}/g)||[],n="";for(let r=0;r<t.length;r++){let a=parseInt(t[r],16);if(0===a)break;n+=String.fromCharCode(a)}return n},bytesLength:e=>void 0!==e?.maxLength?2*Number(e.maxLength):128,constrain(e,t){let n=0;void 0!==t.options?.minLength&&(n=t.options.minLength);let r=64;void 0!==t.options?.maxLength&&(r=t.options.maxLength);let a=e.slice(0,r);return a.length<n?a.padEnd(n):a},random(e){let t=0;void 0!==e.options?.minLength&&(t=e.options.minLength);let n=64;void 0!==e.options?.maxLength&&(n=e.options.maxLength);let r=Math.round(Math.random()*(n-t)+t);return[...Array(r)].map(e=>(~~(36*Math.random())).toString(36)).join("")}},select:{serialize:(e,t)=>Math.min(255,t.options?.options?.indexOf(e)||0).toString(16).padStart(2,"0"),deserialize:(e,t)=>t.options.options[parseInt(e,16)]||t.default,bytesLength:()=>1,constrain:(e,t)=>t.options.options.includes(e)?e:t.options.options[0],random(e){let t=Math.round(Math.random()*(e?.options?.options?.length-1)+0);return e?.options?.options[t]}}},getParamValue=(e,t,n)=>void 0!==e?e:void 0!==t.default?t.default:n.random(t),serializeParams=(e,t)=>{let n="";if(!t)return n;for(let r of t){let{id:a,type:s}=r,i=processors[s],o=getParamValue(e[a],r,i),l=i.serialize(o,r);n+=l}return n},deserializeParams=(e,t)=>{let n={};for(let r of t){let a=processors[r.type];if(!e){let s;s=void 0===r.default?a.random(r):r.default,n[r.id]=a.constrain?.(s,r)||s;continue}let i=e.substring(0,2*a.bytesLength(r?.options));e=e.substring(2*a.bytesLength(r?.options));let o=a.deserialize(i,r);n[r.id]=a.constrain?.(o,r)||o}return n},processParam=(e,t,n,r)=>{let a=n.find(t=>t.id===e),s=processors[a.type];return s[r]?.(t,a)||t},processParams=(e,t,n)=>{let r={};for(let a of t){let s=processors[a.type],i=e[a.id];r[a.id]=s[n]?.(i,a)||i}return r};window.$fx={_version:"3.1.0",_processors:processors,_params:void 0,_features:void 0,_paramValues:{},_listeners:{},_receiveUpdateParams:async function(e,t){let n=await this.propagateEvent("params:update",e);n.forEach(([n,r])=>{("boolean"!=typeof n||n)&&(this._updateParams(e),t?.()),r?.(n,e)}),0===n.length&&(this._updateParams(e),t?.())},_updateParams:function(e){let t=processParams({...this._rawValues,...e},this._params,"constrain");Object.keys(t).forEach(e=>{this._rawValues[e]=t[e]}),this._paramValues=processParams(this._rawValues,this._params,"transform"),this._updateInputBytes()},_updateInputBytes:function(){let e=serializeParams(this._rawValues,this._params);this.inputBytes=e},hash:fxhash,rand:fxrand,minter:fxminter,randminter:fxrandminter,context:search.get("fxcontext")||"standalone",preview:fxpreview,isPreview:isFxpreview,params:function(e){this._params=e,this._rawValues=deserializeParams(initialInputBytes,e),this._paramValues=processParams(this._rawValues,e,"transform"),this._updateInputBytes()},features:function(e){this._features=e},getFeature:function(e){return this._features[e]},getFeatures:function(){return this._features},getParam:function(e){return this._paramValues[e]},getParams:function(){return this._paramValues},getRawParam:function(e){return this._rawValues[e]},getRawParams:function(){return this._rawValues},getDefinitions:function(){return this._params},stringifyParams:function(e){return JSON.stringify(e||this._rawValues,(e,t)=>"bigint"==typeof t?t.toString():t,2)},on:function(e,t,n){return this._listeners[e]||(this._listeners[e]=[]),this._listeners[e].push([t,n]),()=>{let n=this._listeners[e].findIndex(([e])=>e===t);n>-1&&this._listeners[e].splice(n,1)}},propagateEvent:async function(e,t){let n=[];if(this._listeners?.[e])for(let[r,a]of this._listeners[e]){let s=r(t);n.push([s instanceof Promise?await s:s,a,])}return n}},window.addEventListener("message",e=>{if("fxhash_getInfo"===e.data&&parent.postMessage({id:"fxhash_getInfo",data:{version:window.$fx._version,hash:window.$fx.hash,features:window.$fx.getFeatures(),params:{definitions:window.$fx.getDefinitions(),values:window.$fx.getRawParams()},minter:window.$fx.minter}},"*"),e.data?.id==="fxhash_params:update"){let{params:t}=e.data.data;t&&window.$fx._receiveUpdateParams(t)}});