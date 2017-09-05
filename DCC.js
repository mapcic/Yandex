(function(window, undefined) {

    function DCC(selector) {

        if (!(this instanceof DCC)) {
            return new DCC(selector);
        }

        this.length = 0;
        this.nodes = [];

        if (selector instanceof HTMLElement || selector instanceof NodeList) {
            this.nodes = selector.length > 1 ? [].slice.call(selector) : [selector];
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
        return this.off(name, handler).this.each(function() {
            this.addEventListener(name, handler, false);
        });
    };

    DCC.prototype.off = function(name, handler) {
        return this.each(function() {
            this.removeEventListener(name, handler, false);
        });
    }

    DCC.prototype.append = function(html) {
    	var node = createNode(html);
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
    	this.nodes = [];
        for (var i = 0; i < this.length; i++) {
            this.nodes = this.nodes.concat(this[i].nextElementSibling);
		}

		this.length = this.nodes.length;
        for (var i = 0; i < this.length; i++) {
            this[i] = this.nodes[i];
        }

    	return this;
    }

    DCC.prototype.previous = function() {
    	this.nodes = [];
        for (var i = 0; i < this.length; i++) {
            this.nodes = this.nodes.concat(this[i].previousElementSibling);
		}

		this.length = this.nodes.length;
        for (var i = 0; i < this.length; i++) {
            this[i] = this.nodes[i];
        }

    	return this;
    }

    DCC.prototype.val = function( val ) {
    	if (typeof val !== 'undefined') {
    		return this.each(function(){
    			this.value = val;
    		});
    	} else {
    		var values = [];
    		this.each(function(){
    			values = values.concat(this.options[this.selectedIndex].value);
    		});

    		return values;
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
    		return values;
    	}
    }

    DCC.prototype.find = function(selector) {
    	this.nodes = [];
        for (var i = 0; i < this.length; i++) {
            this.nodes = this.nodes.concat(this.nodes.slice.call(this[i].querySelectorAll(selector)));
            delete this[i];
		}

		this.length = this.nodes.length;
        for (var i = 0; i < this.length; i++) {
            this[i] = this.nodes[i];
        }

    	return this;
    }

    window.DCC = DCC;

})(window);