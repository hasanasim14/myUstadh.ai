// import React, { useState } from 'react';
// import './CardLayout.css';
// import CardTwo from './CardTwo';
// import CardOne from './CardOne.jsx';
// import CardThree from './CardThree.jsx';

// const CardLayout = () => {
//   const [selectedDocs, setSelectedDocs] = useState([]); 
//   const [notes, setNotes] = useState([]);

//   // This function handles adding a pinned note. It creates a new note object with the question and answer,and appends it to the existing notes array
//   // since the state needs to be passed from the CardTwo component to the CardThree component, we define this function here in the parent component
//   const handleAddPinnedNote = (question, answer) => {
//     const newNote = {
//       title: `Pinned: ${question.slice(0, 30)}...`,
//       content: answer,
//       editable: false,
//     };
//     setNotes(prev => [...prev, newNote]);
//   };

//   return (
//     <div className="card-layout">
//       <CardOne selectedDocs={selectedDocs} setSelectedDocs={setSelectedDocs} />
//       <CardTwo onPinNote={handleAddPinnedNote} />
//       <CardThree selectedDocs={selectedDocs} notes={notes} setNotes={setNotes} />
//     </div>
//   );
// };

// export default CardLayout;

import React, { useState } from 'react';
import './CardLayout.css';
import CardTwo from './CardTwo';
import CardOne from './CardOne.jsx';
import CardThree from './CardThree.jsx';

const CardLayout = () => {
  const [selectedDocs, setSelectedDocs] = useState([]); 
  const [notes, setNotes] = useState([]);

  // This function handles adding a pinned note. It creates a new note object with the question and answer,and appends it to the existing notes array
  // since the state needs to be passed from the CardTwo component to the CardThree component, we define this function here in the parent component
  const handleAddPinnedNote = (question, answer) => {
    const newNote = {
      title: `Pinned: ${question.slice(0, 30)}...`,
      content: answer,
      editable: false,
    };
    setNotes(prev => [...prev, newNote]);
  };

  return (
    <div className="card-layout">
      <CardOne selectedDocs={selectedDocs} setSelectedDocs={setSelectedDocs} />
      <CardTwo onPinNote={handleAddPinnedNote} selectedDocs={selectedDocs} />
      <CardThree selectedDocs={selectedDocs} notes={notes} setNotes={setNotes} />
    </div>
  );
};

export default CardLayout;

