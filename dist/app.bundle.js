!function(e){function t(t){for(var a,o,l=t[0],c=t[1],s=t[2],u=0,m=[];u<l.length;u++)o=l[u],Object.prototype.hasOwnProperty.call(i,o)&&i[o]&&m.push(i[o][0]),i[o]=0;for(a in c)Object.prototype.hasOwnProperty.call(c,a)&&(e[a]=c[a]);for(d&&d(t);m.length;)m.shift()();return r.push.apply(r,s||[]),n()}function n(){for(var e,t=0;t<r.length;t++){for(var n=r[t],a=!0,l=1;l<n.length;l++){var c=n[l];0!==i[c]&&(a=!1)}a&&(r.splice(t--,1),e=o(o.s=n[0]))}return e}var a={},i={0:0},r=[];function o(t){if(a[t])return a[t].exports;var n=a[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,o),n.l=!0,n.exports}o.m=e,o.c=a,o.d=function(e,t,n){o.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},o.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(e,t){if(1&t&&(e=o(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(o.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var a in e)o.d(n,a,function(t){return e[t]}.bind(null,a));return n},o.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(t,"a",t),t},o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},o.p="D:\\Refactoring-Discovery\\dist";var l=window.webpackJsonp=window.webpackJsonp||[],c=l.push.bind(l);l.push=t,l=l.slice();for(var s=0;s<l.length;s++)t(l[s]);var d=c;r.push([155,1]),n()}({12:function(e,t,n){e.exports={color:"index__color--2ojbV",highlighted:"index__highlighted--1donK",normal:"index__normal--3xN0k",add:"index__add--3fp2b",removed:"index__removed--18dBy",pre:"index__pre--3eDFa",button:"index__button--2J6G4",content:"index__content--3DNR8",outerPre:"index__outerPre--1Pone",spanWidth:"index__spanWidth--125bf",innerPre:"index__innerPre--1_Bab",line:"index__line--1sUEl",colLeft:"index__colLeft--2F2iS",splitWidth:"index__splitWidth--jvhC7",collRight:"index__collRight--2OaKg",collRightSplit:"index__collRightSplit--2H9r-",colRContent:"index__colRContent--3gXOP",octicon:"index__octicon--2VVw1",arrow:"index__arrow--1FWUj",cRHeight:"index__cRHeight--1pHdx",sPart:"index__sPart--1V1XW",iBlock:"index__iBlock--3k0eW",prBlock:"index__prBlock--N52o_",splitLN:"index__splitLN--2ci2A",splitCon:"index__splitCon--15tpv",filled:"index__filled--23P9T",radioGroup:"index__radioGroup--2E-ih",lBorder:"index__lBorder--2ClWV",rBorder:"index__rBorder--3Sx6H"}},155:function(e,t,n){e.exports=n(319)},319:function(e,t,n){"use strict";n.r(t);var a=n(0),i=n.n(a),r=n(24),o=n.n(r),l=(n(109),n(82)),c=n.n(l),s=(n(161),n(92)),d=n.n(s),u=n(40),m=n.n(u),h=n(41),f=n.n(h),p=n(42),g=n.n(p),v=n(34),y=n.n(v),E=n(43),_=n.n(E),x=n(9),P=n.n(x),C=n(17),b=n.n(C),L=(n(166),n(107)),k=n.n(L),N=n(58),w=n.n(N),B=(n(170),n(106)),S=n.n(B),R=n(91),T=n.n(R),F=(n(174),n(52)),H=n.n(F),D=(n(176),n(105)),O=n.n(D),A=(n(115),n(74)),W=n.n(A),G=n(62),j=n.n(G),I=n(33),M=n.n(I),V=n(12),z=n.n(V),U=n(4),J=n.n(U);function K(e,t,n){return t=y()(t),g()(e,function(){try{var e=!Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){})))}catch(e){}return function(){return!!e}()}()?Reflect.construct(t,n||[],y()(e).constructor):t.apply(e,n))}var X=c.a.Content,q=1,Q=function(e){function t(){var e;m()(this,t);for(var n=arguments.length,a=new Array(n),r=0;r<n;r++)a[r]=arguments[r];return e=K(this,t,[].concat(a)),P()(e,"state",{lineGroup:[],showType:e.props.showType}),P()(e,"flashContent",(function(t){if("string"!=typeof(t||e.props.diffArr)){var n=(t||e.props.diffArr).map((function(t,n,a){var i,r,o,l,c;e.props.isFile?(r="+"===t[0],o="-"===t[0],l=t.slice(1),c=1):(r=t.added,o=t.removed,l=t.value,c=t.count);var s=(null===(i=l)||void 0===i?void 0:i.split("\n"))||[];""===s[s.length-1]&&s.pop();var d,u,m,h=(r?"+":o&&"-")||" ";if(" "!==h)u=[],m=[],d=s;else{var f=s.length;f<=6?(u=[],m=[],d=s):(d=s.slice(0,3),u=s.slice(3,f-3),m=s.slice(f-3))}return{type:h,count:c,content:{hidden:u,head:d,tail:m}}})),a=1,i=1;n.forEach((function(e){var t=e.type,n=e.count;e.leftPos=a,e.rightPos=i,a+="+"===t?0:n,i+="-"===t?0:n})),e.setState({lineGroup:n})}})),P()(e,"openBlock",(function(t,n){var a=e.state.lineGroup.slice(),i=a[n],r=i.content,o=r.head,l=r.tail,c=r.hidden;if("head"===t)i.content.head=o.concat(c.slice(0,3)),i.content.hidden=c.slice(3);else if("tail"===t){var s=c.length;i.content.tail=c.slice(s-3).concat(l),i.content.hidden=c.slice(0,s-3)}else i.content.head=o.concat(c),i.content.hidden=[];a[n]=i,e.setState({lineGroup:a})})),P()(e,"getHiddenBtn",(function(t,n){return i.a.createElement("div",{key:"collapse",className:z.a.cutWrapper},i.a.createElement("div",{className:J()(z.a.colLeft,e.isSplit?z.a.splitWidth:"")},i.a.createElement("div",{className:z.a.arrow,onClick:e.openBlock.bind(e,"all",n)},i.a.createElement("svg",{className:z.a.octicon,viewBox:"0 0 16 16",version:"1.1",width:"16",height:"16","aria-hidden":"true"},i.a.createElement("path",{fillRule:"evenodd",d:"M8.177.677l2.896 2.896a.25.25 0 01-.177.427H8.75v1.25a.75.75 0 01-1.5 0V4H5.104a.25.25 0 01-.177-.427L7.823.677a.25.25 0 01.354 0zM7.25 10.75a.75.75 0 011.5 0V12h2.146a.25.25 0 01.177.427l-2.896 2.896a.25.25 0 01-.354 0l-2.896-2.896A.25.25 0 015.104 12H7.25v-1.25zm-5-2a.75.75 0 000-1.5h-.5a.75.75 0 000 1.5h.5zM6 8a.75.75 0 01-.75.75h-.5a.75.75 0 010-1.5h.5A.75.75 0 016 8zm2.25.75a.75.75 0 000-1.5h-.5a.75.75 0 000 1.5h.5zM12 8a.75.75 0 01-.75.75h-.5a.75.75 0 010-1.5h.5A.75.75 0 0112 8zm2.25.75a.75.75 0 000-1.5h-.5a.75.75 0 000 1.5h.5z"})))),i.a.createElement("div",{className:J()(z.a.collRight,e.isSplit?z.a.collRightSplit:"")},i.a.createElement("div",{className:J()(z.a.colRContent,"")})))})),P()(e,"getLineNum",(function(e){return("     "+e).slice(-5)})),P()(e,"paintCode",(function(t){var n=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],a=e.props.highlightedLines,r=t.type,o=t.content,l=o.head,c=o.tail,s=t.leftPos,d=t.rightPos,u=" "===r,m=J()(z.a.normal,"+"===r?z.a.add:"","-"===r?z.a.removed:""),h="     ";return(n?l:c).map((function(t,o){var f="",p=!1,g=null;if(("-"===r||"+"===r)&&(g="-"===r?s+o:d+o,a&&a.length>0))for(var v=0;v<a.length;v++){var y=a[v],E=y.startLine,_=y.endLine,x=y.side;if("-"===r&&"left"===x&&g>=E&&g<=_||"+"===r&&"right"===x&&g>=E&&g<=_){p=!0;break}}if(u){var P=n?0:l.length+c.length;f=(h+(s+P+o)).slice(-5)+(h+(d+P+o)).slice(-5)}else f="-"===r?e.getLineNum(s+o)+h:h+e.getLineNum(d+o);return i.a.createElement("div",{key:(n?"h-":"t-")+o,className:p?J()(m,z.a.highlighted):m},i.a.createElement("pre",{className:J()(z.a.pre,z.a.line)},f),i.a.createElement("div",{className:z.a.outerPre},i.a.createElement("div",{className:z.a.splitCon},i.a.createElement("div",{className:z.a.spanWidth}," "+r+" "),e.getPaddingContent(t,!0))))}))})),P()(e,"getUnifiedRenderContent",(function(){return e.state.lineGroup.map((function(t,n){var a=t.type,r=t.content.hidden,o=" "===a;return i.a.createElement("div",{key:n},e.paintCode(t),r.length&&o&&e.getHiddenBtn(r,n)||null,e.paintCode(t,!1))}))})),P()(e,"getLNPadding",(function(e){var t=("     "+e).slice(-5);return i.a.createElement("div",{className:J()(z.a.splitLN)},t)})),P()(e,"getPaddingContent",(function(e){return i.a.createElement("div",{className:J()(z.a.splitCon)},e)})),P()(e,"getSplitCode",(function(t){var n=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],a=(t.type,t.content),r=a.head,o=a.hidden,l=a.tail,c=t.leftPos,s=t.rightPos;return(n?r:l).map((function(t,a){var l=n?0:r.length+o.length;return i.a.createElement("div",{key:(n?"h-":"t-")+a},i.a.createElement("div",{className:J()(z.a.iBlock,z.a.lBorder)},e.getLNPadding(c+l+a),e.getPaddingContent("    "+t)),i.a.createElement("div",{className:z.a.iBlock},e.getLNPadding(s+l+a),e.getPaddingContent("    "+t)))}))})),P()(e,"getCombinePart",(function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},a=t.type,r=t.content,o=t.leftPos,l=(t.rightPos,n.type),c=n.content,s=(n.leftPos,n.rightPos),d=(null==r?void 0:r.head)||[],u=(null==c?void 0:c.head)||[],m="+"===a?z.a.add:z.a.removed,h="+"===l?z.a.add:z.a.removed;return i.a.createElement(i.a.Fragment,null,i.a.createElement("div",{className:J()(z.a.iBlock,z.a.lBorder)},d.map((function(t,n){return i.a.createElement("div",{className:J()(z.a.prBlock,m),key:n},e.getLNPadding(o+n),e.getPaddingContent("-  "+t))}))),i.a.createElement("div",{className:J()(z.a.iBlock,d.length?"":z.a.rBorder)},u.map((function(t,n){return i.a.createElement("div",{className:J()(z.a.prBlock,h),key:n},e.getLNPadding(s+n),e.getPaddingContent("+  "+t))}))))})),P()(e,"getSplitContent",(function(){for(var t=e.state.lineGroup.length,n=[],a=0;a<t;a++){var r=e.state.lineGroup[a],o=r.type,l=r.content.hidden;if(" "===o)n.push(i.a.createElement("div",{key:a},e.getSplitCode(r),l.length&&e.getHiddenBtn(l,a)||null,e.getSplitCode(r,!1)));else if("-"===o){var c=e.state.lineGroup[a+1]||{content:{}},s="+"===c.type;n.push(i.a.createElement("div",{key:a},e.getCombinePart(r,s?c:{}))),s&&(a+=1)}else"+"===o&&n.push(i.a.createElement("div",{key:a},e.getCombinePart({},r)))}return i.a.createElement("div",null,n)})),P()(e,"getHighlightSpiltContent",(function(){for(var t=e.state.lineGroup.length,n=[],a=0;a<t;a++){var r=e.state.lineGroup[a],o=r.type,l=r.content.hidden;if(" "===o)n.push(i.a.createElement("div",{key:a},e.getHighlghtSplitCode(r),l.length&&e.getHiddenBtn(l,a)||null,e.getHighlghtSplitCode(r,!1)));else if("-"===o){var c=e.state.lineGroup[a+1]||{content:{}},s="+"===c.type;n.push(i.a.createElement("div",{key:a},e.getHighlightCombinePart(r,s?c:{}))),s&&(a+=1)}else"+"===o&&n.push(i.a.createElement("div",{key:a},e.getHighlightCombinePart({},r)))}return i.a.createElement("div",null,n)})),P()(e,"getHighlightCombinePart",(function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},a=t.type,r=t.content,o=t.leftPos,l=(t.rightPos,n.type),c=n.content,s=(n.leftPos,n.rightPos),d=(null==r?void 0:r.head)||[],u=(null==c?void 0:c.head)||[];"+"===a?z.a.add:z.a.removed,"+"===l?z.a.add:z.a.removed;return i.a.createElement(i.a.Fragment,null,i.a.createElement("div",{className:J()(z.a.iBlock,z.a.lBorder)},d.map((function(t,n){return i.a.createElement("div",{className:J()(z.a.prBlock,e.shouldHighlightLine(o+n,"left")?z.a.highlighted:""),key:n},e.getLNPadding(o+n),e.getPaddingContent("-  "+t))}))),i.a.createElement("div",{className:J()(z.a.iBlock,d.length?"":z.a.rBorder)},u.map((function(t,n){return i.a.createElement("div",{className:J()(z.a.prBlock,e.shouldHighlightLine(s+n,"right")?z.a.highlighted:""),key:n},e.getLNPadding(s+n),e.getPaddingContent("+  "+t))}))))})),P()(e,"getHighlghtSplitCode",(function(t){var n=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],a=e.props.highlightedLines,r=(t.type,t.content),o=r.head,l=r.hidden,c=r.tail,s=t.leftPos,d=t.rightPos;return(n?o:c).map((function(t,r){var c=n?0:o.length+l.length,u=a.some((function(e){return"left"===e.side&&s+c+r>=e.startLine&&s+c+r<=e.endLine})),m=a.some((function(e){return"right"===e.side&&d+c+r>=e.startLine&&d+c+r<=e.endLine})),h=u?z.a.highlighted:"",f=m?z.a.highlighted:"";return i.a.createElement("div",{key:(n?"h-":"t-")+r},i.a.createElement("div",{className:J()(z.a.iBlock,z.a.lBorder,h)},e.getLNPadding(s+c+r),e.getPaddingContent("    "+t)),i.a.createElement("div",{className:J()(z.a.iBlock,f)},e.getLNPadding(d+c+r),e.getPaddingContent("    "+t)))}))})),P()(e,"handleShowTypeChange",(function(t){e.setState({showType:t.target.value})})),P()(e,"shouldHighlightLine",(function(t,n){return e.props.highlightedLines.some((function(e){var a=e.startLine,i=e.endLine;return e.side===n&&t>=a&&t<=i}))})),e}return _()(t,e),f()(t,[{key:"componentDidUpdate",value:function(e){e.showType!==this.props.showType&&this.setState({showType:this.props.showType})}},{key:"componentDidMount",value:function(){this.flashContent()}},{key:"componentWillReceiveProps",value:function(e){this.flashContent(e.diffArr)}},{key:"isSplit",get:function(){return this.state.showType===q}},{key:"render",value:function(){var e=this.state.showType;return i.a.createElement(i.a.Fragment,null,i.a.createElement(X,{className:z.a.content},i.a.createElement("div",{className:z.a.color},e===q?this.getSplitContent():this.getHighlightSpiltContent())))}}])}(i.a.Component);function Y(e,t,n){return t=y()(t),g()(e,function(){try{var e=!Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){})))}catch(e){}return function(){return!!e}()}()?Reflect.construct(t,n||[],y()(e).constructor):t.apply(e,n))}var Z=W.a.Panel,$=function(e){function t(){var e;m()(this,t);for(var n=arguments.length,a=new Array(n),i=0;i<n;i++)a[i]=arguments[i];return e=Y(this,t,[].concat(a)),P()(e,"handleLocationClick",(function(t,n){e.props.onHighlightDiff(t,n)})),e}return _()(t,e),f()(t,[{key:"render",value:function(){var e=this,t=this.props.refactorings;return i.a.createElement("div",{className:M.a.description},i.a.createElement("h3",null,"Refactorings:"),t.map((function(t,n){return i.a.createElement("div",{key:n,className:M.a.refactoringItem},i.a.createElement("div",{className:M.a.bottom},i.a.createElement("strong",null,"Type:")," ",t.type," ",i.a.createElement("a",{href:"#",onClick:function(){return e.handleLocationClick(t.leftSideLocation,t.rightSideLocation)}},"Location"),i.a.createElement("br",null)),i.a.createElement("div",{className:M.a.bottom},i.a.createElement("strong",null,"Description:")," ",t.description,i.a.createElement("br",null)),i.a.createElement(W.a,null,i.a.createElement(Z,{header:"details",key:n},i.a.createElement("strong",null,"Left Side Location:"),i.a.createElement("ul",{type:"none"},t.leftSideLocation.map((function(e,t){return i.a.createElement("li",{key:t},i.a.createElement("div",null,i.a.createElement("strong",null,"filePath:")," ",e.filePath),i.a.createElement("div",null,i.a.createElement("strong",null,"startLine:")," ",e.startLine),i.a.createElement("div",null,i.a.createElement("strong",null,"endLine:")," ",e.endLine),i.a.createElement("div",null,i.a.createElement("strong",null,"codeElementType:")," ",e.codeElementType),i.a.createElement("div",null,i.a.createElement("strong",null,"description:")," ",e.description),i.a.createElement("div",null,i.a.createElement("strong",null,"codeEntity:")," ",e.codeElement))}))),i.a.createElement("strong",null,"Right Side Location:"),i.a.createElement("ul",{type:"none"},t.rightSideLocation.map((function(e,t){return i.a.createElement("li",{key:t},i.a.createElement("div",null,i.a.createElement("strong",null,"filePath:")," ",e.filePath),i.a.createElement("div",null,i.a.createElement("strong",null,"startLine:")," ",e.startLine),i.a.createElement("div",null,i.a.createElement("strong",null,"endLine:")," ",e.endLine),i.a.createElement("div",null,i.a.createElement("strong",null,"codeElementType:")," ",e.codeElementType),i.a.createElement("div",null,i.a.createElement("strong",null,"description:")," ",e.description),i.a.createElement("div",null,i.a.createElement("strong",null,"codeEntity:")," ",e.codeElement))}))))))})))}}])}(i.a.Component);function ee(e,t,n){return t=y()(t),g()(e,function(){try{var e=!Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){})))}catch(e){}return function(){return!!e}()}()?Reflect.construct(t,n||[],y()(e).constructor):t.apply(e,n))}var te=n(181),ne=(W.a.Panel,O.a.Item),ae={labelCol:{span:4},wrapperCol:{span:20}},ie=0,re=1,oe=function(e){function t(){var e;m()(this,t);for(var n=arguments.length,a=new Array(n),r=0;r<n;r++)a[r]=arguments[r];return e=ee(this,t,[].concat(a)),P()(e,"state",{diffResults:[],method:"words"===e.props.type?"diffChars":"diffLines",repository:"",fileUploaded:!1,refactorings:[],commitid:"",commits:[],highlightedFiles:[],isFilteredByLocation:!1,showType:re}),P()(e,"actDiff",(function(e,t){try{return te.diffLines(e,t)}catch(e){return console.error("Error computing diff:",e),H.a.error("Error computing diff."),[]}})),P()(e,"getCharDiff",(function(e){})),P()(e,"handleSubmit",T()(j.a.mark((function t(){var n,a,i,r,o,l,c,s;return j.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(n=e.state,a=n.commitid,i=n.repository,a&&i){t.next=4;break}return H.a.error("Please provide repository_path and commentid."),t.abrupt("return");case 4:return t.prev=4,t.next=7,fetch("http://localhost:8080/api/diff",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({repository:i,commitid:a})});case 7:if((r=t.sent).ok){t.next=10;break}throw new Error("Network response was not ok.");case 10:return t.next=12,r.json();case 12:(o=t.sent).results&&o.results.length>0?(l=o.results[0],(c=l.files)&&c.length>0?(s=c.map((function(t){return{fileName:t.name,diff:e.actDiff(t.oldCode,t.newCode)}})),e.setState({diffResults:s,refactorings:l.refactorings||[],fileUploaded:!0,isFilteredByLocation:!1,showType:re})):H.a.error("No files found in JSON.")):H.a.error("Invalid JSON format: Missing results array."),t.next=20;break;case 16:t.prev=16,t.t0=t.catch(4),console.error("Error fetching diff:",t.t0),H.a.error("Error fetching diff.");case 20:case"end":return t.stop()}}),t,null,[[4,16]])})))),P()(e,"selectDirectoryDialog",T()(j.a.mark((function t(){var n,a;return j.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:n=window.require("electron"),(a=n.ipcRenderer).send("dialog:selectDirectory"),a.on("directory:selected",function(){var t=T()(j.a.mark((function t(n,a){var i,r;return j.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return e.setState({repository:a,fileUploaded:!1,isFilteredByLocation:!1,showType:re}),t.prev=1,t.next=4,fetch("http://localhost:8080/api/commit",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({repository:a})});case 4:if(i=t.sent,console.log(a),i.ok){t.next=8;break}throw new Error("Failed to fetch commit list.");case 8:return t.next=10,i.json();case 10:(r=t.sent).length>0?e.setState({commits:r}):H.a.error("No commits found."),t.next=18;break;case 14:t.prev=14,t.t0=t.catch(1),console.error("Error fetching commits:",t.t0),H.a.error("Error fetching commits.");case 18:case"end":return t.stop()}}),t,null,[[1,14]])})));return function(e,n){return t.apply(this,arguments)}}());case 3:case"end":return t.stop()}}),t)})))),P()(e,"renderCommitSelect",(function(){var t=e.state,n=t.commits,a=t.commitid;return i.a.createElement(ne,null,i.a.createElement(S.a,{value:a,onChange:function(t){return e.setState({commitid:t})},placeholder:"Select a commit",style:{width:"100%"}},n.map((function(e,t){return i.a.createElement(S.a.Option,{key:t,value:e},e)}))))})),P()(e,"handleHighlightDiff",(function(t,n){var a=e.state.highlightedFiles,i=t.map((function(e){return{filePath:e.filePath,startLine:e.startLine,endLine:e.endLine,description:e.description,side:"left"}})),r=n.map((function(e){return{filePath:e.filePath,startLine:e.startLine,endLine:e.endLine,description:e.description,side:"right"}})),o=[].concat(w()(i),w()(r));o.every((function(e){return a.some((function(t){return t.filePath===e.filePath&&t.startLine===e.startLine&&t.endLine===e.endLine&&t.description===e.description}))}))?e.setState({highlightedFiles:[],isFilteredByLocation:!1,showType:re}):e.setState({highlightedFiles:o,isFilteredByLocation:!0,showType:ie})})),P()(e,"resetToAllFiles",(function(){e.setState({highlightedFiles:[],showType:re,isFilteredByLocation:!1})})),e}return _()(t,e),f()(t,[{key:"render",value:function(){var e=this,t=this.state,n=t.diffResults,a=t.fileUploaded,r=t.repository,o=t.commitid,l=t.commits,c=t.highlightedFiles,s=t.isFilteredByLocation,d=t.refactorings,u=t.showType;return i.a.createElement("div",{className:M.a.wrapper},i.a.createElement(O.a,b()({},ae,{onFinish:this.handleSubmit,className:M.a.handleSubmit}),i.a.createElement("div",null,i.a.createElement("div",{className:M.a.bottonandtext},i.a.createElement("div",{className:M.a.Repositorylabel},"Repository :"),i.a.createElement("div",null,i.a.createElement(k.a,{type:"default",onClick:this.selectDirectoryDialog,className:M.a.selectbotton},"Select Repository Path")),i.a.createElement("div",null,i.a.createElement("span",{style:{marginLeft:"10px"}},r)))),i.a.createElement("div",null,l.length>0&&i.a.createElement("div",{className:M.a.CommitselectAndBotton},i.a.createElement("div",{className:M.a.Commitlabel},"Commit_id :"),i.a.createElement("div",{className:M.a.commitselect},this.renderCommitSelect()),i.a.createElement("div",null,i.a.createElement(k.a,{type:"primary",htmlType:"submit",className:M.a.botton,disabled:!o},"Detect"))))),u===ie&&a&&s&&i.a.createElement("a",{onClick:this.resetToAllFiles,style:{textDecoration:"underline",color:"blue",cursor:"pointer",background:"transparent",border:"none",padding:0,marginBottom:"20px",marginLeft:"30px"}},"← Back to all files"),a&&!s&&n.length>0&&n.map((function(t,n){return i.a.createElement("div",{key:n},i.a.createElement("div",{className:M.a.filename},i.a.createElement("strong",null,"filePath:  ")," ",t.fileName),i.a.createElement(Q,{isFile:e.isFile,diffArr:t.diff,highlightedLines:[],showType:u}))})),a&&s&&n.length>0&&n.map((function(t,n){return i.a.createElement("div",{key:n},c.some((function(e){return e.filePath===t.fileName}))&&i.a.createElement("div",{className:M.a.filename},i.a.createElement("strong",null,"filePath:  ")," ",t.fileName),c.some((function(e){return e.filePath===t.fileName}))&&i.a.createElement(Q,{isFile:e.isFile,diffArr:t.diff,highlightedLines:c.filter((function(e){return e.filePath===t.fileName})),showType:u}))})),a&&i.a.createElement($,{refactorings:d,onHighlightDiff:this.handleHighlightDiff}))}}])}(i.a.Component);function le(e,t,n){return t=y()(t),g()(e,function(){try{var e=!Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){})))}catch(e){}return function(){return!!e}()}()?Reflect.construct(t,n||[],y()(e).constructor):t.apply(e,n))}var ce="0",se="1",de=function(e){function t(){var e;m()(this,t);for(var n=arguments.length,a=new Array(n),r=0;r<n;r++)a[r]=arguments[r];return e=le(this,t,[].concat(a)),P()(e,"state",{currentTab:ce}),P()(e,"getContent",(function(){return P()(P()({},ce,(function(){return i.a.createElement("div",null,i.a.createElement(oe,{type:"lines"}))})),se,(function(){return i.a.createElement("div",null,"你好，等我更新")}))[e.state.currentTab]()})),P()(e,"navChange",(function(t){e.setState({currentTab:t.key})})),e}return _()(t,e),f()(t,[{key:"render",value:function(){return i.a.createElement(c.a,null,i.a.createElement(d.a,{onClick:this.navChange,mode:"horizontal",selectedKeys:[this.state.currentTab]},i.a.createElement(d.a.Item,{key:ce},"Refactoring Discovery"),i.a.createElement(d.a.Item,{key:se},"More")),this.getContent())}}])}(i.a.Component),ue=document.getElementById("main");o.a.render(i.a.createElement(de,null),ue)},33:function(e,t,n){e.exports={charAdd:"index__charAdd--2u9EA",charRemoved:"index__charRemoved--2NBzi",wrapper:"index__wrapper--2L7IR",input:"index__input--2qmtU",formItem:"index__formItem--2BEAH","ant-form-item-label":"index__ant-form-item-label--3lMJ6",textContent:"index__textContent--8AlZF",funWrapper:"index__funWrapper--19VTK",result:"index__result--3p5uV",preWrap:"index__preWrap--aXHIE",charPreWrap:"index__charPreWrap--31WOt",description:"index__description--3rduU",singleLine:"index__singleLine--3oyVe",filesDiffs:"index__filesDiffs--2_GUo",fileDiff:"index__fileDiff--oy9MV",diffContent:"index__diffContent--2GXoV",diffItem:"index__diffItem--1_etv",add:"index__add--5mgHY",removed:"index__removed--3IFqm",filename:"index__filename--3_nv2",refactoringItem:"index__refactoringItem--99Qry",bottom:"index__bottom--2SHKc",botton:"index__botton--2DzR4",textarea:"index__textarea--3Gn9o",handleSubmit:"index__handleSubmit--1kxBb",selectbotton:"index__selectbotton--3EOfa",flexRow:"index__flexRow--RzYNl",bottonandtext:"index__bottonandtext--1-eSl",CommitselectAndBotton:"index__CommitselectAndBotton--1siZm",commitselect:"index__commitselect--23Fb4",Repositorylabel:"index__Repositorylabel--1NQ2T",Commitlabel:"index__Commitlabel--oPtGI"}}});