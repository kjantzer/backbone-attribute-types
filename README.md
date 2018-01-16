Backbone Attribute Types
==============================

![Version 0.1.1](https://img.shields.io/badge/Version-0.1.1-blue.svg)

> A non-obtrusive plugin that extends models to force `get()`ing of attributes to return values in a specific type (integer, date, etc).

## Example Usage

```js
var TypedModel = Backbone.Model.extend({

	attrTypes: {
		'count': 'int',
		'runtime': 'float',
		'created_at': 'moment'
	}

});

var typedModel = new TypedModel({
	count: '10',
	runtime: '4.75',
	created_at: '2017-09-19'
})

typedModel.get('count') // 10
typedModel.get('runtime') // 4.75
typedModel.get('created_at') // date object

// a use-case
typedModel.attributes['count'] + 9 // = "109" (this would normally happen)
typedModel.get('count') + 9 // = 19
```

### Attribute Types `attrTypes`

There are default attribute types under `Backbone.ModelAttrTypes`. You can add to this or specify a custom type on the model.

> attrTypes can also be defined on the Collection.


#### Supported Types

```js
window.Backbone.ModelAttrTypes = {
	'string': function(val){ return String(val) },
	'bool': function(val){ return !!val },
	'int': function(val){ return parseInt(val) },
	'float': function(val){ return parseFloat(val) },
	'num': function(val){ return parseFloat(val) }, // alias for float
	'date': function(val){ return new Date(val) },
	// moment.js support
	'moment': function(val){ return window.moment ? moment(val) : new Date(val) }
}
```

#### Custom Types

```js
var CustomTypedModel = Backbone.Model.extend({

	attrTypes: {
		'attrName': function(val){
			// convert val to type
			return val
		}
	}

});
```

### Casting to type

You can cast an attribute to a type on the fly by appending a pipe `|` and the type at the end of the attribute name.

```js
typedModel.get('runtime') // 4.75
typedModel.get('runtime|int') // 4
typedModel.get('runtime|string') // "4.75"
```

You can also cast as `raw` to get the original value stored in `attributes`

```js
typedModel.get('runtime|raw') // "4.75"
```

## Why?

The reason for this plugin is for when your model has an attribute in a string format (for JSON and database consistency) but you wish to use the value in code as a certain type. Rather than 1) continually converting the value to your desired type or 2) creating a secondary method to make this conversion, this plugin will do it for you.

It's designed to be non-obtrusive by refraining from overwriting the real value in `attributes` and allows you to continue using `.get(attr)` like normal.

## License

MIT © [Kevin Jantzer](http://kevinjantzer.com)