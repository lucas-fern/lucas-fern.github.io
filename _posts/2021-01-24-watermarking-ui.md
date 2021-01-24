---
layout: post
title: Watermarking
---
I was given the task recently of watermarking a collection of over 1700 professional photos to prepare them for uploading to a photographers website. I'll briefly talk about the GUI I wrote which enabled each photo to have a custom placed watermark overlaid in a single click, significantly speeding up the manual process.

# Download
If you want to use the GUI for yourself go ahead and clone it [from my GitHub](https://github.com/lucas-fern/watermarking "Watermarking"). You'll need an installation of `PySimpleGUI` and `PIL`, so if you don't have them installed:

{% highlight powershell %}
pip install PySimpleGUI
# Make sure you install Pillow even though the import is PIL!
pip install Pillow
{% endhighlight %}

Since I can't distribute the fonts I used, you'll need to put any font you'd like to use for the watermarking into a `fonts/` folder in the same directory as the program.

Running the program should look something like this. ![GUI Example](https://github.com/lucas-fern/watermarking/blob/main/example.png?raw=true)
Importantly, `s` is the hotkey to save and move to the next image.

# Code Overview
## GUI Setup 
{:.follows-heading}
Firstly, here are the imports

{% highlight python %}
import PySimpleGUI as Sg
import os
from PIL import Image, ImageDraw, ImageFont
from io import BytesIO
{% endhighlight %}

We start with a class for the application, when we run the program an instance of the app will be created.

{% highlight python %}
class App:
    ...

if __name__ == '__main__':
    watermarking = App()
{% endhighlight %}

In the class we define a tuple of the acceptable filetypes which can be operated on by `Pillow`, and the maximum image size that we'd like to scale images down to for displaying in the GUI.

{% highlight python %}
class App:
    OK_FILETYPES = (".png", ".jpg", ".jpeg", ".tiff", ".bmp")
    MAX_IMAGE_DIM = MAX_IMAGE_WIDTH, MAX_IMAGE_HEIGHT = (1280, 720)
{% endhighlight %}

We define the layout of the GUI, in the left column we have a `Sg.In` to allow us to choose a file path for input images, a list box to display the images in that folder, some checkboxes to control the centring, a field for the watermark text, another field for the output file path, and a button to save. On most of these elements we set `enable_events=True` and provide a `key`, which we'll use to process the events shortly. Note also that when we put a `Sg.FolderBrowse` to the right of a `Sg.In` field, they will link together automatically.

{% highlight python %}
left_col = [[Sg.Text('In Folder'), Sg.In(enable_events=True, key='-IN FOLDER-'), Sg.FolderBrowse()],
            [Sg.Listbox(values=[], enable_events=True, size=(40, 20), key='-FILE LIST-',
                        select_mode=Sg.LISTBOX_SELECT_MODE_SINGLE)],
            [Sg.Checkbox('Horizontal Centre', default=True, enable_events=True, key='-H CEN-'),
             Sg.Checkbox('Vertical Centre', default=False, enable_events=True, key='-V CEN-')],
            [Sg.Text('_' * 60)],
            [Sg.Text('Watermark Text:'), Sg.InputText(enable_events=True, key='-WATERMARK TEXT-')],
            [Sg.Text('_' * 60)],
            [Sg.Text('Out Folder'), Sg.In(enable_events=True, key='-OUT FOLDER-'), Sg.FolderBrowse()],
            [Sg.Save('Save + Next', key='-SAVE-', disabled=True)]]
{% endhighlight %}

On the right hand side we want a text box to display the current file path at the top, and a large graph element, which we'll later use to record the mouse click coordinates and render the watermarked image. We set the `canvas_size` to the maximum image dimension that we defined earlier, and set the `graph_bottom_left` and `graph_top_right` so that the coordinates will behave like the 4th quadrant of a cartesian plane, though this is optional.

{% highlight python %}
images_col = [[Sg.Text(size=(80, 1), key='-TOUT-')],
              [Sg.Graph(canvas_size=MAX_IMAGE_DIM,
                        graph_bottom_left=(0, -MAX_IMAGE_HEIGHT),
                        graph_top_right=(MAX_IMAGE_WIDTH, 0),
                        enable_events=True,
                        key="-GRAPH-")
               ]]
{% endhighlight %}

These columns combine to form the full layout.

{% highlight python %}
layout = [[Sg.Column(left_col, element_justification='c'), Sg.VSeperator(),
           Sg.Column(images_col, element_justification='c')]]
{% endhighlight %}

## Watermarking
I define a method in the app to actually perform the watermarking function, it takes in a `PIL.Image` object, which we will watermark, the 2D coordinate where the centre of the watermark should be placed, and a value for the opacity of the watermark text. By default we set this to 0.5.

{% highlight python %}
def watermark(self, input_image, centre, opacity=0.5):
    # The opaque white colour used for the watermark
    op_white = (255, 255, 255, round(255 * opacity))

    # Load the image to watermark and convert to RGBA so we can overlay the transparent layer
    photo = input_image.convert('RGBA')

    # Load Helvetica Bold
    font = ImageFont.truetype("fonts/Helvetica.ttf", round(photo.width / 15))

    # Draw the watermark text on a new RGBA layer
    text_layer = Image.new("RGBA", photo.size, (255, 255, 255, 0))
    text_drawing = ImageDraw.Draw(text_layer)
    text_width, text_height = text_drawing.textsize(self.watermark_text, font=font)

    x_pos = min(centre[0], photo.width)
    y_pos = min(-centre[1], photo.height)
    if self.centre_horizontal:
        x_pos = photo.width // 2
    if self.centre_vertical:
        y_pos = photo.height // 2

    text_drawing.text((x_pos - (text_width // 2),
                       y_pos - (text_height // 2)),
                      self.watermark_text, font=font, fill=op_white)

    # Merge the photo and watermark layers
    return Image.alpha_composite(photo, text_layer).convert("RGB")
{% endhighlight %}

We start by defining the RGB colour of the watermark, though it would be simple to extend this to be selectable by the user. The 4th value in the tuple is the opacity of the colour, so we scale it according to the opacity parameter.

We load the font to be used for the watermarking, which could again easily be extended to be selectable through the GUI, but this wasn't necessary for my situation.

Then we draw the watermark text - stored in `self.watermark_text` - into a new layer, taking the centre coordinates from the parameter unless they lie outside of the boundary of the image. If the options to centre the watermark are selected, we overwrite the clicked coordinates with the absolute centre of the image. Since `ImageDraw.Draw.text` uses `(0, 0)` as the coordinate for the bottom left of the image, we have to measure the size of the text before we create it with `.textsize` and make sure we offset it by half as much when drawing from the centre.

{% highlight python %}
text_width, text_height = text_drawing.textsize(self.watermark_text, font=font)
...
text_drawing.text((x_pos - (text_width // 2),
                   y_pos - (text_height // 2)),
                  self.watermark_text, font=font, fill=op_white)
{% endhighlight %}

Then the layers are composited together and we can return the result.

## Running the GUI
### Initialisation
{:.follows-heading}
When we instantiate the application python calls our `App.__init__` method. Here we want to define all our instance variables, and start the event loop.

{% highlight python %}
def __init__(self):
    self.window = Sg.Window('Watermarking', App.layout, resizable=True, return_keyboard_events=True)

    self.current_filename = None
    self.current_image = None
    self.watermarked_image = None
    self.current_ratio = None
    self.centre_horizontal = True
    self.centre_vertical = False
    self.out_folder = None
    self.watermark_text = ''

    self._running = True
    self.event_loop()
{% endhighlight %}

The event loop will check for any interactions with the GUI and perform any relevant actions.

### Event Handling
To operate the GUI we use the events that are called by the GUI elements thanks to `PySimpleGUI` and the fact that we set `enable_events=True` in the setup. The event loop is started upon initialisation, and, while the program is running, checks for interaction events with `Sg.Window.read()`.

{% highlight python %}
def event_loop(self):
    while self._running:
        event, values = self.window.read()
{% endhighlight %}

Lets look at the events that can come in:
- If the window is closed with the `x` or otherwise, we stop the program and call `window.close()` to safely exit the program.
{% highlight python %}
if event == Sg.WIN_CLOSED or event == 'Exit':
    self._running = False
    break  # Runs into window.close()
{% endhighlight %}

- If the input file path is set through the folder browser, an `'-IN FOLDER-'` event is raised, so we add all the valid image files to our list box element.
{% highlight python %}
if event == '-IN FOLDER-':  # Folder name was filled in, make a list of files in the folder
    folder = values['-IN FOLDER-']
    try:
        file_list = os.listdir(folder)  # get list of files in folder
    except Exception:
        file_list = []
    file_names = [f for f in file_list if os.path.isfile(os.path.join(folder, f))
                  and f.lower().endswith(App.OK_FILETYPES)]  # Pick out the valid images
    self.window['-FILE LIST-'].update(file_names)  # Put the valid files in the UI list
{% endhighlight %}

- If the output file path is set, we store the file path and enable the Save button in the GUI
{% highlight python %}
elif event == '-OUT FOLDER-':  # Set the folder to save files into
    self.out_folder = values['-OUT FOLDER-']
    self.window['-SAVE-'].update(disabled=False)
{% endhighlight %}

- If the watermark text is updated we store it for later
{% highlight python %}
elif event == '-WATERMARK TEXT-':  # Changing the watermark text
    self.watermark_text = values['-WATERMARK TEXT-']
{% endhighlight %}
 
- If a file is selected from the list box, we update the current file name and begin to process the selected image.  
{% highlight python %}
elif event == '-FILE LIST-':  # A file was chosen from the list box
    self.current_filename = values['-FILE LIST-'][0]
    if values['-IN FOLDER-']:
        self.image_selected(os.path.join(values['-IN FOLDER-'], self.current_filename))
{% endhighlight %}
`self.image_selected` then opens up the image, clears any image currently on display, and renders it on our graph element.
{:.indented}
{% highlight python %}
def image_selected(self, filepath):
    try:
        self.window['-TOUT-'].update(filepath)
        self.current_image = Image.open(filepath)
        image, self.current_ratio = App.resize(self.current_image)
        self.window['-GRAPH-'].Erase()
        self.window['-GRAPH-'].DrawImage(data=App.convert_to_bytes(image), location=(0, 0))
{% endhighlight %}  
Here, `resize()` is called on the image, this ensures that images which are larger than the size of our graph still display fully by scaling them down to fit within the `MAX_IMAGE_DIM` we defined earlier. `resize()` returns the ratio that the image was scaled down by, since this will be required to scale back up the  coordinates of clicks on the graph to place the watermark in the correct position on a fully sized image. This means we don't have to compromise on image quality, as the watermarking operation is actually performed on the full sized image behind the scenes, and the resized images is only used for display.
{:.indented}
{% highlight python %}
@staticmethod
def resize(image):
    width, height = image.size
    if (ratio := min(App.MAX_IMAGE_WIDTH / width, App.MAX_IMAGE_HEIGHT / height)) < 1:
        image = image.resize((int(width * ratio), int(height * ratio)))
    else:
        ratio = 1

    return image, ratio
{% endhighlight %}

- If the horizontal or vertical centring boxes are checked/unchecked we store the new state.
{% highlight python %}
elif event == '-H CEN-':  # Toggled Horizontal Centering
    self.centre_horizontal = values['-H CEN-']

elif event == '-V CEN-':  # Toggled Vertical Centering
    self.centre_vertical = values['-V CEN-']
{% endhighlight %}

- If an image is loaded and the graph is clicked, this means the user is wanting to place the watermark. This will raise an event which stores the coordinates of the click, so we pass this into the watermark function from above and draw the watermarked image back onto the graph (after resizing it again).
{% highlight python %}
elif event == '-GRAPH-' and self.current_filename:  # The image was clicked
    # Generate a watermarked image at the clicked location
    self.watermarked_image = self.watermark(self.current_image,
                                            [x / self.current_ratio for x in values['-GRAPH-']])
    # Draw the watermarked image to the screen
    watermarked, _ = App.resize(self.watermarked_image)
    self.window['-GRAPH-'].Erase()
    self.window['-GRAPH-'].DrawImage(data=App.convert_to_bytes(watermarked), location=(0, 0))
{% endhighlight %}

- Finally, if the user presses save, or uses the `s` hotkey, we need to save the photo, and it would be nice to move onto the next image without an extra click. We'll move to the next image first so the user doesn't have to wait for a lengthy saving process on large images before seeing the next picture.
{% highlight python %}
elif event == '-SAVE-' or (event == 's' and values['-OUT FOLDER-']):
    save_name = self.current_filename
    # Set the next item in the list box as the current item,
    try:
        next_photo = self.window['-FILE LIST-'].get_list_values()[
            self.window['-FILE LIST-'].get_list_values().index(self.current_filename) + 1
            ]
    except Exception as E:
        print(f'** Error {E} **')
        next_photo = self.current_filename

    self.window['-FILE LIST-'].set_value(next_photo)
    self.current_filename = next_photo
    if self.current_filename:
        self.image_selected(os.path.join(values['-IN FOLDER-'], self.current_filename))
{% endhighlight %}
Here we have to retrieve the list of files from the list box, find the current file, and extract the filename of the image at the following index. We then focus this element in the list box and call the relevant methods to draw the image to the screen. If the current image is the final image we don't change the image.
{:.indented}

Now we can save the image, we prepend `watermarked_` to the name to avoid overwriting files if we choose the same input and output directories, this was discovered the hard way. We also set the current watermarked image to `None`, this stops the user from being able to save the image again after choosing a new image, which would save it under the wrong filename.
{:.indented}
{% highlight python %}
if self.watermarked_image:
    out_name = 'watermarked_' + save_name
    self.watermarked_image.save(os.path.join(self.out_folder, out_name))
    self.watermarked_image = None
{% endhighlight %}

That's all the logic contained in the event loop, just enough for a working application.

> Since I designed this with one specific task in mind it's nothing polished, and can likely be broken with some abuse. Feel free to [pull request on GitHub](https://github.com/lucas-fern/watermarking) if you improve it and feel like sharing.