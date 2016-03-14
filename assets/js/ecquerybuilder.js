$.fn.ecQueryBuilder = function (method) {
	if (methodsQueryBuilder[method]) {
		return methodsQueryBuilder[method].apply(this, Array.prototype.slice.call(arguments, 1));
	} else {
		methodsQueryBuilder['init'].apply(this,arguments);
	}
}

var commandList = [
		{ id: 0, key: "select", type: "field, field", value: ""},
		{ id: 0, key: "insert", type: "", value: ""},
		{ id: 0, key: "update", type: "", value: ""},
		{ id: 0, key: "delete", type: "", value: ""},
		{ id: 0, key: "command", type: "field, field", value: ""},
		{ id: 0, key: "from", type: "table", value: ""},
		{ id: 0, key: "where", type: "string", value: ""},
		{ id: 0, key: "order", type: "string", value: ""},
		{ id: 0, key: "take", type: "number", value: ""},
		{ id: 0, key: "skip", type: "number", value: ""},
];

var dataQueryWhere = [
	{ key: "And", title: "And", type: "Array Query" },
	{ key: "Or", title: "Or", type: "Array Query" },
	{ key: "Eq", title: "Equal", type: "field,value" },
	{ key: "Ne", title: "Not Equal", type: "field,value" },
	{ key: "Lt", title: "Lower Than", type: "field,value" },
	{ key: "Lte", title: "Lower Than / Equal", type: "field,value" },
	{ key: "Gt", title: "Greater Than", type: "field,value" },
	{ key: "Gte", title: "Greater Than / Equal", type: "field,value" },
	{ key: "In", title: "In", type: "field, array string" },
	{ key: "Nin", title: "Not In", type: "field, array string" },
	{ key: "Contains", title: "Contains", type: "field, array string" },
];

var Setting_QueryBuilder = {
	title : "",
	widthCommand : 2,
	widthEditor : 10,
	inputEditorName : 'textquery',
	inputEditorId : 'textquery',
	command : ["select","insert","update","delete","command","from","where","order","take","skip"],
}

var methodsQueryBuilder = {
	init: function(options){
		var settings = $.extend({}, Setting_QueryBuilder, options || {});
		return this.each(function () {
			methodsQueryBuilder.createElement(this, settings);
		});
	},

	createElement: function(element, options){
		$(element).html("");
		var $content = $(element);

		$divPanelBody = $('<div class="panel-body ecquerybuilder-panel"></div>');
		$divPanelBody.appendTo($content);
		$divInitialRow = $('<div class= "row form-datasource"></div>');
		$divInitialRow.appendTo($divPanelBody);
		$divCommand = $('<div class="col-md-'+options.widthCommand+' nav-command"></div>');
		$divCommand.appendTo($divInitialRow);
		$labelCommand = $('<label class="title-command">Commands</label>');
		$labelCommand.appendTo($divCommand);
		$divQueryEditor = $('<div class="col-md-'+options.widthEditor+' area-command"></div>');
		$divQueryEditor.appendTo($divInitialRow);
		$labelEditor = $('<label class="title-command">Query Editor</label>');
		$labelEditor.appendTo($divQueryEditor);
		$inputEditor = $('<textarea id="'+options.inputEditorId+'" name="'+options.inputEditorName+'" placeholder="Input query commands"/>');
		$inputEditor.appendTo($divQueryEditor);

		$ulCommand = $('<ul class="nav"></ul>');
		$ulCommand.appendTo($divCommand);

		for(var key in options.command){
			for(var i = 0; i < commandList.length; i++) {
			   if(commandList[i].key === options.command[key]) {
			     $listCommand = $('<li><a href="#"><span class="fa fa-caret-right"></span>&nbsp;<span style="text-transform: capitalize;">'+commandList[i].key+'</span></a></li>');
				 $listCommand.appendTo($ulCommand);
			   }
			}
		}

		$('#'+options.inputEditorName+'').ecLookupDD({
			dataSource:{
				data: commandList,
				resultData: function(a){
							console.log(a);
							return a;
						}
			}, 
			inputType: 'multiple',
			inputSearch: 'key', 
			idField: 'id', 
			idText: 'key', 
		});
		
	},
}



