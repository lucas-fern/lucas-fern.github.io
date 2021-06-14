---
layout: post
title: Slime Simulation
---
![Slime Mould Explosion from Centre](res/slime-sim/explosion.gif)

I recently watched a mesmerising video by [Sebastian Lague](https://www.youtube.com/channel/UCmtyQOKKmrMVaKuRXz02jbQ) where he begins by exploring the Travelling Salesman Problem, and ends up developing a beautiful algorithm to simulate the complex behaviour of slime moulds using compute shaders in Unity. Performing the simulation in a shader allows the calculations to be parallelised on the GPU, and having recently upgraded mine I was extremely interested to make an extension to this wonderful program.

<center><iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/X-iSQQgOd1A" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></center>

I can strongly recommend the entire video above, but some example simulations are shown from _14:07_, and in this post I'll explore how I added the ability to include obstacles in the simulation and have the slime navigate around them to solve mazes and explore new environments.

> My additions to the code can be found [here on my GitHub](https://github.com/lucas-fern/Slime-Simulation) in case you wanted to create your own simulations with obstacles.

