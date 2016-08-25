/*
 * CoreListener: javascript class helps track changes in array and object
 * 0.1
 *
 * By Max Ulyanov
 * Source: https://github.com/M-Ulyanov/CoreListener
 */





/**
 *
 * @returns {{add: add, remove: remove}}
 * @constructor
 */
function CoreListener() {

	'use strict';


	/**
	 *
	 * @param options
	 * @public
	 */
	function add(options) {
		var constructorName = _getConstructorName(options.entity);

		if (constructorName === 'Array') {
			_addArrayListener(options.entity, options.callback);
		}
		else if (constructorName === 'Object') {
			_addObjectListener(options.entity, options.properties, options.callback);
		}
		else {
			console.error('Expected entity type: array or object, instead got: ' + constructorName);
		}
	}


	/**
	 *
	 * @param options
	 * @public
	 */
	function remove(options) {
		var constructorName = _getConstructorName(options.entity);
		if (constructorName === 'Array') {
			_removeArrayListener(options.entity);
		}
		else if (constructorName === 'Object') {
			_removeObjectListener(options.entity, options.properties);
		}
		else {
			console.error('Expected entity type: array or object, instead got: ' + constructorName);
		}
	}


	var supportedMethods = ['push', 'pop', 'shift', 'unshift', 'splice'];


	/**
	 *
	 * @param array
	 * @param callback
	 * @private
	 */
	function _addArrayListener(array, callback) {
		supportedMethods.forEach(function (method) {
			Object.defineProperty(array, method, {
				configurable: true,
				enumerable: false,
				writable: false,
				value: function () {
					var previousValue = array.slice();
					Array.prototype[method].apply(this, arguments);
					if (typeof callback === 'function') {
						callback({
							method: method,
							previousValue: previousValue,
							value: array
						});
					}
				}
			})
		})
	}


	/**
	 *
	 * @param array
	 * @private
	 */
	function _removeArrayListener(array) {
		supportedMethods.forEach(function (method) {
			if(array.hasOwnProperty(method)) {
				delete array[method];
			}
		})
	}


	/**
	 *
	 * @param object
	 * @param properties
	 * @param callback
	 * @private
	 */
	function _addObjectListener(object, properties, callback) {
		if (!properties) {
			return;
		}
		if (typeof properties === 'string') {
			properties = properties.split(' ');
		}

		for (var i = 0; i < properties.length; i++) {
			var property = properties[i];
			if (!property in object) {
				continue;
			}

			(function (prop, value) {
				Object.defineProperty(object, prop, {
					get: function () {
						return value;
					},
					set: function (newValue) {
						var previousValue = value;
						value = newValue;

						if (typeof callback === 'function') {
							callback({
								prop: prop,
								previousValue: previousValue,
								value: value
							});
						}
					},
					configurable: true,
					enumerable: true
				});

			})(property, object[property]);

		}
	}


	/**
	 *
	 * @param object
	 * @param properties
	 * @private
	 */
	function _removeObjectListener(object, properties) {
		if (!properties) {
			return;
		}
		if (typeof properties === 'string') {
			properties = properties.split(' ');
		}
		for (var i = 0; i < properties.length; i++) {
			var property = properties[i];
			if (!property in object) {
				continue;
			}
			var value = object[property];
			delete object[property];
			object[property] = value;
		}
	}


	/**
	 *
	 * @param entity
	 * @returns {string}
	 * @private
	 */
	function _getConstructorName(entity) {
		return Object.prototype.toString.call(entity).slice(8, -1);
	}


	return {
		add: add,
		remove: remove
	}

}