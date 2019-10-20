'use strict'

function showFps(fps){
    return {
        view:(vnode)=>{
            return m("p",{
                style: {
                    "position": 'absolute',
                    "top": '-5px',
                    "left": '10px'
                  }
                },`fps: ${fps}`)
            }
    }
};

function startBtn(){
    return {
        view:(vnode)=>{
            return m("p",{
                style: {
                    "display": vnode.attrs.gstart ? "none" : "block",
                    "position": 'absolute',
                    "font-family":"digitalbold",
                    "font-size":"32px",
                    "left": "28%",
                    "top":"37%",
                    "color": "red",
                    "text-shadow": "0px 0px 5px #000",
                    "letter-spacing":"1px"
                  },
                  onmouseover:(e)=>{
                    e.currentTarget.style.cursor = "pointer"
                },
                onclick:vnode.attrs.fnStart
            }, "SpaceDuel - Start")
        }
    }
};

// objects in game... asteroids,planets ...
function objComponent(){
    let move = null;
    let mparams = null;
    let circle = null;

    return {
        oninit:(vnode)=>{
            if (vnode.attrs.move){
                move = vnode.attrs.move;
                mparams = vnode.attrs.mparams;
            }
        },
        oncreate:(vnode)=>{

            vnode.dom.style.left = vnode.attrs.pos["x"] + "px";
            vnode.dom.style.top = vnode.attrs.pos["y"] + "px";
            if(mparams){
                let sel = mparams;
                //console.log( sel )
                circle = new Orbit(sel,vnode.dom)
            }
        },
        onupdate:(vnode)=>{
            if ( move ){
                circle.orbit();
            }
        },
        view:(vnode)=>{
            return m("div",{
                class: vnode.attrs.class,
                id: vnode.attrs.id
            })
        }
    }
};

/* circle-Orbit  move */
function Orbit(centerEl, targetEl){

    this.el = targetEl;
    this.celem = document.getElementsByClassName(centerEl)[0];

    this.centerx = parseInt(this.celem.style.left)+36;
    this.centery = parseInt(this.celem.style.top) +12;
    this.angle = 0;
}

Orbit.prototype.orbit = function(){
    if ( this.angle > 360 ) {
        this.angle = 0;
    } else { this.angle = this.angle + .0045;}

    let newLeft = this.centerx + Math.cos(this.angle) * 120 ;
    let newTop = this.centery + Math.sin(this.angle) * 90 ;

    this.el.style.left = newLeft + "px";
    this.el.style.top = newTop + "px";
}

/*
ship object
===========================   */
let Ship = function( id, side, elem ){
    this.id = id;// "id"

    this.side = side; // enemy / friend
    this.el = elem;
    this.w = 0;
    this.h = 0;
    this.leftMin = 0;//x
    this.topMin = 0;//y
    this.leftMax = null;
    this.topMax = null;

    this.explosion = false;
    this.animationexplosion = null;

    this.weaponRecharge = null;
    this.weaponCnt = 0;

    this.weaponPoint = {"x":null, "y":null};

    this.enemyObj = null;
    this.enemyPos = {"x": null, "y":null};

    this.eIndex= null;

    this.getWeaponPosition = function(ele){
        this.weaponPoint["x"] = parseInt(ele.style.left) + (this.w / 2);
        if( this.side == "enemy") {
            this.weaponPoint["y"] = parseInt(ele.style.top) + this.h + 10;
        }
        if( this.side == "friend"){
            this.weaponPoint["y"] = parseInt(ele.style.top) - 17;
        }
    };

    this.setup = function(){
        let el = document.getElementById(this.id)

        this.w = el.offsetWidth;
        this.h = el.offsetHeight;
        let frame = document.querySelector("#game-container");
        this.leftMax = frame.offsetWidth - this.w;
        this.topMax = frame.offsetHeight - this.h;
    
        let s = this.side;
    
        this.eIndex = objects.findIndex(function(item){
            if( s !== item.side && item.side ){
                return item;
            }
        });

        this.setMinMax();
        //this.getWeaponPosition();

        if ( this.side == "enemy"){
            this.weaponRecharge = 35;
            this.animationexplosion = "enemyexplosion";
        }

        if ( this.side == "friend"){
            this.weaponRecharge = 103;
            this.animationexplosion = "shipexplosion";
        }

    };

    this.getEnemyPos = function(){
        //console.log( this.eIndex)
        let eclass = objects[this.eIndex]["class"].toString();
        this.enemyObj = document.querySelector("#friend");
        this.enemyPos["x"] = this.enemyObj.style.left;
        this.enemyPos["y"] = this.enemyObj.style.left;

        return this.enemyPos;
    };

    this.getFrameDim = function(){
        let frame = document.querySelector("#game-container");
        return {"x":frame.offsetWidth, "y":frame.offsetHeight }
    };

    this.setMinMax = function(){
        
        let frm = this.getFrameDim();

        let framew = frm["x"];//frame.offsetWidth;
        let frameh = frm["y"];//frame.offsetHeight;

        this.leftMax = framew - this.w;
        this.topMax = frameh - this.h;
    };




    this.shoot = function(){
        let lclass = null;
        let uid = null;
        let bounds = null;
        let lpos = this.weaponPoint;

        let directionY = null;

        let colision = false;

        if ( this.side == "enemy"){
            lclass ="enemy-laser";
            uid = "l"+uuid(8);// valid id must start with letter
            lpos = this.weaponPoint;
            directionY = 18;
            bounds = document.querySelector("#game-container").offsetHeight;
        };
        
        if ( this.side == "friend"){
            lclass ="friend-laser";
            uid = "l"+uuid(8);// valid id must start with letter
            lpos = this.weaponPoint;
            directionY = -8;
            bounds = 0;
        };
        
       let laserObj = {
           "type":"laser",
           "id":uid,
           "class": lclass,
           "pos": lpos, // start position eg weapon port
           "dir": directionY,
           "colision": colision,
           "bounds": bounds,
           "node": null
       };

       objects.push( laserObj );

    };



    this.weaponShoot = function(){
       // if ( this.side == "enemy"){
            if ( this.weaponCnt == this.weaponRecharge && !this.explosion){
                this.weaponCnt = 0;
                this.shoot();
            } else {
                this.weaponCnt = this.weaponCnt + 1;
            }
       // }
    };

    
    this.onColision = function(  arrEl, nod ){

        let col = arrEl["colision"];

        if( col ){
             nod.classList.add(arrEl["explosion"]) 
        }
    };

    this.respawnShip = function( arrEl, nod){
        let el = document.getElementById(nod);
        let spawnpos = arrEl["pos"];
        //console.log( spawnpos )
        el.style.left = spawnpos.x + "px";
        el.style.top = spawnpos.y +"px";
     
        arrEl["colision"] = false;
        el.classList.remove(arrEl["explosion"])
    };

};// endo of Ship




function laserComponent(){

    let data, pos, boundsy, curp, posy, p;

    function findelem(id){
        let eli = objects.findIndex(function(elem){
                return elem.id === id;
        })

        return eli
    };

    function getelem(id){
        let ind = findelem(id);
        return objects[ind]
    };

    return {
        oncreate:(vnode)=>{
           data = getelem(vnode.dom.id);

           vnode.dom.style.left = data["pos"]["x"] + "px";
           vnode.dom.style.top = data["pos"]["y"] + "px";

        },
        onupdate:(vnode)=>{
            curp = parseInt(vnode.dom.style.top);

            data = getelem(vnode.dom.id);
            //console.log(data)
            posy = curp + data["dir"];
            data["pos"]["y"] = posy;

            let col = data["colision"];

            vnode.dom.style.top = data["pos"]["y"] + "px";

            p = new Promise((resolve, reject)=>{

                if ( data["bounds"] > 0 ){
                    if( curp >= data["bounds"] ){
                        objects.splice(findelem(vnode.dom.id),1);
                        resolve('resplve 1')
                    }
                } else {
                    if( curp < data["bounds"]){
                        objects.splice(findelem(vnode.dom.id),1);
                        resolve('resolve 2')
                    }
                }

                if( col ){
                    objects.splice(findelem(vnode.dom.id),1);
                    resolve('resolve 3')
                }

            });

            p.then( (message)=>{ 
                vnode.dom.remove();
            });

        },
        view:(vnode)=>{
            return m("div",{
                id:vnode.attrs.id,
                class: vnode.attrs.class
            })
        }
    }
};




function shipComponent(){

    let side, elid, nclass, nside, el;
    let ship, shipClass;
    let data, o, normalmove;

    function findelem(id){
        let eli = objects.findIndex(function(elem){
                return elem.id === id;
        })

        return eli
    };

    function getelem(id){
        let ind = findelem(id);
        return objects[ind]
    };

    return {
        oninit:(vnode)=>{
            side = vnode.attrs.side;
            elid = vnode.attrs.id;
            nclass = vnode.attrs.class;
            nside = vnode.attrs.side;
            el = vnode.dom;

            shipClass = vnode.attrs.cls;

            ship = new Ship( nclass, nside, el);
            //console.log( vnode.attrs.id )
            

        },
        oncreate:(vnode)=>{

        o = getelem(vnode.dom.id);
        ship = new Ship( elid, nside, el);
        //console.log( vnode.attrs.id )
        vnode.dom.addEventListener("animationend", 
        (e)=> { 
            //console.log("animend: ", e.animationName )
            ship.respawnShip(o,vnode.dom.id)
        });
        
        vnode.dom.style.left = vnode.attrs.pos["x"] + "px";
        vnode.dom.style.top = vnode.attrs.pos["y"] + "px";
        ship.setup();
        ship.getWeaponPosition(vnode.dom);


        data= {"mintop": ship.topMin,"maxtop":ship.topMax,"maxleft":ship.leftMax,"minleft": ship.leftMin};


        

        },
        onupdate:(vnode)=>{
            o = getelem(vnode.dom.id);

            normalmove = true;

            let colision = o["colision"];
            
           if ( !colision ){
             // bote move...seek player position
             ship.getWeaponPosition(vnode.dom);
             ship.weaponShoot();


             if( side == "enemy") {

                let posLeft = parseInt( vnode.dom.style.left );

                let shots = objects.filter( (item)=>{
                        return item["class"] == "friend-laser";
                });

                //console.log( shots.length )
                if( shots.length > 0 ){
                    let posCenterLeft = posLeft + 25;
                    let posCenterTop = parseInt( vnode.dom.style.top) + 72;

                    for( var s=0; s<shots.length; s++){
                        let llaser = document.getElementById( shots[s]["id"] );
                        if ( llaser ){
                            let lx = parseInt(llaser.style.left);
                            let ly = parseInt(llaser.style.top);
                           
                            let dist = ly - posCenterTop;
                            if( dist < 50 ){
                                normalmove = false;
                                let toside = posCenterLeft - lx;
                                if ( toside < 50 ){
                                    vnode.dom.style.left= posLeft + 3 +"px";
                                }
                                if ( toside < -50 ){
                                    vnode.dom.style.left= posLeft - 3 +"px";
                                }
                                
                            } 
                        }

                    }
                    
                } 

                if( normalmove ) {
                    let playerLeft = parseInt(ship.getEnemyPos()["x"]);
                    //let posLeft = parseInt( vnode.dom.style.left );
                    if( posLeft != playerLeft ){
                        vnode.dom.style.left= ( posLeft > playerLeft) ? posLeft-2+"px":posLeft+2+"px"
                     }
                }

             }// side == enemy control
             // ship manual move
             if(side == "friend"){
                 //vnode.dom.style.borderColor = "yellow";
                 controlManual(vnode.dom,"W","S","A","D",data)
             }
           } 
           
           ship.onColision( o, vnode.dom);
           
            
        },
        view:(vnode)=>{
            return m("div",{
                id: vnode.attrs.id,
                class: vnode.attrs.cls,
                //side:vnode.attrs.side,
                style: vnode.attrs.style
            })
        }
    }
};


/* colision detection
=================================  */
/*
@param obj1 vnode,dom
@param obj2 class
*/
function runColisionDetect(){

        let len = objects.length;
        let i,f;
        let obja = {};
        let objb = {};
        for( i= 0; i < len; i++){
           // console.log( objects[i] )
           let aid = objects[i]["id"];
           let oa = document.querySelector(`#${aid}`);
           if(oa){
            obja.x = parseInt( oa.style.left );
            obja.y = parseInt( oa.style.top );
            obja.width = oa.offsetWidth;
            obja.height = oa.offsetHeight;
            obja.id = aid;
           }
           
           for( f=i+1; f < len; f++){
              let bid = objects[f]["id"];
              let ob = document.querySelector(`#${bid}`);
               if(ob){
                objb.x = parseInt( ob.style.left );
                objb.y = parseInt( ob.style.top );
                objb.width = ob.offsetWidth;
                objb.height = ob.offsetHeight;
                objb.id = bid;
               }
               colisionDetect(obja, objb)
           }
        }    
};

function colisionDetect( rect1, rect2){

    if (rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y) {
    // collision detected!
           // console.log( " colision detect", rect1.id, rect2.id)
        let detected = [ rect1.id, rect2.id ];

        for(var i=0; i<detected.length; i++){
            let el = objects.find( (el)=>{
                return (el.id == detected[i] ) ;
            })

           el["colision"] = true;
        }
    }
    
};

