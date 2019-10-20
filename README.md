# geMithril
### Mithril as game engine experiment

Main idea is to use master component,
and to run loop in it.

``` javasript
function MasterComponent(){
      return {
      onupdate:(vnode)=>{
        vnode.dom.onclick();// loop
      },
      view:(vnode)=>{
        return m("div.master",{
          onclick:(e)=>{ console.log("loop") }
         },
         [
          Game Objects ...
         ])
}
```
This is not canvas based engine, but dom based.
I use css to run sprites.

I find that most perfomant expensive operation is to remove "dead" nodes.

I build code on fly, try to not optimize nothing, and i write code <br/>
 sloppy (to simulate som load,and bad optimization)... I get average 60fps.

Just download code, and run in browser to see performance...
