// src/App.js
import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Header from './Components/Header';

const Home = () => {
    const data = {
        name: 'Lucas Fern',
        description: 'Data Scientist at BCG X'
    };

    return <Header data={data} />;
};

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
            </Routes>
        </Router>
    );
}

export default App;
