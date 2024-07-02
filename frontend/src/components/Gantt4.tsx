// import { useEffect, useRef, useState } from 'react';
// import mermaid from 'mermaid';

// const GanttChart = () => {
//     const [input, _setInput] = useState(`gantt
//     title A Gantt Diagram
//     dateFormat YYYY-MM-DD
//     section Section
//         A task          :a1, 2014-01-01, 30d
//         Another task    :after a1, 20d
//     section Another
//         Task in Another :2014-01-12, 12d
//         another task    :24d
//     `);
//     const [svgCode, setSvgCode] = useState('');
//     const outputRef = useRef(null);

//     const renderDiagram = async () => {
//         if (input) {
//             try {
//                 const { svg } = await mermaid.render("theGraph", input);
//                 setSvgCode(svg);
//             } catch (error) {
//                 setSvgCode("Invalid syntax");
//             }
//         }
//     }

//     useEffect(() => {
//         mermaid.initialize({ startOnLoad: true, theme: 'dark' });
//         renderDiagram();
//     }, [input]);

//     return (
//         <div style={{ backgroundColor: 'black', marginTop: 200, width: 500 }}>
//             <div ref={outputRef} style={{width: 500}}dangerouslySetInnerHTML={{ __html: svgCode }} />
//         </div>
//     );
// }

// export default GanttChart;


