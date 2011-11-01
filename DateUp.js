/*
DateUp - JavaScript method-utility for converting date in json format to Date object

var obj = {date: "2011-10-10T10:10:10.20"};
var objWithDate = dup(obj);
*/
!function(window, $) {
	var
		RE = /^\/Date\(([0-9-+]+)\)\/$/,
		ISO8601_RE = /^(\d{2,4})-(\d{1,2})-(\d{1,2})T(\d{1,2}):(\d{1,2}):(\d{1,2})\.(\d{1,3})(Z|([+|-](\d+)|(\d{1,2}:\d{1,2})))$/,
		
		jQueryDataFilter = true,
		
		parseDateForRE = function(text) {
			return new Date(parseInt(text.match(RE)[1]));
		},
		
		parseDateForISO8601RE = function(text) {			
			var
				matches = text.match(ISO8601_RE),
				year = parseInt(matches[1]),
				month = parseInt(matches[2]),
				day = parseInt(matches[3]),
				hours = parseInt(matches[4]),
				minutes = parseInt(matches[5]),
				seconds = parseInt(matches[6]),
				ms = parseInt(matches[7]);
										
			return new Date(year, month-1, day, hours, minutes, seconds, ms);
		},
				
		isTypeOf = function(obj, typeName) {
			return ~Object.prototype.toString.call(obj).search(typeName);
		},
		
		isObject = function(obj) {
			return isTypeOf(obj, "Object");
		},
		
		isArray = function(obj) {
			return isTypeOf(obj, "Array");
		},
				
		dup = window.dup = function(obj, filterFunction) {		
			if (obj == null || typeof(obj) === "undefined")
				return obj;
			
			if (isObject(obj)) {
				for (var key in obj)
					if (obj.hasOwnProperty(key))
						obj[key] = dup(obj[key], filterFunction);
						
				return obj;
			} else if (isArray(obj)) {
				for (var i=0; i<obj.length; i++)
					obj[i] = dup(obj[i], filterFunction);
					
				return obj;
			} else if (typeof(obj) === "string")
				if (RE.test(obj) && (!filterFunction || filterFunction(obj)))
					return parseDateForRE(obj);
				else if (ISO8601_RE.test(obj) && (!filterFunction || filterFunction(obj)))
					return parseDateForISO8601RE(obj);
			
			return obj;
		};
		
		dup.jQueryDataFilter = function(value) {
			jQueryDataFilter = value;
			
			return dup;
		};
		
		if ($ && jQueryDataFilter)
			$.ajaxSetup({
				"dataFilter": function (data, type) {
					if (type === "json") {
						data = $.parseJSON(data);
						return dup(data);
					}
					return data;
				}
			});
}(window, jQuery)