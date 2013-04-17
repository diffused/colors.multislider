(function($){
	$.widget("ui.multislider", $.ui.slider, {
		// todo: default values
		// options: {
		// 	emptyMessageHtml: "choose colors!",
		// 	selected_colors: [],
		// 	values: []
		// },
		_init: function() {
			this._superApply(arguments);
			this.options.max_selected_colors = 5;


		},		
		_create: function() {			
			this.element.addClass('multi-ui-slider');
			this._superApply(arguments);
		},
		_destroy: function() {
			this.handles.remove();			

			this.element
				.removeClass( "multi-ui-slider ui-slider" +
					" ui-slider-horizontal" +
					" ui-slider-vertical" +
					" ui-widget" +
					" ui-widget-content" +
					" ui-corner-all" );

			this._mouseDestroy();
		},
		_refresh: function() {			
			//this._echo_state();			

			$(".multi-ui-slider-range", this.element).remove();


			if(this.options.selected_colors.length <= 0) {
				this._display_empty_message();
				return;
			}
			if($('.empty_message', this.element).length > 0) {				
				this._remove_empty_message();
			}

			this._createMultiRanges();
			this._createHandles();
			this._setupEvents();
			this._refreshValue();

			if(this.options.values.length == 0) {
				$('.ui-slider-handle', this.element).hide();
			}
			else {				
				$('.ui-slider-handle', this.element).show();

				// todo: animate slider range add/delete			

				//$('.ui-slider-handle', this.element).append('<span class="ui-icon ui-icon-grip-dotted-vertical" style="display:inline-block"></span>')
					//.addClass('ui-icon ui-icon-grip-dotted-vertical');
			}

			//this._echo_state();			
		},
		_echo_state: function() {
			//log(this.element);
			log($(this.element).attr('id') + ', values='+this.options.values+', selected_colors='+this.options.selected_colors);	
			//log(this.get_colors_and_ratios());
		},		
		add_color: function(color) {						
			var o = this.options;		

			if(o.selected_colors.length >= o.max_selected_colors)
				return;

			if(_.contains(o.selected_colors, color)) {
		 		this.delete_color(color);
		 		return;
		 	}

			if(o.selected_colors.length > 0) {
				var next_value = 50;
				
				if(o.values.length > 0) {
					var last_value = o.values[o.values.length-1];

					if(o.orientation === "vertical") {
						next_value = Math.round(last_value/2);						
					} else {
						next_value = Math.round( 100-((100 - last_value) / 2) );
					}
				}
				
				o.values.push(next_value);
			}

			o.selected_colors.push(color);

			//log(o.selected_colors.length + ", " + o.max_selected_colors)

			this._trigger('color_added', null, color);
			//this._echo_state();
			this._refresh();
		},
		color_added: function(event, color) {
			return color;
		},
		delete_color: function(color) {
			var o = this.options;	
			var color_index = _.indexOf(o.selected_colors, color)

			if(o.selected_colors.length <= 0)
				return;		

			o.selected_colors.splice(color_index, 1);

			if(o.selected_colors.length == 1) {				
				o.values = [];
			} else {	
				if(o.orientation === "vertical") {	
				 	o.values.splice(color_index-1,1);
				}
				else {
					o.values.splice(color_index-1,1);
				}				
				
			}			

			//log("deleted values = " +o.values)

			this._trigger("color_deleted", null, color);			
			//this._echo_state();
			this._refresh();
		},
		color_deleted: function(event, color)	 {			
			return color;
		},
		_createHandles: function() {
			this._super();
		},		
		_createMultiRanges: function() {
			var context = this;			

			for(var i = 0; i < this.options.selected_colors.length; i++) {     		     		
     		$(this.element).append(     			
     			slider_range(
     				i, 
     				this.options.values, 
     				this.options.selected_colors,
     				this.options.orientation
     				)
     			);
   		}

   		// todo: figure out how to attached to events
   		// 	properly using the 'widget way'

   		$('.ui-slider-range', context.element).unbind('mousedown');
   		$('.ui-slider-range', context.element).mousedown(function(e){
				return false;
			});	

			$('.delete_range', context.element).unbind('click');
			$('.delete_range', context.element).click(function(e){				
				var color = $(this).data('color');
				context.delete_color(color);
				return false;
			});
		},
		_display_empty_message: function() {			
			// todo: display custom display message when no colors are selected

			// this.element
			// 	.removeClass( "ui-slider" +
			// 	" ui-slider-horizontal" +
			// 	" ui-slider-vertical" +
			// 	" ui-widget" +
			// 	" ui-widget-content" +
			// 	" ui-corner-all" );
			//this.element.append('<div class="empty_message">' + this.options.emptyMessageHtml + '</div>');
		},
		_remove_empty_message: function() {
			// todo: remove custom display message when no colors are selected

			//$('.empty_message', this.element).remove();
		},
		get_colors_and_ratios: function() {
			var o = this.options;
			var ratios = o.values.slice();			
			
			// fix o.values into an array that represents each slider range
			if(o.selected_colors.length == 1)
				ratios = [100];
			else if (o.selected_colors.length > 1){
				if(o.orientation === "vertical") {					
					
					ratios = _.map(ratios, function(num, key){
						if(key == 0) return 100-num;					
						return ratios[key-1] - num;
					});	
					var ratios_sum = _.reduce(ratios, function(memo, num){ return memo+num; });		
					var last_ratio = 100 - ratios_sum;					
					ratios.push(last_ratio);
				} else {
					var last_ratio = 100 - _.last(ratios);
					ratios = _.map(ratios, function(num, key){
						if(key == 0) return num;					
						return 100-num;
					});
					ratios.push(last_ratio);					
				}						
			}

			return { 
				'colors': o.selected_colors,
				'ratios' : ratios
			}
		},
		_slide: function() {		
			var self = this;
			this._superApply(arguments);			
			var values = this.options.values;	

			// todo: limit sliders
			//if ( values[0] >= values[1] ) return false;
      //if ( values[1] >= values[2] ) return false;      

      $(this.element).find('.ui-slider-range').each(function(i, e){
      	var slide_values = slider_slide_css(i, values, self.options.orientation);
      	//log(i)

      	$(this).css(slide_values);
      	if(self.options.orientation === "vertical"){	
      		$('.range_info', this).text(slide_values.height);
      	}
      	else {
      		$('.range_info', this).text(slide_values.width);      		
      	}      	
    	});
		}

	});


	// todo: refactor logic

	function slider_slide_css(num, ratios, orientation) {
		if(orientation === "vertical"){	
			var top, height;
			if(num == 0) {				
				top = 0;
				height = 100-ratios[num];
			} 
			else if (num == ratios.length) {
				// last slider pos
				top = 100-ratios[num-1];
				height = ratios[num-1];
				
			}
			else {
				// sliders between first and last					
				top = 100-ratios[num-1];
				height = ratios[num-1] - ratios[num];
			}		

			return { "top": top + "%", "height": height + "%" };		
		}

		var width, left = 0;
		if(num == 0) {
			left = 0;
			width = ratios[num];
		}
		else if(num == ratios.length) {
			left = ratios[num-1];
			width = 100 - ratios[num-1];			
		}
		else {
			left = ratios[num-1];
			width = ratios[num] - ratios[num-1];
		}

		return { "left": left + "%", "width": width + "%" };
	}

	function slider_range(num, ratios, bg_colors, orientation) {
		if(orientation === "vertical"){			
			var top, height = 0;
			if(num == 0) {
				// first slider
				top = 0;
				if(bg_colors.length == 1)
					height = 100;
				else 
					height = 100-ratios[0];
			}
			else if(num == bg_colors.length-1) {			
				// last slider pos
				top = 100-ratios[num-1];
				height = ratios[num-1];			
			}
			else {	
				// sliders between first and last						
				top = 100-ratios[num-1]
				height = ratios[num-1] - ratios[num];				
			}

			return '<div class="ui-slider-range ui-widget-header multi-ui-slider-range range_' + num + '" style="top:'+top+'%; height:' + height + '%; background: none repeat scroll 0% 0% '+bg_colors[num]+'"><div class="range_actions"><div class="range_info">' + height +'%</div><a class="delete_range" data-color="' + bg_colors[num] +'" href="#"><span class="ui-icon ui-icon-circle-close"></span></a></div></div>';
		} 

		var width, left = 0;
		if(num == 0) {
			// first slider
			left = 0;
			if(bg_colors.length == 1)
				width = 100;
			else 
				width = ratios[0];
		}
		else if(num == bg_colors.length-1) {			
			// last slider pos
			left = ratios[num-1]
			width = 100-ratios[num-1];			
		}
		else {	
			// sliders between first and last		
			left = ratios[num-1]			
			width = ratios[num]-left;
		}
		
		return '<div class="ui-slider-range ui-widget-header multi-ui-slider-range range_' + num + '" style="left:'+left+'%; width:' + width + '%; background: none repeat scroll 0% 0% '+bg_colors[num]+'"><div class="range_actions"><div class="range_info">' + width +'%</div><a class="delete_range" data-color="' + bg_colors[num] +'" href="#"><span class="ui-icon ui-icon-circle-close"></span></a></div></div>'
	}
}(jQuery))