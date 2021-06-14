---
layout: post
title: Slime Simulation
---

<head>
<style>
.imgcolumn {
  float: left;
  width: 50%;
  padding: 5px;
}

.imgrow::after {
  content: "";
  clear: both;
  display: table;
}
</style>
</head>

<div class="imgrow">
  <div class="imgcolumn">
    <img src="res/slime-sim/explosion.gif" alt="Slime Mould Explosion" style="width:100%">
  </div>
  <div class="imgcolumn">
    <img src="res/slime-sim/spaghetti.gif" alt="Spaghettified Slime Mould" style="width:100%">
  </div>
</div>

I recently watched a mesmerising video by [Sebastian Lague](https://www.youtube.com/channel/UCmtyQOKKmrMVaKuRXz02jbQ) where he begins by exploring the Travelling Salesman Problem, and ends up developing a beautiful algorithm to simulate the complex behaviour of slime moulds using compute shaders in Unity. Performing the simulation in a shader allows the calculations to be parallelised on the GPU, and having recently upgraded mine I was extremely interested to make an extension to this wonderful program.

<center><iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/X-iSQQgOd1A" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></center>

I can strongly recommend the entire video above, but some example simulations are shown from _14:07_, and in this post I'll explore how I added the ability to include obstacles in the simulation and have the slime navigate around them to solve mazes and explore new environments.

> My additions to the code can be found [here on my GitHub](https://github.com/lucas-fern/Slime-Simulation) in case you wanted to create your own simulations with obstacles.

<center> <strong> See some more results, and how the slime explores a maze <a href="#results">in the results section below.</a> </strong> </center>

## Method for Adding Obstacles
To make the simulated slime navigate an obstacle requires us to change the behaviour of the slime such that it can never move into certain areas of the window. I will cover how we define the obstacles in the next section, but to make it so that the slimes are obstructed simply requires implementing a function in the `.compute` shader file to check if a specific part of the map is blocked, and then consider this when moving the slime cells.

This is the addition to the movement code of the slime cells, which is run in parallel for each of the millions of cells. It checks whether each of the cells is within a wall, and rotates them randomly in place if they are.

{% highlight c# %}
...

else if (InBlocked(newPos)) {
    random = hash(random);
    float randomAngle = scaleToRange01(random) * 2 * 3.1415;

    newPos.x = pos.x;
    newPos.y = pos.y;
    agents[id.x].angle = 0.5 * randomAngle;
}

...
{% endhighlight %}

## Method for Creating Obstacles from Images
My motivation to look into this project was to see how slimes with different properties were able to navigate a maze, so I created a simple pixelated maze with [Pixilart](https://www.pixilart.com/). Maps with a resolution of up to 80×40 (W×H) performed best.

<center>
<figure>
<img src="res/slime-sim/maze.png" alt="Example Maze" style="width:50%">
<figcaption>An example maze, where the slime spawns in the centre.</figcaption>
</figure>
</center>

I wrote a simple Python program to generate the `.compute` shader with obstacles as defined in a given image.

{% highlight python %}
{% raw %}
import cv2

img_name = 'name'
img_path = img_name + '.png'
img = cv2.imread(img_path, 0)

with open(img_name + '.txt', 'w') as f:
    # Get the image dimensions
    rows, cols = img.shape

    # Generate the HLSL code which defines the parameters of the map
    print(f'static int gridWidth = {cols};', file=f)
    print(f'static int gridHeight = {rows};', file=f)
    print(f'static int blocked[{rows}][{cols}] = {{', file=f)

    # Create an array the same dimension as the image which records which
    # pixels in the image are blocked (not completely transparent)
    for idx, row in enumerate(img):
        str_row = [str(i) for i in row]
        string = ', '.join(str_row)
        print(f'    {{{string}}}', end='', file=f)
        if idx != rows - 1:
            print(',', file=f)
    print('};', file=f)
{% endraw %}
{% endhighlight %}

Of course this wouldn't be the ideal method for a scalable solution, but worked perfectly for this quick experiment.

Now we can run the simulation with any obstacle map!

<a id="results"></a>

# Results
These images, as shown at the top, are simulations without obstacles, using different parameters for the slimes:

<center>
<figure>
<img src="res/slime-sim/spaghetti.gif" alt="Spaghettified Slime Mould" style="width:75%">
<figcaption>Slimes with a high tendency to follow right behind others due to a narrow field of vision. Initialised randomly in the map.</figcaption>
</figure>
<figure>
<img src="res/slime-sim/explosion.gif" alt="Slime Mould Explosion" style="width:75%">
<figcaption>One million slime cells initialised facing outward from a point in the centre.</figcaption>
</figure>
</center>

By uploading an image file with my initials I achieved what I think is an really interesting text effect:

<center>
<figure>
<img src="res/slime-sim/pink-point-LF-inverted.png" alt="Pink LF Slime" style="width:75%">
<figcaption>Inverting the colours on a green slime gave a bright image which I thought was an interesting <a href="https://www.linkedin.com/in/lucas-fern/">cover image</a></figcaption>
</figure>
<div class="imgrow">
  <div class="imgcolumn">
    <img src="res/slime-sim/white-point-LF.png" alt="White Slime LF" style="width:100%">
  </div>
  <div class="imgcolumn">
    <img src="res/slime-sim/white-point-LF-inverted.png" alt="Black Slime LF on White" style="width:100%">
  </div>
</div>
</center>

And finally, putting a few slimes into the maze:

<center>
<figure>
<img src="res/slime-sim/blue-maze-explorer.gif" alt="Blue explorer slime" style="width:75%">
<figcaption>A blue slime with a high affinity for other cells.</figcaption>
</figure>
<figure>
<img src="res/slime-sim/red-maze.gif" alt="Red filling slime" style="width:75%">
<figcaption>A fast red slime which quickly generates a sort of heat map as it quickly populates the entire space.</figcaption>
</figure>
</center>

> Though these `gif`s have been made a reasonable file size to load well on the site I am able to generate the simulations in real time at 4K resolution. I can highly recommend playing around with this project, making a few slimes and exploring other ideas as an introduction to Unity and GPU computing.