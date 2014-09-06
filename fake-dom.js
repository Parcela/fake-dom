/* jshint node: true, lastsemic: true, -W033*/
"use strict";
var fs = require('fs'),
	Url = require('url');

var used = {};

var count = function (method) {
	if (!used[method]) {
		used[method] = 1;
	} else {
		used[method] += 1;
	}
};

var createWindow = function() {
	var window = {}
	window.document = {}
	window.document.childNodes = []
	window.document.createElement = function(tag) {
		count('createElement');
		return {
			style: {},
			childNodes: [],
			nodeName: tag.toUpperCase(),
			appendChild: window.document.appendChild,
			removeChild: window.document.removeChild,
			replaceChild: window.document.replaceChild,
			insertBefore: function(node, reference) {
				count('insertBefore');
				node.parentNode = this
				var referenceIndex = this.childNodes.indexOf(reference)
				if (referenceIndex < 0) this.childNodes.push(node)
				else {
					var index = this.childNodes.indexOf(node)
					this.childNodes.splice(referenceIndex, index < 0 ? 0 : 1, node)
				}
			},
			insertAdjacentHTML: function(position, html) {
				count('insertAdjacentHTML');

				//todo: accept markup
				if (position == "beforebegin") {
					this.parentNode.insertBefore(window.document.createTextNode(html), this)
				}
				else if (position == "beforeend") {
					this.appendChild(window.document.createTextNode(html))
				}
			},
			setAttribute: function(name, value) {
				count('setAttribute');
				this[name] = value.toString()
				if (name == 'href') {
					var url = Url.parse(value);
					this.pathname = url.pathname;
					if (url.search) this.search = url.search;
				}
			},
			setAttributeNS: function(namespace, name, value) {
				count('setAttributeNS');
				this.namespaceURI = namespace
				this[name] = value.toString()
			},
			getAttribute: function(name, value) {
				count('getAttribute');
				return this[name]
			},
			addEventListener: window.document.addEventListener,
			removeEventListener: window.document.removeEventListener
		}
	}
	window.document.createElementNS = function(namespace, tag) {
				count('createElementNS');
		var element = window.document.createElement(tag)
		element.namespaceURI = namespace
		return element
	}
	window.document.createTextNode = function(text) {
		count('createTextNode');
		return {nodeValue: text.toString()}
	}
	window.document.documentElement = window.document.createElement("html")
	window.document.replaceChild = function(newChild, oldChild) {
		count('replaceChild');
		var index = this.childNodes.indexOf(oldChild)
		if (index > -1) this.childNodes.splice(index, 1, newChild)
		else this.childNodes.push(newChild)
		newChild.parentNode = this
		oldChild.parentNode = null
	}
	window.document.appendChild = function(child) {
		count('appendChild');
		var index = this.childNodes.indexOf(child)
		if (index > -1) this.childNodes.splice(index, 1)
		this.childNodes.push(child)
		child.parentNode = this
	}
	window.document.removeChild = function(child) {
		count('removeChild');
		var index = this.childNodes.indexOf(child)
		this.childNodes.splice(index, 1)
		child.parentNode = null
	}
	window.document.addEventListener = function () {
		count('addEventListener');
	};
	window.document.removeEventListener = function () {
		count('removeEventListener');
	};
	window.performance = new function () {
		var timestamp = 50
		this.$elapse = function(amount) {timestamp += amount}
		this.now = function() {return timestamp}
	}
	window.cancelAnimationFrame = function() {}
	window.requestAnimationFrame = function(callback) {window.requestAnimationFrame.$callback = callback}
	window.requestAnimationFrame.$resolve = function() {
		if (window.requestAnimationFrame.$callback) window.requestAnimationFrame.$callback()
		window.requestAnimationFrame.$callback = null
		window.performance.$elapse(20)
	}
	window.location = {};
	window.XMLHttpRequest = new function() {
		var request = function() {
			this.open = function(method, url) {
				this.method = method
				this.url = url
			}
			this.send = function() {
				var xhr = this;
				var r = '';
				xhr.readyState = 4
				xhr.status = 200

				request.$instances.push(this)
				fs.createReadStream(this.url, {encoding:'utf8'}).on('data', function (chunk) {
					r += chunk;
				}).on('end', function () {
					xhr.responseText = r;
					xhr.onreadystatechange();
				});
			}
		}
		request.$instances = []
		return request
	}

	var getHTML = function (node) {
		var prop, val,
			style, styles = [],
			html = '';

		if (!node.nodeName && node.nodeValue !== undefined) {
			// For text nodes, I return the uppercase text
			// so that you can tell the parts generated at the server
			// from the normal lowercase of the actual app when run on the client
			return node.nodeValue.toUpperCase();
		}
		html += '<' + node.nodeName;
		for (prop in node) {
			val = node[prop];

			// Ignore functions, those will be revived on the client side.
			if (typeof val == 'function') continue;
			switch (prop) {
			case 'nodeName':
			case 'parentNode':
			case 'childNodes':
			case 'pathname':
			case 'search':
				continue;
			case 'checked':
				if (val == 'false') continue;
				break;
			case 'href':
				val = node.pathname;
				break;
			case 'className':
				prop = 'class';
				break;
			case 'style':
				if (val) {
					for (style in val) {
						if (val[style]) {
							styles.push(style + ': ' + val[style]);
						}
					}
					if (!styles.length) continue;
					val = styles.join(';');
				}
				break;
			}
			html += ' ' + prop + '="' + val.replace('"', '\\"') + '"';
		}

		if (node.childNodes.length) {
			html += '>' + node.childNodes.reduce(function (prev, node) {
				return prev + getHTML(node);
			}, '') + '</' + node.nodeName + '>';
		} else {
			// I don't know why Mithril assigns the content of textareas
			// to its value attribute instead of the innerHTML property.
			// Since it doesn't have children, the closing tag has to be forced.
			if (node.nodeName == 'TEXTAREA') {
				html += '></TEXTAREA>';
			} else {
				html += '/>';
			}
		}
		return html;
	};
	var reset = function () {
		window.location.search = "?/";
		window.location.pathname = "/";
		window.location.hash = "";
		window.history = {};
		window.history.pushState = function(data, title, url) {
			window.location.pathname = window.location.search = window.location.hash = url
		},
		window.history.replaceState = function(data, title, url) {
			window.location.pathname = window.location.search = window.location.hash = url
		}
		var _body = window.document.createElement('body');
		window.document.appendChild(_body);
		window.document.body = _body;
	};
	reset();

	window.navigator = {

		userAgent: 'fake',
		stats: {
			clear: function () {
				used = {};
			},
			get: function () {
				return used;
			}
		},
		reset: reset,
		getHTML: function () {
			return getHTML(window.document.body);
		},
		navigate: function (url) {
			var u = Url.parse(url, false, true);
			window.location.search = u.search || '';
			window.location.pathname = u.pathname || '';
			window.location.hash = u.hash || '';
		}
	};
	return window;
}
var _window = null;

module.exports = function () {
	if (! _window) _window = createWindow();
	return _window;
}
