(function(window, undefined) {

    function DCC(selector) {

        if (!(this instanceof DCC)) {
            return new DCC(selector);
        }

        this.length = 0;
        this.nodes = [];

        if (selector instanceof HTMLElement || selector instanceof NodeList || (selector instanceof Array && selector.every(checkType))) {
            if ( selector instanceof HTMLSelectElement ){
                this.nodes = [selector];
            } else {
                this.nodes = selector.length > 1 || selector instanceof Array ? [].slice.call(selector) : [selector];
            }
        } else if (typeof selector === 'string') {
            if (selector[0] === '<' && selector[selector.length - 1] === ">") {
                this.nodes = [createNode(selector)];
            } else {
                this.nodes = [].slice.call(document.querySelectorAll(selector));
            }
        }

        if (this.nodes.length) {
            this.length = this.nodes.length;
            for (var i = 0; i < this.nodes.length; i++) {
                this[i] = this.nodes[i];
            }
        }
    }

    function createNode(html) {
        var div = document.createElement('div');
        
        div.innerHTML = html;
        
        return div.firstChild;
    }

    function checkType(elem) {
        return (elem instanceof HTMLElement || elem instanceof NodeList);
    }

    DCC.prototype.each = function(callback) {
        for (var i = 0; i < this.length; i++) {
            callback.call(this[i], this, i);
		}
        return this;
    };

    DCC.prototype.removeClass = function(className) {
        return this.each(function() {
            this.className = this.className.replace(new RegExp('\\b' + className + '\\b', 'g'), '');
        });
    };

    DCC.prototype.addClass = function(classes) {
        return this.removeClass(classes).each(function() {
	            this.className += ' ' + classes;
        });
    };

    DCC.prototype.hasClass = function(className) {
   		var flag = true,
   			regex = new RegExp(className);
   		this.each(function(){
   			if (!regex.test(this.className)) {
   				flag = false;
   			}
   		})
    	return flag;
    }

    DCC.prototype.on = function(name, handler) {
        return this.off(name, handler).each(function() {
            this.addEventListener(name, handler, false);
        });
    };

    DCC.prototype.off = function(name, handler) {
        return this.each(function() {
            this.removeEventListener(name, handler, false);
        });
    }

    DCC.prototype.trigger = function(name) {
        return this.each(function() {
            this.dispatchEvent(new Event(name));
        });        
    }

    DCC.prototype.append = function(html) {
    	var node = html instanceof HTMLElement? html : createNode(html);
    	return this.each(function(){
    		this.appendChild(node);
    	})
    }

    DCC.prototype.remove = function(html) {
    	this.each(function(){
    		this.remove();
    	});
    	return this;
    }

    DCC.prototype.next = function() {
        var nodes = [];
        for (var i = 0; i < this.length; i++) {
            if (this[i].nextElementSibling instanceof HTMLElement){
                nodes = nodes.concat(this[i].nextElementSibling);
            }
        }

        return new DCC(nodes);
    }

    DCC.prototype.previous = function() {
    	var nodes = [];
        for (var i = 0; i < this.length; i++) {
            if (this[i].nextElementSibling instanceof HTMLElement){
                nodes = nodes.concat(this[i].previousElementSibling);
            }
		}

    	return new DCC(nodes);
    }

    DCC.prototype.getChilds = function() {
        var nodes = [];
        for (var i = 0; i < this.length; i++) {
            var childs = this[i].children;
            if (childs !== undefined){
                nodes = nodes.concat([].slice.call(childs));
            }
        }

        return new DCC(nodes);
    }

    DCC.prototype.firstChild = function(){
        var nodes = [];
        this.each(function(){
            if (this instanceof HTMLElement){
                nodes = nodes.concat([this.firstElementChild]);
            } else if (this instanceof NodeList) {
                nodes = nodes.concat([this.firstChild])
            }
        });

        return new DCC(nodes);
    }

    DCC.prototype.lastChild = function(){
        var nodes = [];
        this.each(function(){
            if (this instanceof HTMLElement){
                nodes = nodes.concat([this.lastElementChild]);
            } else if (this instanceof NodeList) {
                nodes = nodes.concat([this.lastChild])
            }
        });

        return new DCC(nodes);
    }

    DCC.prototype.parent = function(){
        var nodes = [];
        this.each(function(){
            if (this instanceof HTMLElement){
                nodes = nodes.concat([this.parentElement]);
            } else if (this instanceof NodeList) {
                nodes = nodes.concat([this.parentNode])
            }
        });

        return new DCC(nodes);
    }

    DCC.prototype.insertBefore = function(elem) {
        elem = elem instanceof HTMLElement ? elem : createNode(elem);
        return this.each(function(){
            DCC(this).parent()[0].insertBefore(elem, this);
        });
    }

    DCC.prototype.insertAfter = function(elem) {
        elem = elem instanceof HTMLElement ? elem : createNode(elem);
        return this.each(function() {
            DCC(this).parent()[0].insertBefore(elem, DCC(this).next()[0])
        })
    }

    DCC.prototype.val = function( val ) {
    	if (typeof val !== 'undefined') {
    		return this.each(function(){
    			this.value = val;
    		});
    	} else {
    		var values = [];
    		this.each(function(){
                if (this instanceof HTMLSelectElement) {
        			values = values.concat(this.options[this.selectedIndex].value);
                }

                if (this instanceof HTMLInputElement) {
                    values = values.concat(this.value);
                }
    		});

            return (values.length > 1)? values : values[0];
        }
    }

    DCC.prototype.attr = function(attr, val) {
        if (typeof val !== 'undefined') {
            return this.each(function(){
                this.setAttribute(attr, val);
            });
        } else {
            var values = [];
            this.each(function(){
                values = values.concat(this.getAttribute(attr));
            });
    		return (values.length > 1)? values : values[0];
    	}
    }

    DCC.prototype.find = function(selector) {
    	var nodes = [];
        for (var i = 0; i < this.length; i++) {
            nodes = nodes.concat(nodes.slice.call(this[i].querySelectorAll(selector)));
		}

    	return new DCC(nodes);
    }

    DCC.prototype.copy = function(r) {
        var nodes = [];

        r = r == undefined? false: r;

        this.each(function(){
            nodes = nodes.concat(this.cloneNode(r));
        });

        return new DCC(nodes);
    }

    window.DCC = DCC;

})(window);