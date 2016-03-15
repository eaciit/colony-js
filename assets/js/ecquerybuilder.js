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
	command : ["select","insert","update","delete","command","from","where","order","take","skip"],
	optionEditor : [],
}

var Setting_Editor = {
	inputEditorName : 'textquery',
	inputEditorId : 'textquery',
	dataSource : {
		data : commandList
	},
	inputType: 'multiple',
	inputSearch: 'key', 
	idField: 'key', 
	idText: 'key',
	displayFields: 'key',
	minHeight:'100px', 

}

var methodsQueryBuilder = {
	init: function(options){
		var editor = $.extend({}, Setting_Editor, options.optionEditor || {});
		var settings = $.extend({}, Setting_QueryBuilder, options || {});
		settings.optionEditor = editor;
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
		
		methodsQueryBuilder.createCommandList(options);
		methodsQueryBuilder.createEditor(options);
	},

	createCommandList : function(options, id){
		$divCommand = $('<div class="col-md-'+options.widthCommand+' ecquerybuilder-commandlist nav-command"></div>');
		$divCommand.appendTo($divInitialRow);
		$labelCommand = $('<label class="title-command ecquerybuilder-commandlist">Commands</label>');
		$labelCommand.appendTo($divCommand);

		$ulCommand = $('<ul class="nav ecquerybuilder-commandlist"></ul>');
		$ulCommand.appendTo($divCommand);

		for(var key in options.command){
			for(var i = 0; i < commandList.length; i++) {
			   if(commandList[i].key === options.command[key]) {
			     $listCommand = $('<li><a href="#"><span class="fa fa-caret-right"></span>&nbsp;<span style="text-transform: capitalize;">'+commandList[i].key+'</span></a></li>');
				 $listCommand.appendTo($ulCommand);
			   }
			}
		}
	},

	createEditor : function(options, id){
		var opt = options.optionEditor;
		$divQueryEditor = $('<div class="col-md-'+options.widthEditor+' area-command"></div>');
		$divQueryEditor.appendTo($divInitialRow);
		$labelEditor = $('<label class="title-command">Query Editor</label>');
		$labelEditor.appendTo($divQueryEditor);
		$inputEditor = $('<input type="text" id="'+opt.inputEditorId+'" name="'+opt.inputEditorName+'" placeholder="Input query commands"/>');
		$inputEditor.appendTo($divQueryEditor);

		$('#'+opt.inputEditorName+'').ecLookupDD({
			dataSource: opt.dataSource, 
			inputType: opt.inputType,
			inputSearch: opt.inputSearch, 
			idField: opt.idField, 
			idText: opt.idText,
			displayFields: opt.displayFields,
			minHeight: opt.minHeight, 
		});
	},

}



