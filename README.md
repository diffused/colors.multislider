#colors.multislider 
A multiple range slider ideally suited for ratio selection of a color palette. 

jQueryUI plugin extending the Slider widget.

##Features

 - Add up to 5 colors
 - Delete a color
 - Slide handles 
 - Get selected colors and ratio information


##Warning! Incomplete 
This is just a prototype component being used as a proof of concept for a seperate early-stage project.
It has loads of bugs, crappy code and there be dragons.


##About

Requires jQueryUI 1.10 and UnderscoreJS

##Usage
Check demo.html 

    $('#container_div').multislider({
        orientation: "vertical",
        min: 0,
        max: 100,       
        values: [66], // slider location
        selected_colors: ["#3071a7", '#513075'], 
        color_added: function(event, color) {    
        },
        color_deleted: function(event, color) {             
        },
        stop: function(event, ui) {
            // fired on release of slider               
        }
    });

 
Add a color:

    $('#container_div').multislider('add_color', '#333399');


Get selected colors and ratios:

    var colors_and_ratios = $('#container_div).multislider('get_colors_and_ratios');
    
    // returns
    // { colors: ["#3071a7", '#513075'], ratios: [34, 66] }

###Events
    
    color_added: function(event, color)
    
    color_deleted: function(event, color)
    
    stop: function(event, ui) // on release of slider               
    
