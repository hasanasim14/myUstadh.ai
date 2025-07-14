// import React from 'react';
// import Header from './components/Header';
// import CardLayout from './components/CardLayout';

// function App() {
//   return (
//     <>
//       <Header />
//       <div className="main-content">
//         <CardLayout />
//       </div>
//     </>
//   );
// }

// export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import CardLayout from "./components/CardLayout";
import MarkdownViewer from "./components/MarkdownViewer"; // You'll create this next

function App() {
  return (
    <Router>
      <Header />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<CardLayout />} />
          <Route path="/docs/*" element={<MarkdownViewer />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
