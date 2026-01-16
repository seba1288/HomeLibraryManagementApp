import { useState } from 'react'
import './App.css'
import Header from "./Header/Header.tsx";
import Navigation from './Navigation/Navigation.tsx';
import MyLibraryScreen from './MyLibraryScreen/MyLibraryScreen.tsx';

function App() {

  return (
    <>
    <div>
      <Header />
      <Navigation/>
      <MyLibraryScreen/>
    </div>
    </>
  )
}

export default App
