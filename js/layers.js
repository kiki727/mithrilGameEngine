'use strict';

const screen = document.getElementById('frame');

let layers = [
  'layer layer-1',
  'layer layer-2',
  'layer layer-info',
  'layer layer-objects'
];

let objects = [
  {"type":"obj","id":"a-1","status":"alive","move": false,
  "class":"asteroid-1","pos":{"x": 150,"y": 250}},
  {"type":"obj","id":"a-2","status":"alive","move":"circle","mparams":"asteroid-1","class":"asteroid-2","pos":{"x": 280,"y": 250}},
  {"type":"ship","id":"enemy","class":"enemy-ship","side":"enemy",
  "pos":{"x": 150, "y": 30},"status":"alive","colision":false,"explosion":"enemy-explosion"},
  {"type":"ship","id":"friend","class":"ship","side":"friend",
  "pos":{"x": 170, "y": 500},"status":"alive","colision":false,"explosion":"ship-explosion"},
];

function createObjects(){
  return objects.map(function(item){

      if(item["type"] === "obj"){
        return m(objComponent,{key:item.id,id:item.id,class: item.class,pos: item.pos, move:item.move,mparams: item.mparams})
      }

      if(item["type"] === "ship"){
        return m(shipComponent,
                  {
                    key: item.id,
                    id:item.id,
                    cls:item.class, 
                    pos:item.pos, 
                    side:item["side"]
                  });
      }

      
      if( item["type"] === "laser"){
        return m(laserComponent,{
          key: item.id,
          id: item.id,
          class: item.class
        })
      }
      

  })
};

function layer() {
  return {
    view: vnode => {
      return m(
        'div',
        {
          'class': vnode.attrs.class,
          'data-fps': vnode.attrs.fps
        },
        vnode.children
      );
    }
  };
};

function frame() {

  let start = false;
  const times = [];
  let fps = 0;

  function Start(){
      start = !start;
  };

  function FPS(){
    const now = performance.now();
    while (times.length > 0 && times[0] <= now - 1000) {
        times.shift();
    }
    times.push(now);
    fps = times.length;
  }


  return {
    oninit: vnode => {
      // exit game on esc
        document.body.onkeyup = function(e) {
            if (e.keyCode === 27){
                Start();
                fps = 0; 
            }
        }
    },
    oncreate: vnode => {
      
    },
    onupdate: vnode => {

      if (start) {
    // loop start.........
      FPS();// measure fps
      runColisionDetect()
      vnode.dom.click();// loop again
    // end loop................
      }
    },
    view: vnode => {
      return m('div#game-container', {
          onclick:(e)=>{
              e.preventDefault;
          }
      }, [
        m(layer, { class: layers[0] }),

        m(layer, { class: layers[1] }),

        m(layer,{class: layers[2]},
        [
            m(showFps(fps)),
            m(startBtn,{gstart:start,fnStart:Start})
        ] ),

        m(layer, { class: layers[3] },
          start ? createObjects() : null
        )

      ]);
    }
  };
}

m.mount(screen, frame);
