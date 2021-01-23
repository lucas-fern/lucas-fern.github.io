---
layout: post
title: Watermarking
---
I was given the task recently of watermarking a collection of over 1700 professional photos to prepare them for uploading to a photographers website. I'll briefly talk about the GUI I wrote (so I can see how posts display on my site).

# Download
If you want to use the GUI for yourself go ahead and clone it [from my Github](https://github.com/lucas-fern/watermarking "Watermarking"). You'll need an installation of `PySimpleGUI` and `PIL`, so if you don't have them installed:

{% highlight powershell %}
pip install PySimpleGUI
# Make sure you install Pillow even though the import is PIL!
pip install Pillow
{% endhighlight %}

Running the program should look something like this. ![GUI Example](https://github.com/lucas-fern/watermarking/blob/main/example.png?raw=true)
Importantly, `s` is the hotkey to save and move to the next image.

# Code Overview
## GUI Setup 
{:.follows-heading}
