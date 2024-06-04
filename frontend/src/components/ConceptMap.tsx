import { Button } from '@mui/material';
import React, { useState } from 'react';
import { TextField } from '@mui/material';
import Dagre from '@dagrejs/dagre';
import { useCallback } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  Panel,
  useNodesState,
  useEdgesState,
  useReactFlow,
} from 'reactflow';

import { initialNodes, initialEdges } from '../nodes-edges.js';
import 'reactflow/dist/style.css';
import { forceSimulation, forceLink, forceManyBody, forceX, forceY } from 'd3-force';
import { useEffect, useLayoutEffect, useMemo } from 'react';


// import 'reactflow/dist/style.css';

// const simulation = forceSimulation()
//     .force('charge', forceManyBody().strength(-1000))
//     .force('x', forceX().x(0).strength(0.05))
//     .force('y', forceY().y(0).strength(0.05))
//     .force('collide', collide())
//     .alphaTarget(0.05)
//     .stop();

// const useLayoutedElements = () => {
//     const { getNodes, setNodes, getEdges, fitView } = useReactFlow();
//     const initialised = useStore((store) =>
//         [...store.nodeInternals.values()].every((node) => node.width && node.height)
//     );

//     return useMemo(() => {
//         let nodes = getNodes().map((node) => ({ ...node, x: node.position.x, y: node.position.y }));
//         let edges = getEdges().map((edge) => edge);
//         let running = false;

//         // If React Flow hasn't initialised our nodes with a width and height yet, or
//         // if there are no nodes in the flow, then we can't run the simulation!
//         if (!initialised || nodes.length === 0) return [false, {}];

//         simulation.nodes(nodes).force(
//             'link',
//             forceLink(edges)
//                 .id((d) => d.id)
//                 .strength(0.05)
//                 .distance(100)
//         );

//         // The tick function is called every animation frame while the simulation is
//         // running and progresses the simulation one step forward each time.
//         const tick = () => {
//             getNodes().forEach((node, i) => {
//                 const dragging = Boolean(document.querySelector(`[data-id="${node.id}"].dragging`));

//                 // Setting the fx/fy properties of a node tells the simulation to "fix"
//                 // the node at that position and ignore any forces that would normally
//                 // cause it to move.
//                 nodes[i].fx = dragging ? node.position.x : null;
//                 nodes[i].fy = dragging ? node.position.y : null;
//             });

//             simulation.tick();
//             setNodes(nodes.map((node) => ({ ...node, position: { x: node.x, y: node.y } })));

//             window.requestAnimationFrame(() => {
//                 // Give React and React Flow a chance to update and render the new node
//                 // positions before we fit the viewport to the new layout.
//                 fitView();

//                 // If the simulation hasn't be stopped, schedule another tick.
//                 if (running) tick();
//             });
//         };

//         const toggle = () => {
//             running = !running;
//             running && window.requestAnimationFrame(tick);
//         };

//         const isRunning = () => running;

//         return [true, { toggle, isRunning }];
//     }, [initialised]);
// };


const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

const getLayoutedElements = (nodes, edges, options) => {
  g.setGraph({ rankdir: options.direction });

  edges.forEach((edge) => g.setEdge(edge.source, edge.target));
  nodes.forEach((node) => g.setNode(node.id, node));

  Dagre.layout(g);

  return {
    nodes: nodes.map((node) => {
      const position = g.node(node.id);
      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      const x = position.x - node.width / 2;
      const y = position.y - node.height / 2;

      return { ...node, position: { x, y } };
    }),
    edges,
  };
};

const LayoutFlow = () => {
    const { fitView } = useReactFlow();
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [inputValue, setInputValue] = useState('ww2');
    const [responseData, setResponseData] = useState<any>(null);


    const onLayout = useCallback(
      (direction) => {
        const layouted = getLayoutedElements(nodes, edges, { direction });
  
        setNodes([...layouted.nodes]);
        setEdges([...layouted.edges]);
  
        window.requestAnimationFrame(() => {
          fitView();
        });
      },
      [nodes, edges],
    );


    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/conceptmap?topic=${inputValue}`);
            const obj = await response.json();
           
            // find the max length of all arrays in obj.aspects.items
            let maxLength = 0;
            obj.aspects.forEach((aspect) => {
                if (aspect.items.length > maxLength) {
                    maxLength = aspect.items.length;
                }
            });

            let new_nodes = []
            let new_edges = []

            // // create initial node
            let initial = {
                id : '0',
                type: "input",
                data: { label: obj['name']},//resp['name'] },
                position: { x: (obj.aspects.length*100-50), y: 0 },
            }

            new_nodes.push(initial);
            let childIndex = 0;
            

        

        //   const children = obj.aspects.map((aspect: any, idx) => ());
            let child_ids = []
            // loop over obj.aspects.items
            // create nodes for each item
            // create edges between aspect and item
            obj.aspects.forEach((child,idx) => {

                // create group
                let groupId = ""+Math.floor(Math.random() * 9999999);
                child_ids.push(groupId);
                let group = 
                {
                    id: groupId  ,          
                    data: { label: child.name },
                    position: { x: idx*250, y: 100 },
                    draggable: false,
                    style: { backgroundColor: 'rgba(100, 100, 100, 0.2)', width: 200, height: maxLength*75 },
                }
                new_nodes.push(group);

                child.items.forEach((item: any, idx) => {
                    console.log(item);
                    let grandchild = {
                        parentId: groupId,
                        extent: 'parent',
                            id: ""+Math.floor(Math.random() * 9999999),     
                            data: { label: item },
                            type: "default",
                            draggable: false,
                            position: { x: 20, y: 40+idx*65 },
                            // style:{
                            //     .react-flow__handle {
                            //         opacity: 0;
                            //       }"
                            // }
                        
                    }
                    new_nodes.push(grandchild);

                
                });


                // new_nodes.push(child);
                // new_edges.push({ id: `e${childIndex}`, source: '0', target: ""+child.id, animated: true });
                // childIndex++;
            });




            // // create edges between initial node and children
            child_ids.forEach((child) => {
                new_edges.push({ id: `e${childIndex}`, source: '0', target: ""+child, animated: true });
                childIndex++;
            });

            //{ id: 'e12', source: '1', target: '2', animated: true }
            // console.log(new_edges)
            setNodes(new_nodes);
            setEdges(new_edges);
            
            // // Loop over "aspects" key in json response, 
            // // and create nodes and edges from the data
          


            // setResponseData(data);

            // toggle();
        } catch (error) {
            console.error('Error:', error);
        }
    };
    return (

        <div style={{ paddingTop: '64px', height: 800, width: 1200 }} >


            

                    <TextField value={inputValue} onChange={handleInputChange} />
            <Button variant="outlined" onClick={handleSubmit}>Submit</Button>
                    <br></br><br></br><br></br>
            {responseData && <pre>{JSON.stringify(responseData, null, 2)}</pre>}

            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
            >
                 <Panel position="top-right">
            {/* <Button variant="outlined" onClick={() => onLayout('TB')}>TB</Button>
            <Button variant="outlined" onClick={() => onLayout('LR')}>LR</Button> */}
      </Panel>
            </ReactFlow>
        </div>
    );
};


export default function ConceptMap() {
    return (
      <ReactFlowProvider>
        <LayoutFlow />
      </ReactFlowProvider>
    );
  }

