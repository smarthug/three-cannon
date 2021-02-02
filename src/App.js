import React from 'react';
import './App.css';

// import First from './pages/first'
// import Second from './pages/second'
// import Third from './pages/third'
// import Fourth from './pages/fourth'
// import Fifth from './pages/fifth'
// import Sixth from './pages/sixth'
// import Seven from './pages/seventh'
// import Eight from './pages/eight'
// import Ninth from './pages/ninth'
// import Tenth from './pages/tenth'
// import Eleventh from './pages/eleventh'
// import Twelveth from './pages/twelveth'
// import Thirteenth from './pages/Thirteenth'
// import Fourteenth from './pages/Fourteenth'
// import Fifteen from './pages/Fifteen'
// import Sixteen from './pages/Sixteen'
import Seventeen from './pages/Seventeen'
import Eighteen from './pages/Eighteen'
import Nineteen from './pages/Nineteen'
// import Twenty from './pages/Twenty'
import TwentyOne from './pages/TwentyOne'

import { SnackbarProvider } from 'notistack';



function App() {
  return (
    <div className="App">
      <SnackbarProvider>
        <TwentyOne />
      </SnackbarProvider>
    </div>
  );
}

export default App;
