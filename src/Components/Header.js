import React, { Component } from "react";
import ParticlesBg from "particles-bg";
import Fade from "react-reveal";

class Header extends Component {
  render() {
    if (!this.props.data) return null;

    const name = this.props.data.name;
    const description = this.props.data.description;

    let config = {
      num: [1, 10],
      rps: 0.1,
      radius: [5, 40],
      life: [1, 10],
      v: [-3, 3],
      tha: [-40, 40],
      alpha: [0.6, 1],
      scale: [.1, 0.4],
      position: "all",
      color: ["random", "#ff0000"],
      cross: "dead",
      // emitter: "follow",

      random: null
    };

    return (
      <header id="home">
        <ParticlesBg type="cobweb" color="#880000" config={config} bg={true} />

        <nav id="nav-wrap">
          <a className="mobile-btn" href="#nav-wrap" title="Show navigation">
            Show navigation
          </a>
          <a className="mobile-btn" href="#home" title="Hide navigation">
            Hide navigation
          </a>

          <ul id="nav" className="nav">
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
            <Fade bottom>
              <h1 className="responsive-headline">{name}</h1>
            </Fade>
            <Fade bottom duration={1200}>
              <h3>{description}.</h3>
            </Fade>
          </div>
        </div>
      </header>
    );
  }
}

export default Header;
