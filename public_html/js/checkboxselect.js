/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
        
$.widget("ui.checkboxselect", {
	
	container: $("<div class='cbs-container'></div>"),
	textContainer: $("<div class='cbs-text-container'></div>"),
	texts: $("<label class='cbs-text'></label>"),
	dropdownButton: $("<i class='cbs-button cbs-right fa fa-caret-down'></i>"),
	dropdownContainer: $("<div class='cbs-dropdown-container'></div>"),
	toolContainer: $("<div class='cbs-tool-container'></div>"),
	checkAllButton: $("<i class='cbs-button fa fa-square-o'></i>"),
	searchContainer: $("<div class='cbs-search-container'></div>"),
	searchIcon: $("<i class='cbs-button fa fa-search'></i>"),
	searchInput: $("<input class='cbs-input' type='text'></input>"),
	searchCancel: $("<i class='cbs-button fa fa-times'></i>"),
	orderButton: $("<i class='cbs-button cbs-right fa fa-sort'></i>"),
	listContainer: $("<div class='cbs-list-container'></div>"),
	list: $("<ul class='cbs-list'></ul>"),
	
   options: {
      data: undefined,
		order: undefined, //0: ascending, 1:descending
		search: true
   },
   
   _create: function() {
      var _this = this;
      
      if (this.element.context.nodeName !== 'SELECT')
         throw "Creating a checkboxselect object needs an <select> element, but <" +this.element.context.nodeName+ "> found.";
      
      if (!this.element.prop("multiple"))
         this.element.prop("multiple", true);
      
      this.element.hide();
		this.dropdownContainer.hide();  

		//container
		this.container.append(this.textContainer);
		
		//selected texts and dropdown control
		this.textContainer.append(this.texts);
		this.texts.after(this.dropdownButton);
		
		this.textContainer.after(this.dropdownContainer);
		this.dropdownContainer.append(this.toolContainer);
		
		//check/uncheck all, search and order toolbar
		//check/uncheck
		this.toolContainer.append(this.checkAllButton);
		
		//search
		this.checkAllButton.after(this.searchContainer);
		this.searchContainer.append(this.searchIcon);
		this.searchIcon.after(this.searchInput);
		this.searchInput.after(this.searchCancel);				  
		
		if (!this.options.search )
			this.searchContainer.hide();
	
		//order
		this.searchContainer.after(this.orderButton);
		if (this.options.order !== 0 && this.options.order !== 1)
			this.orderButton.hide();
		
		//list items and it's checkboxes
		this.toolContainer.after(this.listContainer);
		this.listContainer.append(this.list);
		
		this.element.after(this.container);
		
		this.dropdownButton.click(function(){_this._toggleDropdown()});
		
		this.checkAllButton.click(function(){_this._toggleCheckAll()});
		
		this.searchInput.change(function(){_this._applyFilter()});
		this.searchCancel.click(function(){ _this.searchInput.val(""); _this._applyFilter()});
		
		this.orderButton.click(function(){_this._toggleOrder();});
		
		this.setData(this.options.data);
		      
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
		var text = this.searchInput.val();

		if (this.checkAllButton.is(".fa-check"))
			this._toggleCheck(this.checkAllButton);
		
		this.list.children()
				  .each(function(i,li){
						li = $(li);
						if (li.text().indexOf(text) > -1)
							li.show();
						else
							li.hide();
					});
	},
	
	_toggleDropdown: function() {
		//clear filter first
		this.searchInput.val("");
		this._applyFilter();
		
		this.dropdownContainer.toggle();
	},
	
	_toggleCheckAll: function() {
		var _this = this,
			_items = this.element.children();
		
		//reset first 
		_items.attr("selected", false);
		this._toggleCheck(this.checkAllButton);
		
		this.list.children().each(function() { 
			var __this = $(this),
				_icon = __this.children();

			if (!__this.is(":visible")) {
				if (_icon.is(".fa-check"))
					_this._toggleCheck(_icon); 
				return;				
			}
			
			if (_icon.attr("class") !== _this.checkAllButton.attr("class"))
				_this._toggleCheck(_icon); 
		
			if (_icon.is(".fa-check"))
				_items.filter("[value='"+__this.attr("cbs-value")+"']").attr("selected", true);
		});
		
		this._setLabel();
	},
	
	_addOption: function(option) {
		var _isObject = typeof option === "object",
			_value = _isObject ? (option.value !== undefined ? option.value : null) : option,
			_text = _isObject ? (option.text !== undefined ? option.text : "&nbsp;") : option,
			_isSelected = _isObject ? (option.selected !== undefined ? option.selected : false) : false;
		
		this.element.append('<option value="'+_value+'" '+(_isSelected ? 'selected>' : '>')+_text+'</option>');
		
		return {value: _value, text: _text, selected: _isSelected};
	},
	
   _destroy: function() {
		
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
	
	_bind: function(listItems) {
		var _this = this;
		
		listItems.bind("mouseenter mouseleave", function(){ 
         $(this).toggleClass("cbs-state-highlight"); 
      });
      
		listItems.bind("click", function(event){ 
			//prevent from child icon element's click
			if (event.target === this) {
				//just call child icon click
				$(this).children().trigger("click");
				_this.dropdownContainer.hide();
			}
			
      });
		
		listItems.children("i").bind("click", function(event){
			var __this = $(this),
				value = this.parentElement.attributes["cbs-value"].value;
			
			_this._toggleCheck(__this);
			
			_this.element
					  .children()
					  .filter("[value="+value+"]")
					  .attr("selected", __this.is(".fa-check"));
			
			_this._setLabel();
		}); 
	},
	
	/*
	 * option: {
	 *		value: , 
	 *		label: ,
	 *		selected: 
	 *		}  
	 */
	addOption: function(option) {
		var _option = this._addOption(option);
      this.list.append("<li class='cbs-list-item' cbs-value='"+_option.value+"'><i class='cbs-button fa "+(_option.selected?"fa-check":"fa-square-o")+"'></i>"+_option.text+"</li>");
		this._bind(this.list.children().filter("[cbs-value='"+_option.value+"']"));
		this._setLabel();
		this._applyOrder();
	},
	
	setData: function(data) {
		var _this = this,
			_items = [];
		
		switch(typeof data) {
			case "object":
				this.element.children("option").remove();
				if (data.length !== undefined)
					data.forEach(function(o){ _this._addOption(o); });
				break;
				
			case "function":
				break;
		
			case "undefined":
				break;
		}
		
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
	
	removeOption: function(value) {
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
		this.element.children().filter(":selected").each(function(i,o){ value.push(o.value)});
		return value;
	},
	
	getSelectedData: function() {
		var value = [];
		this.element.children().filter(":selected").each(function(i,o){ value.push({value: o.value, text: o.text}); });
		return value;
	}
   
});





