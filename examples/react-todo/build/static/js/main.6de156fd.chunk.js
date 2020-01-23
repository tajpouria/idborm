(this["webpackJsonpreact-todo"]=this["webpackJsonpreact-todo"]||[]).push([[0],{13:function(e,t,a){},16:function(e,t,a){},17:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),o=a(4),c=a.n(o),l=(a(13),a(7)),s=a(1),i=a.n(s),u=a(2),m=a(5),p=(a(16),a(6)),d=a.n(p),f=function(){var e=m.IDB.init("TodoDataBase",1,{name:"Todo",options:{keyPath:"id"}}).objectStores.Todo,t=r.a.useState({newTodo:""}),a=Object(u.a)(t,2),n=a[0],o=a[1],c=r.a.useState([]),s=Object(u.a)(c,2),p=s[0],f=s[1],h=function(){var t;return i.a.async((function(a){for(;;)switch(a.prev=a.next){case 0:return a.next=2,i.a.awrap(e.entries());case 2:t=a.sent,f(t.reverse());case 4:case"end":return a.stop()}}))};return r.a.useEffect((function(){h()})),r.a.createElement("body",null,r.a.createElement("section",{className:"todoapp"},r.a.createElement("header",{className:"header"},r.a.createElement("img",{src:d.a,className:"intro",alt:"how it's works"}),r.a.createElement("p",{className:"intro__text"},"A simple example in order to interact with ",r.a.createElement("a",{href:"https://tajpouria.github.io/idborm/"},"idborm")," API on"," ",r.a.createElement("b",null,"Application")," and\xa0",r.a.createElement("b",null,"serviceworker"),"; obviously no body use this pattern in real world applications!!"),r.a.createElement("hr",null),r.a.createElement("input",{name:"newTodo",value:n.newTodo,onChange:function(e){return o({newTodo:e.target.value})},onKeyDown:function(e){return i.a.async((function(t){for(;;)switch(t.prev=t.next){case 0:if(13!==e.keyCode||!n.newTodo){t.next=6;break}return t.next=3,i.a.awrap(fetch("ADD_TODO",{method:"POST",body:n.newTodo}));case 3:return t.next=5,i.a.awrap(h());case 5:o({newTodo:""});case 6:case"end":return t.stop()}}))},className:"new-todo",placeholder:"What needs to be done?"})),r.a.createElement("section",{className:"main"},r.a.createElement("input",{id:"toggle-all",className:"toggle-all",type:"checkbox"}),r.a.createElement("label",{htmlFor:"toggle-all"},"Mark all as complete"),r.a.createElement("ul",{className:"todo-list"},p.length?p.map((function(t){var a=Object(u.a)(t,2),n=a[0],o=a[1];return r.a.createElement("li",{key:n},r.a.createElement("div",{className:"view"},r.a.createElement("input",{className:"toggle",type:"checkbox",checked:o.completed,onClick:function(){var t;return i.a.async((function(a){for(;;)switch(a.prev=a.next){case 0:return a.next=2,i.a.awrap(e.get(n));case 2:return t=a.sent,a.next=5,i.a.awrap(e.put(Object(l.a)({},t,{completed:!t.completed})));case 5:return a.next=7,i.a.awrap(h());case 7:case"end":return a.stop()}}))}}),r.a.createElement("label",null,o.content),r.a.createElement("button",{className:"destroy",onClick:function(){return i.a.async((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,i.a.awrap(e.delete(n));case 2:return t.next=4,i.a.awrap(h());case 4:case"end":return t.stop()}}))}})))})):null)),r.a.createElement("footer",{className:"footer"},r.a.createElement("span",{className:"todo-count"}),r.a.createElement("button",{className:"clear-completed",onClick:function(){return i.a.async((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,i.a.awrap(e.iterate((function(t){var a=Object(u.a)(t,2),n=a[0];if(a[1].completed)return e.delete(n)})));case 2:return t.next=4,i.a.awrap(h());case 4:case"end":return t.stop()}}))}},"Clear completed"))),r.a.createElement("footer",{className:"info"},r.a.createElement("p",null,"A simple ",r.a.createElement("a",{href:"https://github.com/tajpouria/idborm"},"idborm")," example by",r.a.createElement("a",{href:"https://github.com/tajpouria"}," Pouria Tajdivand")),r.a.createElement("p",null,"Extended from ",r.a.createElement("a",{href:"http://todomvc.com"},"TodoMVC"))))};c.a.render(r.a.createElement(f,null),document.getElementById("root"))},6:function(e,t,a){e.exports=a.p+"static/media/idbormReactTodoIntro.f2ee8f19.png"},8:function(e,t,a){e.exports=a(17)}},[[8,1,2]]]);
//# sourceMappingURL=main.6de156fd.chunk.js.map