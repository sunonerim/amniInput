/**
 * by Sunone Rim
 * 
 */

(function($){
	
	var	DateTimeInputMask = function(_datetimepicker) {
		this.init(_datetimepicker);
	};
	
	DateTimeInputMask.prototype = {			
			constructor:DateTimeInputMask,
			
			init: function( _datetimepicker ){
				this.datetimepaicker = _datetimepicker;
				
				this.formatFields = null;
				
				this.indexOfFDateTime = null;
				this.separateDateTimeFormat();
				this.datetimepaicker.$element.find('input').on( {'click': $.proxy(this.click, this)
															    ,'keydown': $.proxy(this.keydown, this) 
															    ,'keyup': $.proxy(this.keyup, this)
															    ,'focusin': $.proxy(this.focus, this)
															    ,'focusout': $.proxy(this.focusout, this)
															    });
					
				// set Today for default.
				this.datetimepaicker.setDate( this.datetimepaicker.getDate());				
			} ,
			
			click : function(e){				
				this.target 	= e.target;				 
				this.whichField = this.getAdjacentField(  e.target.selectionStart );				
					
				this.selectTextRange();
			},
			
			focus:function(e){
				this.datetimepaicker.$element.removeClass("error");		
			},
			
			focusout:function(e){
				if( ! this.checkValidity() ) {
					this.datetimepaicker.$element.addClass("error");
				}								
				this.indexOfFDateTime = this.formatFields[ 0 ].startIndex;								
			},
			
			
			keydown: function(e){
				
				var c = String.fromCharCode(e.which);			
				switch (  e.which ){					
					case 9:			// tab key
						return true;
						break;
						
					case 39:// right key
						if ( this.lastTextIndex == this.indexOfFDateTime ) {
							this.focusNext(e);
							return true;
						} else {
							this.nextField();
						} 
						break;
						
					case 37:// left key
						this.prevField();
						
						break;
						
					case 38: // up key
						this.incValue();
						break;
						
					case 40: // down key
						this.decValue();
						break;
					
						
					 case 48: case 49: case 50: case 51: case 52: case 53:
					 case 54: case 55: case 56: case 57: // <digit> key press					 
						 this.handleDigitKey( e.keyCode - 48 );					 
						 if(! this.nextField() ) {
							 this.focusNext(e);		 
							 return false;
						 }
						 break;
					 case 96: case 97: case 98: case 99: case 100: case 101:
					 case 102: case 103: case 104: case 105: // <digit> key press
						 this.handleDigitKey(e.keyCode - 96 );					 
						 if(! this.nextField() ) {						 
							 this.focusNext(e);
							 return false;
						 }
						 break;						
				}
				
				this.selectTextRange();
				stopBubble (e);
				return false;
			},
			
			
			keyup : function(e) {
				this.target = e.target;			
		        var code = (e.keyCode ? e.keyCode : e.which);			        
		        if (code == 9) {
		        	this.selectTextRange();
		        }		        
			},

			
			separateDateTimeFormat : function() {
				var	fields = ["yyyy", "MM", "dd", "hh", "mm", "ss"];
				var	temp_fields = new Array();
				
				// get year text range.
				for ( var i=0; i<fields.length; i++){
					var index = this.datetimepaicker.format.indexOf(fields[i]);
					if( index > -1 ){
						var field  = new Object();
						field.field = fields[i];
						field.startIndex = index; 
						
						temp_fields.push(field);
					}
				}
				temp_fields.sort(function(a,b){return a.startIndex - b.startIndex;});				
				this.formatFields = temp_fields;
				
				this.lastTextIndex = this.formatFields[this.formatFields.length-1].startIndex + this.formatFields[this.formatFields.length-1].field.length -1; 
			},
			
			
			
			selectTextRange : function( ) {							
				if ( this.indexOfFDateTime == null ){
					this.indexOfFDateTime = this.formatFields[ 0 ].startIndex;
					this.whichField = this.formatFields[ 0 ];
				}
				this.target.setSelectionRange( this.indexOfFDateTime, this.indexOfFDateTime+1);  
			},
			
			checkValidityBefore : function( digit ) {
				var input_val = this.datetimepaicker.$element.find('input').val();
				
				input_val =  input_val.substring(0, this.indexOfFDateTime)
				+ digit + input_val.substring( this.indexOfFDateTime+1 );
				
				var date = this.datetimepaicker.parseDate(  input_val  ); 
				return (date != null);  								
			},
			
			checkValidity : function( ) {
				var input_val = this.datetimepaicker.$element.find('input').val();								
				var date = this.datetimepaicker.parseDate(  input_val  ); 
				return (date != null);  								
			},
			
			
			prevField : function(){
				if( this.indexOfFDateTime == this.formatFields[0].startIndex ) return;
				
				for( var i=0; i<this.formatFields.length; i++){
					if( this.formatFields[i].startIndex == this.indexOfFDateTime){
						this.indexOfFDateTime = this.formatFields[i-1].startIndex + this.formatFields[i-1].field.length-1;
						this.whichField  = this.formatFields[i-1];
					} else if( 	this.formatFields[i].startIndex < this.indexOfFDateTime && 
								this.indexOfFDateTime < this.formatFields[i].startIndex +  this.formatFields[i].field.length){
						this.whichField  = this.formatFields[i];
						this.indexOfFDateTime--;
						return true;
					} 					
				}			
			},
			
			nextField : function(){
				
				if( this.indexOfFDateTime == this.lastTextIndex ) {
					return false;					
				}
				
				for( var i=0; i<this.formatFields.length; i++){
					if( this.formatFields[i].startIndex <= this.indexOfFDateTime && 
							this.indexOfFDateTime < this.formatFields[i].startIndex +  this.formatFields[i].field.length - 1){
						this.whichField  = this.formatFields[i];
						this.indexOfFDateTime ++;
						return true;
					} else if ( this.indexOfFDateTime == this.formatFields[i].startIndex +  this.formatFields[i].field.length -1 ){
						// before move to the next field, check the validation of datetime.
						// if it not valid , move the caret the start position og this field to retrieve 
						// valid input .
						this.indexOfFDateTime = this.formatFields[i+1].startIndex;
						this.whichField  = this.formatFields[i+1];						

						return true;
					} 					
				}
				return true;
			},

			
			
			getAdjacentField : function(position){
				if(  position < this.formatFields[0].startIndex ) {
					this.indexOfFDateTime =  this.formatFields[0].startIndex;
					return this.formatFields[0];
				}
				
				for( var i=0; i<this.formatFields.length; i++){
					if( this.formatFields[i].startIndex <= position && 
							position < this.formatFields[i].startIndex +  this.formatFields[i].field.length){
						this.indexOfFDateTime = position;
						return  this.formatFields[i];
					}
					// it is case of out of field range, maybe it in the separate character between fields.	
					if( position < this.formatFields[i].startIndex ){
						if ( (this.formatFields[i].startIndex - position ) > 
							( position - (this.formatFields[i-1].startIndex + this.formatFields[i-1].field.length )) ){
							this.indexOfFDateTime = this.formatFields[i-1].startIndex + this.formatFields[i-1].field.length-1 ;
							return this.formatFields[i-1];
						} else {
							this.indexOfFDateTime = this.formatFields[i].startIndex ;
							return this.formatFields[i];
						}						
					}
				}				
				// 
				 
				this.indexOfFDateTime = this.formatFields[this.formatFields.length-1].startIndex 
										+ this.formatFields[this.formatFields.length-1].field.length-1;
				return this.formatFields[this.formatFields.length-1];
			} ,
			
			getFieldValueInNumber : function( digit ) {
				var input_val = this.datetimepaicker.$element.find('input').val();
				
				var field_val = input_val.substring(this.whichField.startIndex, this.indexOfFDateTime)
				+ digit + input_val.substring( this.indexOfFDateTime+1 , this.whichField.startIndex + this.whichField.field.length );
				
				// TODO add exception handler for numeric expression invalidation exception.
				
				return new Number(field_val);				
			},
			
			
			focusNext : function(e) {
				if( ! this.nextInput ){					
					var thisNextInput = null ;
					var finded = 0;			
					var thisTarget = this.target;
					
					$("input").each(function(){						
						if( this == thisTarget ){							
							finded = 1;
						} else { 
							if( finded == 1 ){
								thisNextInput = this;
								finded = 2;
							} 
						}
					});
					
					this.nextInput = thisNextInput;				
				}								
				e.stopPropagation();
				this.nextInput.setSelectionRange( 0, $(this.nextInput).val().length ); 											
			},
			
			
			incValue : function() {
				
				var input_val = this.datetimepaicker.$element.find('input').val();				
				var date = this.datetimepaicker.parseDate(  input_val  ); 
												
				switch( this.whichField.field ) {
				case 'yyyy':									
					date.setFullYear( date.getFullYear() +1 );									
					break;
					
				case 'MM':				
					date.setMonth( date.getMonth() + 1 );
					break;
					
				case 'dd':				
					date.setDate( date.getDate() + 1 );					
					break;
					
				case 'hh':
					date.setHours( date.getHours() + 1 );
					break;
					
				case 'mm':
					date.setMinutes( date.getMinutes() + 1 );
					break;
					
				case 'ss':
					date.setSeconds( date.getSeconds() + 1 );
					break;				
				}
				
				this.datetimepaicker.setDate(date);				
			},
			
			decValue : function() {								
				var date =  this.datetimepaicker.getDate();				
				
				switch( this.whichField.field  ) {
				case 'yyyy':									
					date.setFullYear( date.getFullYear() -1 );									
					break;
					
				case 'MM':				
					date.setMonth( date.getMonth() - 1 );
					break;
					
				case 'dd':				
					date.setDate( date.getDate() - 1 );					
					break;
					
				case 'hh':
					date.setHours( date.getHours() - 1 );
					break;
					
				case 'mm':
					date.setMinutes( date.getMinutes() - 1 );
					break;
					
				case 'ss':
					date.setSeconds( date.getSeconds() - 1 );
					break;					
				}
				
				this.datetimepaicker.setDate(date);				
			},

			
			handleDigitKey : function( digit ) {
				var	input_val = this.datetimepaicker.$element.find('input').val();
								
				input_val = input_val.substr ( 0, this.indexOfFDateTime )
					+ digit + input_val.substr ( this.indexOfFDateTime+1 );
								
				this.datetimepaicker.$element.find('input').val(input_val);
			},
			
			caretPosition:function(e){				
				return e.target.selectionStart;
			},
	};
	
	function stopBubble (e) {
        // If an event object is provided, then this is a non-IE browser
        if (e && e.stopPropagation)
            e.stopPropagation();
        else
            window.event.cancelBubble = true;
	}
		
	
	$.fn.datetimeInputMask = function(){
		return this.each(function(){
			var $this = $(this),     datetimepaicker = $this.data('datetimepicker');		
			if( !datetimepaicker) {
				return ;
			}			
			var	datetime_input_mask  = new DateTimeInputMask(datetimepaicker);			
		});
	};
		
	
})(jQuery);
    