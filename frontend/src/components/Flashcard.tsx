// import React, { useState } from 'react';
// import { useSpring, animated } from 'react-spring';
// import { Button, Card, CardContent, Typography, Stack } from '@mui/material';
// import { useSwipeable } from 'react-swipeable';

// interface FlashcardProps {
//   term: string;
//   definition: string;
//   index: number;
//   total: number;
//   onCorrect: () => void;
//   onIncorrect: () => void;
// }

// const Flashcard: React.FC<FlashcardProps> = ({
//   term,
//   definition,
//   index,
//   total,
//   onCorrect,
//   onIncorrect
// }) => {
//   const [flipped, setFlipped] = useState(false);

//   const { transform, opacity } = useSpring({
//     opacity: flipped ? 0 : 1,
//     transform: `perspective(600px) rotateX(${flipped ? 180 : 0}deg)`,
//     config: { mass: 5, tension: 500, friction: 80 },
//   });

//   const handlers = useSwipeable({
//     onSwipedLeft: () => onIncorrect(),
//     onSwipedRight: () => onCorrect(),
//   });

//   return (
//     <Card {...handlers} sx={{ width: 300, height: 200, perspective: 1000 }}>
//       <animated.div
//         style={{
//           position: 'absolute',
//           width: '100%',
//           height: '100%',
//           willChange: 'transform, opacity',
//           transform,
//           opacity: opacity.interpolate(o => 1 - o),
//           backgroundColor: 'white',
//           cursor: 'pointer',
//         }}
//         onClick={() => setFlipped(state => !state)}
//       >
//         <CardContent>
//           <Typography gutterBottom variant="h5" component="div">
//             {term}
//           </Typography>
//         </CardContent>
//       </animated.div>
//       <animated.div
//         style={{
//           position: 'absolute',
//           width: '100%',
//           height: '100%',
//           willChange: 'transform, opacity',
//           transform,
//           opacity,
//           // rotateX: '180deg',
//           backgroundColor: 'white',
//           cursor: 'pointer',
//         }}
//         onClick={() => setFlipped(state => !state)}
//       >
//         <CardContent>
//           <Typography gutterBottom variant="h5" component="div">
//             {definition}
//           </Typography>
//         </CardContent>
//       </animated.div>
//       <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 14 }}>
//         <Button variant="outlined" color="success" onClick={onCorrect}>
//           Correct
//         </Button>
//         <Button variant="outlined" color="error" onClick={onIncorrect}>
//           Incorrect
//         </Button>
//       </Stack>
//       <Typography sx={{ position: 'absolute', right: 16, bottom: 16 }}>
//         {`${index + 1}/${total}`}
//       </Typography>
//     </Card>
//   );
// };

// export default Flashcard;
