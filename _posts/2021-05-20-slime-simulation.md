---
layout: post
title: Slime Simulation
---
I recently watched a mesmerising video by [Sebastian Lague](https://www.youtube.com/channel/UCmtyQOKKmrMVaKuRXz02jbQ) where he begins by exploring the Travelling Salesman Problem, and ends up developing a beautiful algorithm to simulate the complex behaviour of slime moulds using compute shaders in Unity. Performing the simulation in a shader allows the calculations to be parallelised on the GPU, and having recently upgraded mine I was extremely interested to make an extension to this wonderful program.

<center><iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/X-iSQQgOd1A" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></center>

> Since I designed this with one specific task in mind it's nothing polished, and can likely be broken with some abuse. Feel free to [pull request on GitHub](https://github.com/lucas-fern/watermarking) if you improve it and feel like sharing.