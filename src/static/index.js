// import { wall_img, player_img, space_img, box_img } from "./assets_loader.js";
import {
  draw_map_element,
  draw_node_id,
  draw_map_element_arc,
} from "./drawer.js";

const step_x = 50,step_y =50


function create_canvas(height,width) {
  const container = document.getElementById("canvas_container")
  // remove old canvas
  container.innerHTML = ""


  var canvas_back = document.createElement("canvas");
  canvas_back.setAttribute("width", width);
  canvas_back.setAttribute("height", height);
  canvas_back.setAttribute("class", "back_canv");
  container.appendChild(canvas_back);
  var ctx_back = canvas_back.getContext("2d");
  
  var canvas_nodes = document.createElement("canvas");
  canvas_nodes.setAttribute("width", width);
  canvas_nodes.setAttribute("height", height);
  container.appendChild(canvas_nodes);
  var ctx_nodes = canvas_nodes.getContext("2d");
  
  var canvas_path = document.createElement("canvas");
  canvas_path.setAttribute("width", width);
  canvas_path.setAttribute("height", height);
  container.appendChild(canvas_path);
  canvas_path.setAttribute("class", "back_canv");
  var ctx_path = canvas_path.getContext("2d");

  return [ctx_back,ctx_nodes,ctx_path]
}



const options = {
  draw_wall: false,
  draw_target: false,
  draw_player: false,
  draw_ids: false,
};

const element_types = {
  WALL: "WALL",
  PLAYER: "PLAYER",
  TRAGET: "TRAGET",
  EMPTY: "EMPTY",
};


// const map_data = fetch("http://127.0.0.1:5000/map").then((response) =>
//   response.json()
// );

// map_data.then(async (map_data) => {
//   draw_map(map_data,options)
//   const [step_x, step_y] = step_map(map_data);

//   async function draw_routes(node_id,last_draw) {
//     const res = await fetch(`http://127.0.0.1:5000/map/path?from=${node_id}`);

//     const routes = await res.json();
//     for (node_id in routes) {
//       let element = element_types.TRAGET;
//       if (parseInt(node_id) === last_draw){
//         element = element_types.PLAYER
//       }
//       const route = routes[node_id];
//       route.forEach((point) => {
//         const x = point.location.x * step_x
//         const y = point.location.y * step_y
//         draw_map_element(x,y,step_x,step_y,element,ctx)
//     })

//       };
//     }

//   for (let i = 0; i < test_expantion.length; i++) {
//     const p = get_point_by_node_id(map_data,test_expantion[i])
//     const x = p.location.x * step_x
//     const y = p.location.y * step_y
//     let last_draw = NaN
//     if (i>0)
//       last_draw = test_expantion[i-1]
//     setTimeout(async ()=>{
//     draw_map_element(x, y, step_x, step_y,element_types.PLAYER,ctx)
//     await draw_routes(test_expantion[i],last_draw);

//     },800*i)
//   }

//   test_expantion.forEach(async (node_id)=>{
//   })

// });

function get_point_by_node_id(maze_map, node_id) {
  const points = maze_map.map;
  for (let p in points) {
    const id = parseInt(points[p].node_id);
    if (id == node_id) {
      return points[p];
    }
  }
}
function draw_path(map_data, points, canv) {
  points.forEach((point) => {
    draw_map_element_arc(
      point.location.x,
      point.location.y,
      step_x,
      step_y,
      element_types.PLAYER,
      canv
    );
  });
}


function draw_map(map_data, options,canv) {
  const points = map_data.map;
  points.forEach((point) => {
    
    
    let element = point.content;
    if (element == element_types.WALL) {
      element = options.draw_wall ? element : element_types.EMPTY;
    } else if (element == element_types.TRAGET) {
      element = options.draw_target ? element : element_types.EMPTY;
    } else if (element == element_types.PLAYER) {
      element = options.draw_player ? element : element_types.EMPTY;
    }
    if (options.draw_player || options.draw_target || options.draw_player)
    draw_map_element(
      point.location.x,
      point.location.y,
      step_x,
      step_y,
      element,
      canv
    );

    if (options.draw_ids)
      if (point.node_id != null) {
        draw_node_id(
          point.location.x,
          point.location.y,
          point.node_id,
          step_x, step_y,
          canv
        );
      }
  });
}

function draw() {
  // ctx.clearRect(0, 0, canvas.width, canvas.height);
  // draw_element(0, 0,"wall");
  // points.forEach(element => {
  //
  // });
  requestAnimationFrame(draw);
}

// draw_element(50, 50, "wall", ctx);
// draw();

// function wipe_all(canvas_list,height,width) {
//   canvas_list.forEach(canv => {
//     canv.clearRect(0, 0, height, width);
//   })  
// }


async function main() {
  const selector = document.getElementById("map_selector");
  const map_id = selector[selector.selectedIndex].value;
  const map_data = await fetch(`http://127.0.0.1:5000/map/${map_id}`).then((res) =>
    res.json()
  );

  const [ctx_back,ctx_nodes,ctx_path] = create_canvas(map_data.height*step_y,map_data.width*step_x)


  const options = {
  draw_wall: true,
  draw_target: true,
  draw_player: true,
  draw_ids: false,
  
  };
  
  // draw_map(map_data, { draw_wall: true }, ctx_back);
  
  draw_map(map_data, options, ctx_back);
  
  // draw_ids
  draw_map(map_data, {draw_ids: true}, ctx_nodes);
  
  const sol_data = await fetch(
    `http://127.0.0.1:5000/map/${map_id}/sol`
  ).then((res) => res.json());
  draw_path(map_data, sol_data, ctx_path);
}

const selector = document.getElementById("map_selector");
selector.addEventListener("change", () => {
  main();
});
main();
