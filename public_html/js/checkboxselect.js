  
$.widget("ui.checkboxselect", {
	hidden: "ui-helper-hidden-accessible",
	textContainer: "<div class='cbs-text-container' id='%%-textbox-container'></div>",
	texts: "<label class='cbs-text' id='%%-texts'></label>",
	dropdownButton: "<i class='cbs-button cbs-right fa fa-caret-down' id='%%-dropdown-button'></i>",
	dropdownContainer: "<div class='cbs-dropdown-container ui-helper-hidden-accessible' id='%%-dropdown-container'></div>",
	toolContainer: "<div class='cbs-tool-container' id='%%-tool-container'></div>",
	checkAllButton: "<i class='cbs-button fa fa-square-o' id='%%-check-all-button'></i>",
	searchContainer: "<div class='cbs-search-container' id='%%-search-container'></div>",
	searchIcon: "<i class='cbs-button ui-state-disabled fa fa-search' id='%%-search-icon'></i>",
	searchInput: "<input class='cbs-input' type='text' id='%%-search-input'></input>",
	searchCancelButton: "<i class='cbs-button fa fa-times' id='%%-search-cancel-button'></i>",
	orderButton: "<i class='cbs-button cbs-right fa fa-sort' id='%%-order-button'></i>",
	listContainer: "<div class='cbs-list-container' id='%%-list-container'></div>",
	list: "<ol class='cbs-list' id='%%-list'></ol>",
	
   options: {
      data: undefined,
		order: undefined, //0: ascending, 1:descending
		search: true
   },
   
   _create: function() {
      var _this = this;
      
      if (this.element.context.nodeName !== 'SELECT')
         throw "Creating a checkboxselect object needs a <select> element, but <" +this.element.context.nodeName+ "> found.";
      
      if (!this.element.prop("multiple"))
         this.element.prop("multiple", true);
      
      this.element.hide();  
		
		this._initIds();
		
		//selected texts and dropdown control
		this.textContainer.append(this.texts);
		this.texts.after(this.dropdownButton);
		this.element.after(this.textContainer);
				
		this.dropdownContainer.appendTo("body");
		this.dropdownContainer.append(this.toolContainer);
		
		//check/uncheck all, search and order toolbar
		//check/uncheck
		this.toolContainer.append(this.checkAllButton);
		
		//search
		this.checkAllButton.after(this.searchContainer);
		this.searchContainer.append(this.searchIcon);
		this.searchIcon.after(this.searchInput);
		this.searchInput.after(this.searchCancelButton);				  
		
		if (!this.options.search )
			this.searchContainer.hide();
	
		//order
		this.searchContainer.after(this.orderButton);
		if (this.options.order !== 0 && this.options.order !== 1)
			this.orderButton.hide();
		
		//list items and it's checkboxes
		this.toolContainer.after(this.listContainer);
		this.listContainer.append(this.list);
		
		this.dropdownContainer.position({my: "left top",at: "left bottom",of: this.textContainer});
			
		this.dropdownButton.click(function(){_this._toggleDropdown();});
		
		this.checkAllButton.click(function(){_this._toggleCheckAll(); return false;});
		this.searchCancelButton.click(function(){ _this.searchInput.val(""); _this._applyFilter(); return false; });
		this.searchInput.click(function(){return false;});
		this.searchInput.change(function(){_this._applyFilter();});		
		this.orderButton.click(function(){_this._toggleOrder();return false;});
	
		//close on click event of any other area 
		this._on(this.document, { click: function(event) {_this._toggleDropdown(event);} });
		
		this.setData(this.options.data);
		      
   },

	_initIds: function() {
		var _thisId = this.element.attr("id");
		
		this.textContainer = $(this.textContainer.replace("%%", _thisId));
		this.texts = $(this.texts.replace("%%", _thisId));
		this.dropdownButton = $(this.dropdownButton.replace("%%", _thisId));
		this.dropdownContainer = $(this.dropdownContainer.replace("%%", _thisId));
		this.toolContainer = $(this.toolContainer.replace("%%", _thisId));
		this.checkAllButton = $(this.checkAllButton.replace("%%", _thisId));
		this.searchContainer = $(this.searchContainer.replace("%%", _thisId));
		this.searchIcon = $(this.searchIcon.replace("%%", _thisId));
		this.searchInput = $(this.searchInput.replace("%%", _thisId));
		this.searchCancelButton = $(this.searchCancelButton.replace("%%", _thisId));
		this.orderButton = $(this.orderButton.replace("%%", _thisId));
		this.listContainer = $(this.listContainer.replace("%%", _thisId));
		this.list = $(this.list.replace("%%", _thisId));
		
	
	},
	
	_compareItem: function(a,b) {
		return $(a).text().localeCompare($(b).text());
	},
	
	_toggleOrder: function() {
		
		if (this.orderButton.is(".fa-sort"))
			this.orderButton.removeClass("fa-sort");
		
		if (this.options.order === 1) {
			this.options.order = 0;
			this.orderButton.addClass("fa-sort-asc").removeClass("fa-sort-desc");
		}
		else {
			this.options.order = 1;
			this.orderButton.addClass("fa-sort-desc").removeClass("fa-sort-asc");
		}
		
		this._applyOrder();
	},
	
	_applyOrder: function() {
		var _items = this.list.children();
		
		if (!(this.options.order === 0 || this.options.order === 1))
			return;
		
		_items.sort(this._compareItem);
		
		if (this.options.order === 1)
			_items = _items.toArray().reverse();

		this.list.children().remove();
		this.list.append(_items);
	},
	
	_applyFilter: function() {
		var text = this.searchInput.val(),
				  _this = this;

		if (this.checkAllButton.is(".fa-check"))
			this._toggleCheck(this.checkAllButton);
		
		this.list.children()
				  .each(function(i,li){
						li = $(li);
						if (li.text().indexOf(text) > -1)
							li.removeClass(_this.hidden);
						else
							li.addClass(_this.hidden);
					});
	},
	
	_toggleDropdown: function(event) {
		
		if (event !== undefined && event.target !== undefined) {
			//this comes from document 
			var _id = '',
				_container = undefined;

			if (this.dropdownButton[0] === event.target)
				return;

			_id = this.dropdownButton.attr("id").replace("-dropdown-button", "-dropdown-container");
			_container = $("#"+_id);	

			if (_container.is("."+this.hidden))
				return;

			_container.toggleClass(this.hidden);
		}
		else {
			//clear filter first, 
			if (this.dropdownContainer.is("."+this.hidden)) {
				this.searchInput.val("");
				this._applyFilter();
			}

			this.dropdownContainer.toggleClass(this.hidden);
		}
	},
	
	_toggleCheckAll: function() {
		var _this = this,
			_items = this.element.children();

		this._toggleCheck(this.checkAllButton);
		
		this.list.children().each(function() { 
			var __this = $(this),
				_icon = __this.children();

			if (__this.is("."+_this.hidden))
				return;				
			
			if (_icon.attr("class") !== _this.checkAllButton.attr("class"))
				_this._toggleCheck(_icon); 
		
			_items.filter("[value='"+__this.attr("cbs-value")+"']").attr("selected", _icon.is(".fa-check"));
		});
		
		this._setLabel();
	},
	
	_addOption: function(option, _this) {
		var _isObject = typeof option === "object",
			_value = _isObject ? (option.value !== undefined ? option.value : null) : option,
			_text = _isObject ? (option.text !== undefined ? option.text : "&nbsp;") : option,
			_isSelected = _isObject ? (option.selected !== undefined ? option.selected : false) : false,
			_this = _this !== undefined && _this !== null ? _this : this;
		
		_this.element.append('<option value="'+_value+'" '+(_isSelected ? 'selected>' : '>')+_text+'</option>');
		
		return {value: _value, text: _text, selected: _isSelected};
	},
	
   _destroy: function() {
		
		this.dropdownContainer.remove();
		this.textContainer.remove();
		
      this.element.show();
   },
	
	_setLabel: function() {
		var selectedText = "";
		this.element.children().filter(":selected").each(function(i,o){ selectedText += $(o).text() + ","; });
		this.texts.text(selectedText.endsWith(",") ? selectedText.substring(0, selectedText.length - 1) : selectedText);
	},
	
	_toggleCheck: function(check) {
		if (check.is(".fa-square-o"))
			check.removeClass("fa-square-o")
				  .addClass("fa-check");
		else
			check.removeClass("fa-check")
				  .addClass("fa-square-o");
	},
	
	_listIconClick: function(__this) {
			var value = __this.parent().attr("cbs-value");
			this._toggleCheck(__this);
			
			this.element
					  .children()
					  .filter("[value="+value+"]")
					  .attr("selected", __this.is(".fa-check"));
			
			this._setLabel();
		
	},
	
	_bind: function(listItems) {
		var _this = this;
		
		listItems.on("mouseenter mouseleave", function(){ 
         $(this).toggleClass("cbs-state-highlight"); 
      });
      
		listItems.click(function(event){ 
			//prevent from child icon element's click
			if (event.target === this) {
				_this._listIconClick($(this).children());
				_this.dropdownContainer.toggleClass(_this.hidden);
			}
      });
		
		listItems.children("i").click(function(){ _this._listIconClick($(this));return false;}); 
	},
	
	_rebuildList: function() {
		var _items = [];
		
		this.list.children().remove();
		
		this.element.children().each(function(i,o){
			o = $(o);
         _items.push("<li class='cbs-list-item' cbs-value='"+o.val()+"'><i class='cbs-button fa "+(o.prop("selected")?"fa-check":"fa-square-o")+"'></i>"+o.text()+"</li>");
      });
      
		if (this.options.order === 1 || this.options.order === 0) {
			_items.sort(this._compareItem);
			if (this.options.order === 1)
				_items.reverse();
		}
		
		this.list.append(_items);	
      this._bind(this.list.children());
		this._setLabel();
      
	},
	
	_setAjaxData: function(data) {
		var _this = this;
		
		if (data.success !== undefined && data.success !== null) {
			//save orginal success callback,
			var _successCallback = data.success;
			data.success = function(response) {
				//orginal success callback must return {value,text} data array
				response = _successCallback(response);
				response.forEach(function(o) {_this._addOption(o, _this);});
				_this._rebuildList();
			}
		}
		else {
			data.success = function(response) {
				response.forEach(function(o) {_this._addOption(o, _this);});
				_this._rebuildList();
			}
		}
		//update context with this object, ignore whatever assigned is before
		data.context = _this;
		_lazy = true;
		$.ajax(data);	
	},
	
	/*
	 * option: {
	 *		value: , 
	 *		label: ,
	 *		selected: 
	 *		}  
	 */
	addItem: function(option) {
		var _option = this._addOption(option);
      this.list.append("<li class='cbs-list-item' cbs-value='"+_option.value+"'><i class='cbs-button fa "+(_option.selected?"fa-check":"fa-square-o")+"'></i>"+_option.text+"</li>");
		this._bind(this.list.children().filter("[cbs-value='"+_option.value+"']"));
		this._setLabel();
		this._applyOrder();
	},
	
	/*
	 * data : 
	 *		array of {value, text}
	 *		function (callback, this) { ... callback( {value, text}, this); ... }
	 *		ajax settings object
	 */
	setData: function(data) {
		var _this = this,
			_lazy = false;
		
		switch(typeof data) {
			case "object":
				this.element.children("option").remove();
				if (data.length !== undefined)
					data.forEach(function(o){ _this._addOption(o); });
				else if (data.url !== undefined && data.url !== null)
					_this._setAjaxData(data);
				break;
				
			case "function":
				this.element.children("option").remove();
				data( _this._addOption, _this );
				break;
		
			case "undefined":
				break;
		}
		
		if(!_lazy)
			this._rebuildList();
		
	},
	
	removeItem: function(value) {
		this.element.children().filter("[value="+value+"]").remove();
		this.list.children().filter("[cbs-value='"+value+"']").remove();
		this._setLabel();
	},
	
	clear: function() {
		this.element.children().remove();
		this.list.children().remove();
		this.texts.text("");
	},
	
	getText: function() {
		return this.texts.text().split(/\,/);
	},
	
	getValue: function() {
		var value = [];
		this.element.children().filter(":selected").each(function(i,o){ value.push(o.value);});
		return value;
	},
	
	getSelectedData: function() {
		var value = [];
		this.element.children().filter(":selected").each(function(i,o){ value.push({value: o.value, text: o.text}); });
		return value;
	}
   
});





