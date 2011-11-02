/*
DateUp v0.2 - JavaScript method-utility for converting date in json format to Date object
Author: Nazarov P.A. (xunter@list.ru)
Date: 2011-11-01
Example:
	var obj = {date: "2011-10-10T10:10:10.20"};
	var objWithDate = dup(obj); //objWithDate.date ~== 	new Date(2011, 10, 10, 10, 10, 10, 20)
*/
!function(window) {
	var
		RE = /^\/Date\(([0-9-+]+)\)\/$/,
		ISO8601_RE = /^(\d{2,4})-(\d{1,2})-(\d{1,2})T(\d{1,2}):(\d{1,2}):(\d{1,2})\.(\d{1,3})(Z|([+|-](\d+)|(\d{1,2}:\d{1,2})))$/,
		
		useJQueryDataFilter = typeof(window.dup) !== "undefined" && typeof(window.dup.jQueryDataFilter) === "boolean" ? dup.jQueryDataFilter : typeof(jQuery) !== "undefined",
		
		parseDateForRE = function(text) {
			return new Date(parseInt(text.match(RE)[1]));
		},
		
		parseDateForISO8601RE = function(text) {			
			var matches = text.match(ISO8601_RE);
			if (matches === null) return text;
			
			for (var i=0; i<matches.length; i++)
				matches[i] = parseInt(matches[i]);
			
			var
				year = matches[1],
				month = matches[2],
				day = matches[3],
				hours = matches[4],
				minutes = matches[5],
				seconds = matches[6],
				ms = matches[7];
										
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
		},
		
		setJQueryDataFilter = function() {
			jQuery.ajaxSetup({
				"dataFilter": function (data, type) {
					if (type === "json") {
						data = jQuery.parseJSON(data);
						return dup(data);
					}
					return data;
				}
			});
		},
		
		jQueryDataFilter = dup.jQueryDataFilter = function(value) {
			if (arguments.length) {
				useJQueryDataFilter = value;
				if (value && typeof(jQuery) !== "undefined")
					setJQueryDataFilter();
				
				return dup;
			} else
				return useJQueryDataFilter;
		};
		
		if (useJQueryDataFilter)
			jQueryDataFilter(true);
		
}(window)