# JQueryWaveform

A JQuery plugin written for CloudAudio


### This plugin draw a waveform on a canvas from data created with [wav2json](https://github.com/beschulz/wav2json)


### [Live demo](http://alrek.no/demos/jquery-waveform/)

## Usage

JQueryWaveform is simple to use!

It works on any canvas elements.

Be sure that JQuery is loaded before JQueryWaveform.

JQueryWaveform is fully responsive. If you have set the canvas element to 100% width, it will rescale automatically when the windwow dimensions changes.

If the canvas is smaller then the amount of sample data, it will lose some precision (it will not show all available samples), and if the amount of samples is less then the canvas width, it will interpolate the missing values.

To initialize it, just call it with the following function

`$('#my-canvas').waveform(options)`

Also note that this returns an object. So if you want to handle the audio controls yourself, you will have to save this object in a variable for further event binding.

## Options

The options are very important. Without passing any, it won't work. 

Some are optional, some are required

#### Example
```
var options = { 
   data: {"left": [0.1, 0.2, 0.3, 0.4]}
}
```

Above is the minimum required options. The data property is in the same format as wav2json. If the data does not contain a "left" property, or you want to specify another channel, pass in this option

#### Example
```
var options = { 
    data: {"right": [0.1, 0.2, 0.3, 0.4]}, 
    dataIndex: "right" 
}
```

## Audio 

As default, if you pass in a Audio element (JQuery selector), the waveform will automatically add a play/pause handler, and an onClick handler for seeking. 

If you don't want this, or you want to customize how this is done, you can pass in your own  handlers.

#### Example
```
var options = { 
    onClick: function(e){ 
        alert("Clicked waveform at X: " + e.offsetX); 
    }
    onMouseMove: function(e){ 
        $("#move-x").html("X: " + e.offsetX); 
        $("#move-y").html("Y: " + e.offsetY); 
    }, 
    onMouseOut: function(e){ 
        $("#move-x").html("X: Outside"); 
        $("#move-y").html("Y: Outside"); 
        } 
    }
}
```

## Colors

Colors are fully customizable, and can be any valid CSS color format: 
* "red" 
* #f00
* #ff0000
* rgb(255,0,0)
* rgba(255,0,0,1)

#### Example
```
var options = { 
    color: "#rgb(255,0,0)", 
    backgroundColor: "rgba(0,0,0,0)", 
    cursorColor: "#0f0", 
    scrubColor: "#0000ff", 
    indicatorColor: "yellow" } 
```

## Valid options

* audio
* backgroundColor
* color
* cursor
* cursorColor
* data
* dataIndex
* height
* indicatorColor
* lineWidth
* offset
* onClick
* onMouseMove
* onMouseOut
* scrubColor
* softclip
* width