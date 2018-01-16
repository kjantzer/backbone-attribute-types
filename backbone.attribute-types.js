/*
	Backbone Model Attributes Types 0.1.1

	A non-obtrusive plugin to force `get()`ing of attributes to return values in
	a specific type (integer, date, etc). It's designed to be used in code and refrains
	from overwriting the real value in `attributes`.

	@author Kevin Jantzer, Blackstone Audio
	@since 2017-09-19

	@TODO:
	- should null/undefined value parsing be more robust?
*/
(function(){

	var GetAttr = Backbone.Model.prototype.get

	// global so it can be added to
	window.Backbone.ModelAttrTypes = {
		'string': function(val){ return String(val) },
		'bool': function(val){ return !!val },
		'int': function(val){ return parseInt(val) },
		'float': function(val){ return parseFloat(val) },
		'num': function(val){ return parseFloat(val) },
		'date': function(val){ return new Date(val) },
		'moment': function(val){ return window.moment ? moment(val) : new Date(val) },
		'moment!': function(val){ return window.moment ? moment(val) : new Date(val) } // hack for now (see backbone.template-data)
	}

	function convertToType(attr, type, val){

		// set storage properties
		this.__attributesRaw = this.__attributesRaw || {}
		this.__attributes = this.__attributes || {}

		var key = attr+type

		// current value is different then the last time we got it (or we've never got it before), so convert the value to type now
		if( val != this.__attributesRaw[key] || this.__attributes[key] === undefined ){

			this.__attributesRaw[key] = val // remember the raw value we converted from so we know whether to change it again

			// custom functions are supported
			if( _.isFunction(type) )
				val = type(val)
			else if( Backbone.ModelAttrTypes[type] )
				val = Backbone.ModelAttrTypes[type].call(this, val)
			else
				console.warn('`'+type+'` is not a supported attribute type')

			// cache the converted value
			this.__attributes[key] = val
		}

		return this.__attributes[key]
	}

	Backbone.Model.prototype.get = function(attr){

		var [attr, type] = attr.split('|') // check to see if user is casting: `attrName|castType`
		var val = GetAttr.call(this, attr) // raw value
		var type = type || (this.attrTypes && this.attrTypes[attr]) || (this.collection && this.collection.attrTypes && this.collection.attrTypes[attr]) // the type the value should be

		// no types given, or no type for this attribute (or no value for attr), so return the value as is
		if( !type || !val || type == 'raw')
			return val

		return convertToType.call(this, attr, type, val)
	}

})()