// import { forceSimulation, forceLink, forceManyBody, forceX, forceY } from 'd3-force';
// import { Button } from '@mui/material';
// import React, { useMemo, useState } from 'react';
// import { TextField } from '@mui/material';
// import { collide } from '../collide.js';

// import Dagre from '@dagrejs/dagre';
// import ReactFlow, {
//   ReactFlowProvider,
//   useNodesState,
//   useEdgesState,
//   Panel,
//   useReactFlow,
//   useStore,
// } from 'reactflow';

// import 'reactflow/dist/style.css';
// import { AuthProps } from '../models';
// import { getEnv } from '../utils/EnvUtil';
// const BACKEND_URL = getEnv('VITE_BACKEND_URL');

// import 'reactflow/dist/style.css';

// const simulation = forceSimulation()
//   .force('charge', forceManyBody().strength(-1000))
//   .force('x', forceX().x(0).strength(0.05))
//   .force('y', forceY().y(0).strength(0.05))
//   .force('collide', collide())
//   .alphaTarget(0.05)
//   .stop();

// const useLayoutedElements = () => {
//   const { getNodes, setNodes, getEdges, fitView } = useReactFlow();
//   const initialised = useStore((store) =>
//     [...store.nodeInternals.values()].every((node) => node.width && node.height)
//   );

//   return useMemo(() => {
//     let nodes = getNodes().map((node) => ({ ...node, x: node.position.x, y: node.position.y }));
//     let edges = getEdges().map((edge) => edge);
//     let running = false;

//     // If React Flow hasn't initialised our nodes with a width and height yet, or
//     // if there are no nodes in the flow, then we can't run the simulation!
//     if (!initialised || nodes.length === 0) return [false, {}];

//     simulation.nodes(nodes).force(
//       'link',
//       forceLink(edges)
//         .id((d) => d.id)
//         .strength(0.05)
//         .distance(100)
//     );

//     // The tick function is called every animation frame while the simulation is
//     // running and progresses the simulation one step forward each time.
//     const tick = () => {
//       getNodes().forEach((node, i) => {
//         const dragging = Boolean(document.querySelector(`[data-id="${node.id}"].dragging`));

//         // Setting the fx/fy properties of a node tells the simulation to "fix"
//         // the node at that position and ignore any forces that would normally
//         // cause it to move.
//         nodes[i].fx = dragging ? node.position.x : null;
//         nodes[i].fy = dragging ? node.position.y : null;
//       });

//       simulation.tick();
//       setNodes(nodes.map((node) => ({ ...node, position: { x: node.x, y: node.y } })));

//       window.requestAnimationFrame(() => {
//         // Give React and React Flow a chance to update and render the new node
//         // positions before we fit the viewport to the new layout.
//         fitView();

//         // If the simulation hasn't be stopped, schedule another tick.
//         if (running) tick();
//       });
//     };

//     const toggle = () => {
//       running = !running;
//       running && window.requestAnimationFrame(tick);
//     };

//     const isRunning = () => running;

//     return [true, { toggle, isRunning }];
//   }, [initialised]);
// };








// function ConceptMapv2Inner(props) {
//   const { fitView } = useReactFlow();
//   const [nodes, setNodes, onNodesChange] = useNodesState([]);
//   const [edges, setEdges, onEdgesChange] = useEdgesState([]);
//   const [inputValue, setInputValue] = useState('ww2');
//   const [responseData, _setResponseData] = useState<any>(null);
//   const [initialised, { toggle, isRunning }] = useLayoutedElements();

//   const colors = [
//     '#D98880',
//     '#C39BD3',
//     '#7FB3D5',
//     '#76D7C4',
//     '#7DCEA0',
//     '#F7DC6F',
//     '#F0B27A',
//     '#BFC9CA',
//     '#808B96'
//   ];

//   const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setInputValue(event.target.value);
//   };

//   const handleSubmit = async () => {
//     try {
//       const response = await fetch(BACKEND_URL + `/api/megadump?topic=${inputValue}`
//       );
//       const obj = await response.json();

//       // find the max length of all arrays in obj.aspects.items
//       let new_nodes: any = []
//       let new_edges: any = []
//       let cat_map = {}


//       // // create initial node
//       let lookup = {}

//       let num = 0
//       let col = 0
//       obj.entities.forEach((entity: any) => {


//         if (cat_map[entity.category] == null){
//           col = colors[Object.keys(cat_map).length % colors.length]
//           cat_map[entity.category] = col
//         }
//         console.log(col)

//         let id = "" + Math.floor(Math.random() * 9999999);
//         entity.id = id;
//         lookup[entity.name] = entity;
//         let newNode = {
//           id: id,
//           type: "default",
//           data: { label: entity.name },
//           style:{background: col},
//           position: { x: num * 10, y: num * 10 },
//         };
//         new_nodes.push(newNode);
//         num = num + 1;
//       });

//       let edgeId = 0;
//       obj.relationships.forEach((relationship: any) => {

//         if (lookup[relationship.source_entity] != null && lookup[relationship.target_entity] != null) {

//           let src = lookup[relationship.source_entity].id;
//           let dest = lookup[relationship.target_entity].id;

//           new_edges.push({ id: `e${edgeId}`, source: src, target: dest, animated: true, label: relationship.label } );
//           edgeId++;
//         }
//         else {
//           console.log("Null found: " + relationship.source_entity + " " + relationship.target_entity);
//         }
//       });



//       // let child_ids: any = []
//       // obj.aspects.forEach((child: any, idx: any) => {

//       //   // create group
//       //   let groupId = "" + Math.floor(Math.random() * 9999999);
//       //   child_ids.push(groupId);
//       //   let group =
//       //   {
//       //     id: groupId,
//       //     data: { label: child.name },
//       //     position: { x: idx * 250, y: 100 },
//       //     draggable: false,
//       //     style: { backgroundColor: 'rgba(100, 100, 100, 0.2)', width: 200, height: maxLength * 75 },
//       //   }
//       //   new_nodes.push(group);

//       //   child.items.forEach((item: any, idx: any) => {
//       //     console.log(item);
//       //     let grandchild = {


//       //       id: "" + Math.floor(Math.random() * 9999999),
//       //       data: { label: item },
//       //       type: "default",
//       //       draggable: false,
//       //       position: { x: 0, y: 0 },
//       //     }
//       //     new_nodes.push(grandchild);


//       //   });
//       // });




//       // // // create edges between initial node and children


//       setNodes(new_nodes);
//       setEdges(new_edges);

//       // toggle();
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };
//   return (



//     <>

//       <TextField value={inputValue} onChange={handleInputChange} />
//       <Button variant="outlined" onClick={handleSubmit}>Submit</Button>
//       <br></br><br></br><br></br>
//       {responseData && <pre>{JSON.stringify(responseData, null, 2)}</pre>}

//       <ReactFlow
//         nodes={nodes}
//         edges={edges}
//         onNodesChange={onNodesChange}
//         onEdgesChange={onEdgesChange}
//       >

//         <Panel>
//           {initialised && (
//             <Button variant="outlined" onClick={toggle}>{isRunning() ? 'Stop' : 'Start'} force simulation</Button>

//           )}
//         </Panel>


//       </ReactFlow>
//     </>
//   );
// };


// export default function ConceptMapv2(props) {
//   return (
//     <div style={{ paddingTop: '84px', height: 800, width: 1200 }} >

//       <ReactFlowProvider>
//         <ConceptMapv2Inner {...props} />
//       </ReactFlowProvider>
//     </div>
//   );
// }