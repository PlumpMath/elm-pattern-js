let React = require('react')
    , Mousetrap = require('mousetrap')
    , Rx = require('rx'),
    O = Rx.Observable;

/*
 * helpers
 * */

function bindKey(key) {
    let sub = new Rx.Subject();
    Mousetrap.bind(key, () => {
        sub.onNext(key);
    });
    return sub;
}
/*
 * model
 * */


/*
 * initial state
 * */

let initialState = {
    data: {
        nodes: [
            {x: 100, y: 200}
            , {x: 200, y: 200}
            , {x: 100, y: 500}
        ]
        , relationships: []
    }
}


/*
 * inputs
 * */

let tickStream = O.interval(33);

let spaceStream = bindKey('space').buffer(O.interval(33))


/*
 * update
 * */
let stateStream = O.zipArray(tickStream,spaceStream).scan(initialState, function (acc, [state,space]) {

    if(space[0] === 'space'){
        acc.data.nodes.push({x:Math.random()*500,y:Math.random()*500})
    }

    return acc;
})


/*
 * render
 * */


function makeElement(node) {
    return React.DOM.div({
        className: node.id,
        style: {
            position: "absolute",
            backgroundColor: "#ff0000",
            width: "100px", height: "100px",
            left: Math.floor(node.x + (node.baseX || 0)) + "px",
            top: Math.floor(node.y + (node.baseY || 0)) + "px"
        }
    });
}
const canvas = document.getElementById("canvas");

function render(state) {
    let data = state[0];
    return React.render(
        React.DOM.div(null, data.data.nodes.map(makeElement)),
        canvas
    );

}

/*
 * runner
 * */

O.zipArray(stateStream)
    //.take(1)
    .subscribe(render)