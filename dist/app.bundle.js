!function(e){function t(t){for(var a,o,l=t[0],c=t[1],s=t[2],u=0,h=[];u<l.length;u++)o=l[u],Object.prototype.hasOwnProperty.call(r,o)&&r[o]&&h.push(r[o][0]),r[o]=0;for(a in c)Object.prototype.hasOwnProperty.call(c,a)&&(e[a]=c[a]);for(d&&d(t);h.length;)h.shift()();return i.push.apply(i,s||[]),n()}function n(){for(var e,t=0;t<i.length;t++){for(var n=i[t],a=!0,l=1;l<n.length;l++){var c=n[l];0!==r[c]&&(a=!1)}a&&(i.splice(t--,1),e=o(o.s=n[0]))}return e}var a={},r={0:0},i=[];function o(t){if(a[t])return a[t].exports;var n=a[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,o),n.l=!0,n.exports}o.m=e,o.c=a,o.d=function(e,t,n){o.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},o.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(e,t){if(1&t&&(e=o(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(o.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var a in e)o.d(n,a,function(t){return e[t]}.bind(null,a));return n},o.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(t,"a",t),t},o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},o.p="D:\\Refactoring-Discovery\\dist";var l=window.webpackJsonp=window.webpackJsonp||[],c=l.push.bind(l);l.push=t,l=l.slice();for(var s=0;s<l.length;s++)t(l[s]);var d=c;i.push([155,1]),n()}({12:function(e,t,n){e.exports={color:"index__color--2ojbV",highlighted:"index__highlighted--1donK",normal:"index__normal--3xN0k",add:"index__add--3fp2b",removed:"index__removed--18dBy",pre:"index__pre--3eDFa",button:"index__button--2J6G4",content:"index__content--3DNR8",outerPre:"index__outerPre--1Pone",spanWidth:"index__spanWidth--125bf",innerPre:"index__innerPre--1_Bab",line:"index__line--1sUEl",colLeft:"index__colLeft--2F2iS",splitWidth:"index__splitWidth--jvhC7",collRight:"index__collRight--2OaKg",collRightSplit:"index__collRightSplit--2H9r-",colRContent:"index__colRContent--3gXOP",octicon:"index__octicon--2VVw1",arrow:"index__arrow--1FWUj",cRHeight:"index__cRHeight--1pHdx",sPart:"index__sPart--1V1XW",iBlock:"index__iBlock--3k0eW",prBlock:"index__prBlock--N52o_",splitLN:"index__splitLN--2ci2A",splitCon:"index__splitCon--15tpv",filled:"index__filled--23P9T",radioGroup:"index__radioGroup--2E-ih",lBorder:"index__lBorder--2ClWV",rBorder:"index__rBorder--3Sx6H"}},155:function(e,t,n){e.exports=n(319)},319:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),i=n(24),o=n.n(i),l=(n(109),n(82)),c=n.n(l),s=(n(161),n(92)),d=n.n(s),u=n(40),h=n.n(u),f=n(41),m=n.n(f),p=n(42),g=n.n(p),v=n(33),y=n.n(v),E=n(43),_=n.n(E),x=n(9),P=n.n(x),k=n(17),L=n.n(k),b=(n(166),n(107)),C=n.n(b),N=n(58),w=n.n(N),S=(n(170),n(106)),B=n.n(S),T=n(91),R=n.n(T),H=(n(174),n(52)),F=n.n(H),D=(n(176),n(105)),O=n.n(D),A=(n(115),n(74)),W=n.n(A),G=n(62),j=n.n(G),I=n(38),M=n.n(I),V=n(12),U=n.n(V),z=n(4),J=n.n(z);function K(e,t,n){return t=y()(t),g()(e,function(){try{var e=!Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){})))}catch(e){}return function(){return!!e}()}()?Reflect.construct(t,n||[],y()(e).constructor):t.apply(e,n))}var X=c.a.Content,q=1,Q=function(e){function t(){var e;h()(this,t);for(var n=arguments.length,a=new Array(n),i=0;i<n;i++)a[i]=arguments[i];return e=K(this,t,[].concat(a)),P()(e,"state",{lineGroup:[],showType:e.props.showType}),P()(e,"flashContent",(function(t){if("string"!=typeof(t||e.props.diffArr)){var n=(t||e.props.diffArr).map((function(t,n,a){var r,i,o,l,c;e.props.isFile?(i="+"===t[0],o="-"===t[0],l=t.slice(1),c=1):(i=t.added,o=t.removed,l=t.value,c=t.count);var s,d,u,h=(null===(r=l)||void 0===r?void 0:r.split("\n").filter(Boolean))||[],f=(i?"+":o&&"-")||" ";if(" "!==f)d=[],u=[],s=h;else{var m=h.length;m<=6?(d=[],u=[],s=h):(s=h.slice(0,3),d=h.slice(3,m-3),u=h.slice(m-3))}return{type:f,count:c,content:{hidden:d,head:s,tail:u}}})),a=1,r=1;n.forEach((function(e){var t=e.type,n=e.count;e.leftPos=a,e.rightPos=r,a+="+"===t?0:n,r+="-"===t?0:n})),e.setState({lineGroup:n})}})),P()(e,"openBlock",(function(t,n){var a=e.state.lineGroup.slice(),r=a[n],i=r.content,o=i.head,l=i.tail,c=i.hidden;if("head"===t)r.content.head=o.concat(c.slice(0,3)),r.content.hidden=c.slice(3);else if("tail"===t){var s=c.length;r.content.tail=c.slice(s-3).concat(l),r.content.hidden=c.slice(0,s-3)}else r.content.head=o.concat(c),r.content.hidden=[];a[n]=r,e.setState({lineGroup:a})})),P()(e,"getHiddenBtn",(function(t,n){return r.a.createElement("div",{key:"collapse",className:U.a.cutWrapper},r.a.createElement("div",{className:J()(U.a.colLeft,e.isSplit?U.a.splitWidth:"")},r.a.createElement("div",{className:U.a.arrow,onClick:e.openBlock.bind(e,"all",n)},r.a.createElement("svg",{className:U.a.octicon,viewBox:"0 0 16 16",version:"1.1",width:"16",height:"16","aria-hidden":"true"},r.a.createElement("path",{fillRule:"evenodd",d:"M8.177.677l2.896 2.896a.25.25 0 01-.177.427H8.75v1.25a.75.75 0 01-1.5 0V4H5.104a.25.25 0 01-.177-.427L7.823.677a.25.25 0 01.354 0zM7.25 10.75a.75.75 0 011.5 0V12h2.146a.25.25 0 01.177.427l-2.896 2.896a.25.25 0 01-.354 0l-2.896-2.896A.25.25 0 015.104 12H7.25v-1.25zm-5-2a.75.75 0 000-1.5h-.5a.75.75 0 000 1.5h.5zM6 8a.75.75 0 01-.75.75h-.5a.75.75 0 010-1.5h.5A.75.75 0 016 8zm2.25.75a.75.75 0 000-1.5h-.5a.75.75 0 000 1.5h.5zM12 8a.75.75 0 01-.75.75h-.5a.75.75 0 010-1.5h.5A.75.75 0 0112 8zm2.25.75a.75.75 0 000-1.5h-.5a.75.75 0 000 1.5h.5z"})))),r.a.createElement("div",{className:J()(U.a.collRight,e.isSplit?U.a.collRightSplit:"")},r.a.createElement("div",{className:J()(U.a.colRContent,"")})))})),P()(e,"getLineNum",(function(e){return("     "+e).slice(-5)})),P()(e,"paintCode",(function(t){var n=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],a=e.props.highlightedLines,i=t.type,o=t.content,l=o.head,c=o.tail,s=t.leftPos,d=t.rightPos,u=" "===i,h=J()(U.a.normal,"+"===i?U.a.add:"","-"===i?U.a.removed:""),f="     ";return(n?l:c).map((function(t,o){var m="",p=!1,g=null;if(("-"===i||"+"===i)&&(g="-"===i?s+o:d+o,a&&a.length>0))for(var v=0;v<a.length;v++){var y=a[v],E=y.startLine,_=y.endLine,x=y.side;if("-"===i&&"left"===x&&g>=E&&g<=_||"+"===i&&"right"===x&&g>=E&&g<=_){p=!0;break}}if(u){var P=n?0:l.length+c.length;m=(f+(s+P+o)).slice(-5)+(f+(d+P+o)).slice(-5)}else m="-"===i?e.getLineNum(s+o)+f:f+e.getLineNum(d+o);return r.a.createElement("div",{key:(n?"h-":"t-")+o,className:p?J()(h,U.a.highlighted):h},r.a.createElement("pre",{className:J()(U.a.pre,U.a.line)},m),r.a.createElement("div",{className:U.a.outerPre},r.a.createElement("div",{className:U.a.splitCon},r.a.createElement("div",{className:U.a.spanWidth}," "+i+" "),e.getPaddingContent(t,!0))))}))})),P()(e,"getUnifiedRenderContent",(function(){return e.state.lineGroup.map((function(t,n){var a=t.type,i=t.content.hidden,o=" "===a;return r.a.createElement("div",{key:n},e.paintCode(t),i.length&&o&&e.getHiddenBtn(i,n)||null,e.paintCode(t,!1))}))})),P()(e,"getLNPadding",(function(e){var t=("     "+e).slice(-5);return r.a.createElement("div",{className:J()(U.a.splitLN)},t)})),P()(e,"getPaddingContent",(function(e){return r.a.createElement("div",{className:J()(U.a.splitCon)},e)})),P()(e,"getSplitCode",(function(t){var n=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],a=(t.type,t.content),i=a.head,o=a.hidden,l=a.tail,c=t.leftPos,s=t.rightPos;return(n?i:l).map((function(t,a){var l=n?0:i.length+o.length;return r.a.createElement("div",{key:(n?"h-":"t-")+a},r.a.createElement("div",{className:J()(U.a.iBlock,U.a.lBorder)},e.getLNPadding(c+l+a),e.getPaddingContent("    "+t)),r.a.createElement("div",{className:U.a.iBlock},e.getLNPadding(s+l+a),e.getPaddingContent("    "+t)))}))})),P()(e,"getCombinePart",(function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},a=t.type,i=t.content,o=t.leftPos,l=(t.rightPos,n.type),c=n.content,s=(n.leftPos,n.rightPos),d=(null==i?void 0:i.head)||[],u=(null==c?void 0:c.head)||[],h="+"===a?U.a.add:U.a.removed,f="+"===l?U.a.add:U.a.removed;return r.a.createElement(r.a.Fragment,null,r.a.createElement("div",{className:J()(U.a.iBlock,U.a.lBorder)},d.map((function(t,n){return r.a.createElement("div",{className:J()(U.a.prBlock,h),key:n},e.getLNPadding(o+n),e.getPaddingContent("-  "+t))}))),r.a.createElement("div",{className:J()(U.a.iBlock,d.length?"":U.a.rBorder)},u.map((function(t,n){return r.a.createElement("div",{className:J()(U.a.prBlock,f),key:n},e.getLNPadding(s+n),e.getPaddingContent("+  "+t))}))))})),P()(e,"getSplitContent",(function(){for(var t=e.state.lineGroup.length,n=[],a=0;a<t;a++){var i=e.state.lineGroup[a],o=i.type,l=i.content.hidden;if(" "===o)n.push(r.a.createElement("div",{key:a},e.getSplitCode(i),l.length&&e.getHiddenBtn(l,a)||null,e.getSplitCode(i,!1)));else if("-"===o){var c=e.state.lineGroup[a+1]||{content:{}},s="+"===c.type;n.push(r.a.createElement("div",{key:a},e.getCombinePart(i,s?c:{}))),s&&(a+=1)}else"+"===o&&n.push(r.a.createElement("div",{key:a},e.getCombinePart({},i)))}return r.a.createElement("div",null,n)})),P()(e,"getHighlightSpiltContent",(function(){for(var t=e.state.lineGroup.length,n=[],a=0;a<t;a++){var i=e.state.lineGroup[a],o=i.type,l=i.content.hidden;if(" "===o)n.push(r.a.createElement("div",{key:a},e.getHighlghtSplitCode(i),l.length&&e.getHiddenBtn(l,a)||null,e.getHighlghtSplitCode(i,!1)));else if("-"===o){var c=e.state.lineGroup[a+1]||{content:{}},s="+"===c.type;n.push(r.a.createElement("div",{key:a},e.getHighlightCombinePart(i,s?c:{}))),s&&(a+=1)}else"+"===o&&n.push(r.a.createElement("div",{key:a},e.getHighlightCombinePart({},i)))}return r.a.createElement("div",null,n)})),P()(e,"getHighlightCombinePart",(function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},a=t.type,i=t.content,o=t.leftPos,l=(t.rightPos,n.type),c=n.content,s=(n.leftPos,n.rightPos),d=(null==i?void 0:i.head)||[],u=(null==c?void 0:c.head)||[],h="+"===a?U.a.add:U.a.removed,f="+"===l?U.a.add:U.a.removed;return r.a.createElement(r.a.Fragment,null,r.a.createElement("div",{className:J()(U.a.iBlock,U.a.lBorder)},d.map((function(t,n){return r.a.createElement("div",{className:J()(U.a.prBlock,h,e.shouldHighlightLine(o+n,"left")?U.a.highlighted:""),key:n},e.getLNPadding(o+n),e.getPaddingContent("-  "+t))}))),r.a.createElement("div",{className:J()(U.a.iBlock,d.length?"":U.a.rBorder)},u.map((function(t,n){return r.a.createElement("div",{className:J()(U.a.prBlock,f,e.shouldHighlightLine(s+n,"right")?U.a.highlighted:""),key:n},e.getLNPadding(s+n),e.getPaddingContent("+  "+t))}))))})),P()(e,"getHighlghtSplitCode",(function(t){var n=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],a=e.props.highlightedLines,i=(t.type,t.content),o=i.head,l=i.hidden,c=i.tail,s=t.leftPos,d=t.rightPos;return(n?o:c).map((function(t,i){var c=n?0:o.length+l.length,u=a.some((function(e){return"left"===e.side&&s+c+i>=e.startLine&&s+c+i<=e.endLine})),h=a.some((function(e){return"right"===e.side&&d+c+i>=e.startLine&&d+c+i<=e.endLine})),f=u?U.a.highlighted:"",m=h?U.a.highlighted:"";return r.a.createElement("div",{key:(n?"h-":"t-")+i},r.a.createElement("div",{className:J()(U.a.iBlock,U.a.lBorder,f)},e.getLNPadding(s+c+i),e.getPaddingContent("    "+t)),r.a.createElement("div",{className:J()(U.a.iBlock,m)},e.getLNPadding(d+c+i),e.getPaddingContent("    "+t)))}))})),P()(e,"handleShowTypeChange",(function(t){e.setState({showType:t.target.value})})),P()(e,"shouldHighlightLine",(function(t,n){return e.props.highlightedLines.some((function(e){var a=e.startLine,r=e.endLine;return e.side===n&&t>=a&&t<=r}))})),e}return _()(t,e),m()(t,[{key:"componentDidUpdate",value:function(e){e.showType!==this.props.showType&&this.setState({showType:this.props.showType})}},{key:"componentDidMount",value:function(){this.flashContent()}},{key:"componentWillReceiveProps",value:function(e){this.flashContent(e.diffArr)}},{key:"isSplit",get:function(){return this.state.showType===q}},{key:"render",value:function(){var e=this.state.showType;return r.a.createElement(r.a.Fragment,null,r.a.createElement(X,{className:U.a.content},r.a.createElement("div",{className:U.a.color},e===q?this.getSplitContent():this.getHighlightSpiltContent())))}}])}(r.a.Component);function Y(e,t,n){return t=y()(t),g()(e,function(){try{var e=!Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){})))}catch(e){}return function(){return!!e}()}()?Reflect.construct(t,n||[],y()(e).constructor):t.apply(e,n))}var Z=W.a.Panel,$=function(e){function t(){var e;h()(this,t);for(var n=arguments.length,a=new Array(n),r=0;r<n;r++)a[r]=arguments[r];return e=Y(this,t,[].concat(a)),P()(e,"handleLocationClick",(function(t,n){e.props.onHighlightDiff(t,n)})),e}return _()(t,e),m()(t,[{key:"render",value:function(){var e=this,t=this.props.refactorings;return r.a.createElement("div",{className:M.a.description},r.a.createElement("h3",null,"Refactorings:"),t.map((function(t,n){return r.a.createElement("div",{key:n,className:M.a.refactoringItem},r.a.createElement("div",{className:M.a.bottom},r.a.createElement("strong",null,"Type:")," ",t.type," ",r.a.createElement("a",{href:"#",onClick:function(){return e.handleLocationClick(t.leftSideLocation,t.rightSideLocation)}},"Location"),r.a.createElement("br",null)),r.a.createElement("div",{className:M.a.bottom},r.a.createElement("strong",null,"Description:")," ",t.description,r.a.createElement("br",null)),r.a.createElement(W.a,null,r.a.createElement(Z,{header:"details",key:n},r.a.createElement("strong",null,"Left Side Location:"),r.a.createElement("ul",{type:"none"},t.leftSideLocation.map((function(e,t){return r.a.createElement("li",{key:t},r.a.createElement("div",null,r.a.createElement("strong",null,"filePath:")," ",e.filePath),r.a.createElement("div",null,r.a.createElement("strong",null,"startLine:")," ",e.startLine),r.a.createElement("div",null,r.a.createElement("strong",null,"endLine:")," ",e.endLine),r.a.createElement("div",null,r.a.createElement("strong",null,"codeElementType:")," ",e.codeElementType),r.a.createElement("div",null,r.a.createElement("strong",null,"description:")," ",e.description),r.a.createElement("div",null,r.a.createElement("strong",null,"codeEntity:")," ",e.codeElement))}))),r.a.createElement("strong",null,"Right Side Location:"),r.a.createElement("ul",{type:"none"},t.rightSideLocation.map((function(e,t){return r.a.createElement("li",{key:t},r.a.createElement("div",null,r.a.createElement("strong",null,"filePath:")," ",e.filePath),r.a.createElement("div",null,r.a.createElement("strong",null,"startLine:")," ",e.startLine),r.a.createElement("div",null,r.a.createElement("strong",null,"endLine:")," ",e.endLine),r.a.createElement("div",null,r.a.createElement("strong",null,"codeElementType:")," ",e.codeElementType),r.a.createElement("div",null,r.a.createElement("strong",null,"description:")," ",e.description),r.a.createElement("div",null,r.a.createElement("strong",null,"codeEntity:")," ",e.codeElement))}))))))})))}}])}(r.a.Component);function ee(e,t,n){return t=y()(t),g()(e,function(){try{var e=!Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){})))}catch(e){}return function(){return!!e}()}()?Reflect.construct(t,n||[],y()(e).constructor):t.apply(e,n))}var te=n(181),ne=(W.a.Panel,O.a.Item),ae={labelCol:{span:4},wrapperCol:{span:20}},re=0,ie=1,oe=function(e){function t(){var e;h()(this,t);for(var n=arguments.length,a=new Array(n),i=0;i<n;i++)a[i]=arguments[i];return e=ee(this,t,[].concat(a)),P()(e,"state",{diffResults:[],method:"words"===e.props.type?"diffChars":"diffLines",repository:"",fileUploaded:!1,refactorings:[],commitid:"",commits:[],highlightedFiles:[],isFilteredByLocation:!1,showType:ie}),P()(e,"actDiff",(function(e,t){try{return te.diffLines(e,t)}catch(e){return console.error("Error computing diff:",e),F.a.error("Error computing diff."),[]}})),P()(e,"getCharDiff",(function(e){})),P()(e,"handleSubmit",R()(j.a.mark((function t(){var n,a,r,i,o,l,c,s;return j.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(n=e.state,a=n.commitid,r=n.repository,a&&r){t.next=4;break}return F.a.error("Please provide repository_path and commentid."),t.abrupt("return");case 4:return t.prev=4,t.next=7,fetch("http://localhost:8080/api/diff",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({repository:r,commitid:a})});case 7:if((i=t.sent).ok){t.next=10;break}throw new Error("Network response was not ok.");case 10:return t.next=12,i.json();case 12:(o=t.sent).results&&o.results.length>0?(l=o.results[0],(c=l.files)&&c.length>0?(s=c.map((function(t){return{fileName:t.name,diff:e.actDiff(t.oldCode,t.newCode)}})),e.setState({diffResults:s,refactorings:l.refactorings||[],fileUploaded:!0,isFilteredByLocation:!1,showType:ie})):F.a.error("No files found in JSON.")):F.a.error("Invalid JSON format: Missing results array."),t.next=20;break;case 16:t.prev=16,t.t0=t.catch(4),console.error("Error fetching diff:",t.t0),F.a.error("Error fetching diff.");case 20:case"end":return t.stop()}}),t,null,[[4,16]])})))),P()(e,"selectDirectoryDialog",R()(j.a.mark((function t(){var n,a;return j.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:n=window.require("electron"),(a=n.ipcRenderer).send("dialog:selectDirectory"),a.on("directory:selected",function(){var t=R()(j.a.mark((function t(n,a){var r,i;return j.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return e.setState({repository:a,fileUploaded:!1,isFilteredByLocation:!1,showType:ie}),t.prev=1,t.next=4,fetch("http://localhost:8080/api/commit",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({repository:a})});case 4:if(r=t.sent,console.log(a),r.ok){t.next=8;break}throw new Error("Failed to fetch commit list.");case 8:return t.next=10,r.json();case 10:(i=t.sent).length>0?e.setState({commits:i}):F.a.error("No commits found."),t.next=18;break;case 14:t.prev=14,t.t0=t.catch(1),console.error("Error fetching commits:",t.t0),F.a.error("Error fetching commits.");case 18:case"end":return t.stop()}}),t,null,[[1,14]])})));return function(e,n){return t.apply(this,arguments)}}());case 3:case"end":return t.stop()}}),t)})))),P()(e,"renderCommitSelect",(function(){var t=e.state,n=t.commits,a=t.commitid;return r.a.createElement(ne,{label:"Commit"},r.a.createElement(B.a,{value:a,onChange:function(t){return e.setState({commitid:t})},placeholder:"Select a commit",style:{width:"100%"}},n.map((function(e,t){return r.a.createElement(B.a.Option,{key:t,value:e},e)}))))})),P()(e,"handleHighlightDiff",(function(t,n){var a=e.state.highlightedFiles,r=t.map((function(e){return{filePath:e.filePath,startLine:e.startLine,endLine:e.endLine,side:"left"}})),i=n.map((function(e){return{filePath:e.filePath,startLine:e.startLine,endLine:e.endLine,side:"right"}})),o=[].concat(w()(r),w()(i));o.every((function(e){return a.some((function(t){return t.filePath===e.filePath&&t.startLine===e.startLine&&t.endLine===e.endLine}))}))?e.setState({highlightedFiles:[],isFilteredByLocation:!1,showType:ie}):e.setState({highlightedFiles:o,isFilteredByLocation:!0,showType:re})})),P()(e,"resetToAllFiles",(function(){e.setState({highlightedFiles:[],showType:ie,isFilteredByLocation:!1})})),e}return _()(t,e),m()(t,[{key:"render",value:function(){var e=this,t=this.state,n=t.diffResults,a=t.fileUploaded,i=t.repository,o=t.commitid,l=t.commits,c=t.highlightedFiles,s=t.isFilteredByLocation,d=t.refactorings,u=t.showType;return r.a.createElement("div",{className:M.a.wrapper},r.a.createElement(O.a,L()({},ae,{onFinish:this.handleSubmit,className:M.a.handleSubmit}),r.a.createElement("div",{className:M.a.bottonandtext},r.a.createElement("div",null,r.a.createElement(ne,{label:"Repository:"},r.a.createElement(C.a,{type:"default",onClick:this.selectDirectoryDialog,className:M.a.selectbotton},"Select Repository Path"),r.a.createElement("span",null,i)),l.length>0&&this.renderCommitSelect()),r.a.createElement("div",null,r.a.createElement(ne,null,r.a.createElement(C.a,{type:"primary",htmlType:"submit",className:M.a.botton,disabled:!o},"Detect"))))),u===re&&a&&s&&r.a.createElement("a",{onClick:this.resetToAllFiles,style:{textDecoration:"underline",color:"blue",cursor:"pointer",background:"transparent",border:"none",padding:0,marginBottom:"20px",marginLeft:"30px"}},"← Back to all files"),a&&!s&&n.length>0&&n.map((function(t,n){return r.a.createElement("div",{key:n},r.a.createElement("div",{className:M.a.filename},r.a.createElement("strong",null,"filePath:  ")," ",t.fileName),r.a.createElement(Q,{isFile:e.isFile,diffArr:t.diff,highlightedLines:[],showType:u}))})),a&&s&&n.length>0&&n.map((function(t,n){return r.a.createElement("div",{key:n},c.some((function(e){return e.filePath===t.fileName}))&&r.a.createElement("div",{className:M.a.filename},r.a.createElement("strong",null,"filePath:  ")," ",t.fileName),c.some((function(e){return e.filePath===t.fileName}))&&r.a.createElement(Q,{isFile:e.isFile,diffArr:t.diff,highlightedLines:c.filter((function(e){return e.filePath===t.fileName})),showType:u}))})),a&&r.a.createElement($,{refactorings:d,onHighlightDiff:this.handleHighlightDiff}))}}])}(r.a.Component);function le(e,t,n){return t=y()(t),g()(e,function(){try{var e=!Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){})))}catch(e){}return function(){return!!e}()}()?Reflect.construct(t,n||[],y()(e).constructor):t.apply(e,n))}var ce="0",se="1",de=function(e){function t(){var e;h()(this,t);for(var n=arguments.length,a=new Array(n),i=0;i<n;i++)a[i]=arguments[i];return e=le(this,t,[].concat(a)),P()(e,"state",{currentTab:ce}),P()(e,"getContent",(function(){return P()(P()({},ce,(function(){return r.a.createElement("div",null,r.a.createElement(oe,{type:"lines"}))})),se,(function(){return r.a.createElement("div",null,"你好，等我更新")}))[e.state.currentTab]()})),P()(e,"navChange",(function(t){e.setState({currentTab:t.key})})),e}return _()(t,e),m()(t,[{key:"render",value:function(){return r.a.createElement(c.a,null,r.a.createElement(d.a,{onClick:this.navChange,mode:"horizontal",selectedKeys:[this.state.currentTab]},r.a.createElement(d.a.Item,{key:ce},"Refactoring Discovery"),r.a.createElement(d.a.Item,{key:se},"More")),this.getContent())}}])}(r.a.Component),ue=document.getElementById("main");o.a.render(r.a.createElement(de,null),ue)},38:function(e,t,n){e.exports={charAdd:"index__charAdd--2u9EA",charRemoved:"index__charRemoved--2NBzi",wrapper:"index__wrapper--2L7IR",input:"index__input--2qmtU",formItem:"index__formItem--2BEAH","ant-form-item-label":"index__ant-form-item-label--3lMJ6",bottonandtext:"index__bottonandtext--1-eSl",textContent:"index__textContent--8AlZF",funWrapper:"index__funWrapper--19VTK",result:"index__result--3p5uV",preWrap:"index__preWrap--aXHIE",charPreWrap:"index__charPreWrap--31WOt",description:"index__description--3rduU",singleLine:"index__singleLine--3oyVe",filesDiffs:"index__filesDiffs--2_GUo",fileDiff:"index__fileDiff--oy9MV",diffContent:"index__diffContent--2GXoV",diffItem:"index__diffItem--1_etv",add:"index__add--5mgHY",removed:"index__removed--3IFqm",filename:"index__filename--3_nv2",refactoringItem:"index__refactoringItem--99Qry",bottom:"index__bottom--2SHKc",botton:"index__botton--2DzR4",textarea:"index__textarea--3Gn9o",handleSubmit:"index__handleSubmit--1kxBb",selectbotton:"index__selectbotton--3EOfa"}}});