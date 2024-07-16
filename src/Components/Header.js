// src/components/Header.js
import { motion } from 'framer-motion';
import ParticlesBg from 'particles-bg';
import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import './Header.css';


const Header = ({ data }) => {
    const [isNavOpen, setIsNavOpen] = useState(false);

    if (!data) return null;

    const { name, description } = data;

    const toggleNav = () => {
        setIsNavOpen(!isNavOpen);
    };

    return (
        <header id="home">
            <ParticlesBg type="cobweb" color="009900" num={window.innerWidth / 5} bg={true} />
            <nav id="nav-wrap">
                <button className="mobile-btn" onClick={toggleNav} aria-label="Toggle navigation">
                    {isNavOpen ? <FaTimes /> : <FaBars />}
                </button>
                <ul className={`nav ${isNavOpen ? 'nav-open' : ''}`}>
                    <li>
                        <a href="https://www.overleaf.com/read/qvshfnjytgwm" target="_blank" rel="noreferrer">
                            Resume
                        </a>
                    </li>
                    <li>
                        <a href="https://www.linkedin.com/in/lucas-fern/" target="_blank" rel="noreferrer">
                            LinkedIn
                        </a>
                    </li>
                    <li>
                        <a href="mailto:lucas@lfern.com" target="_blank" rel="noreferrer">
                            Contact
                        </a>
                    </li>
                </ul>
            </nav>
            <div className="row banner">
                <div className="banner-text">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                    >
                        <h1 className="responsive-headline">{name}</h1>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.3 }}
                    >
                        <p className="responsive-description">{description}</p>
                    </motion.div>
                </div>
            </div>
        </header>
    );
};

export default Header;
