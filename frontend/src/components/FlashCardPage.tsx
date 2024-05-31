

// import React, { useState } from 'react';
// import Flashcard from './Flashcard';
// const flashcards = [
//   { term: 'Entropy', definition: 'A measure of disorder or randomness.' },
//   { term: 'Osmosis', definition: 'The movement of a solvent through a semipermeable membrane.' },
//   // Add more flashcards here
// ];

// const FlashCardPage: React.FC = () => {
//   const [currentIndex, setCurrentIndex] = useState(0);

//   const handleCorrect = () => {
//     if (currentIndex < flashcards.length - 1) {
//       setCurrentIndex(currentIndex + 1);
//     } else {
//       alert('End of Flashcards');
//     }
//   };

//   const handleIncorrect = () => {
//     if (currentIndex < flashcards.length - 1) {
//       setCurrentIndex(currentIndex + 1);
//     } else {
//       alert('End of Flashcards');
//     }
//   };

//   return (
//     <div style={{ display: 'flex', justifyContent: 'center', padding: 20 }}>
//       <Flashcard
//         term={flashcards[currentIndex].term}
//         definition={flashcards[currentIndex].definition}
//         index={currentIndex}
//         total={flashcards.length}
//         onCorrect={handleCorrect}
//         onIncorrect={handleIncorrect}
//       />
//     </div>
//   );
// };
// export default FlashCardPage;