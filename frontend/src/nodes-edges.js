export const initialNodes = [
    {
      id: '1',
      type: 'input',
      data: { label: 'input' },
      position: { x: 0, y: 0 },
    },
    {
        id: '2asdf',
        data: { label: 'Group A' },
        position: { x: 100, y: 100 },
        className: 'light',
        style: { backgroundColor: 'rgba(255, 0, 0, 0.2)', width: 200, height: 200 },
      },

    {
      id: '2',
      parentId: '2asdf',
      extent: 'parent',
      data: { label: 'node 2\n \nasdf' },
      position: { x: 0, y: 100 },
    },

   


    {
      id: '2a',
      data: { label: 'node 2a' },
      position: { x: 0, y: 200 },
    },
    {
      id: '2b',
      data: { label: 'node 2b' },
      position: { x: 0, y: 300 },
    },
    {
      id: '2c',
      data: { label: 'node 2c' },
      position: { x: 0, y: 400 },
    },
    {
      id: '2d',
      data: { label: 'node 2d' },
      position: { x: 0, y: 500 },
    },
    {
      id: '3',
      data: { label: 'node 3' },
      position: { x: 200, y: 100 },
    },
  ];
  
  export const initialEdges = [
    { id: 'e12', source: '1', target: '2', animated: true },
    { id: 'e13', source: '1', target: '3', animated: true },
    { id: 'e22a', source: '2', target: '2a', animated: true },
    { id: 'e22b', source: '2', target: '2b', animated: true },
    { id: 'e22c', source: '2', target: '2c', animated: true },
    { id: 'e2c2d', source: '2c', target: '2d', animated: true },
  ];
  