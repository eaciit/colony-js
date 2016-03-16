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
	optionModal:[],
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

var Setting_ModalQuery = {
	title : 'Data for',
	header :'<button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
				'<span aria-hidden="true">&times;</span>'+
			'</button>',
	footer: '<button type="button" class="btn btn-sm btn-warning" data-dismiss="modal">'+
				'<span class="glyphicon glyphicon-remove"></span> Close'+
			'</button>'+
			'<button type="button" class="btn btn-sm btn-primary">'+
				'<span class="glyphicon glyphicon-save"></span> Save'+
			'</button>',
	idModal: '',
}

var methodsQueryBuilder = {
	init: function(options){
		var modalquery = $.extend({}, Setting_ModalQuery, options.optionModal || {});
		var editor = $.extend({}, Setting_Editor, options.optionEditor || {});
		var settings = $.extend({}, Setting_QueryBuilder, options || {});
		settings.optionEditor = editor;
		settings.optionModal = modalquery;
		return this.each(function () {
			methodsQueryBuilder.createElement(this, settings);
		});
	},

	createElement: function(element, options){
		$(element).html("");
		var $content = $(element);
		var id = element.id;

		$divPanelBody = $('<div class="panel-body ecquerybuilder-panel"></div>');
		$divPanelBody.appendTo($content);
		$divInitialRow = $('<div class= "row form-datasource"></div>');
		$divInitialRow.appendTo($divPanelBody);
		
		methodsQueryBuilder.createCommandList(element, options, id);
		methodsQueryBuilder.createEditor(options, id);
	},

	createCommandList : function(element,options, id){
		$divCommand = $('<div class="col-md-'+options.widthCommand+' ecquerybuilder-commandlist nav-command" id="command-'+id+'"></div>');
		$divCommand.appendTo($divInitialRow);
		$labelCommand = $('<label class="title-command ecquerybuilder-commandlist" id="label-'+id+'">Commands</label>');
		$labelCommand.appendTo($divCommand);

		$ulCommand = $('<ul class="nav ecquerybuilder-commandlist" id="ul-'+id+'"></ul>');
		$ulCommand.appendTo($divCommand);

		for(var key in options.command){
			for(var i = 0; i < commandList.length; i++) {
			   if(commandList[i].key === options.command[key]) {var commandKey = commandList[i].key;
			     $listCommand = $('<li><a href="#" id="li-'+id+'-'+commandList[i].key+'"><span class="fa fa-caret-right"></span>&nbsp;<span style="text-transform: capitalize;">'+commandList[i].key+'</span></a></li>');
				  (function(i) {
			           $listCommand.click( function(){
			           $.fn.ecQueryBuilderShowModal(element, options,commandList[i].key,id);
			         });
			      }(i));
				 $listCommand.appendTo($ulCommand);
			   }
			}
		}
	},

	createEditor : function(options, id){
		var opt = options.optionEditor;
		$divQueryEditor = $('<div class="col-md-'+options.widthEditor+' area-command ecquerybuilder-editor"></div>');
		$divQueryEditor.appendTo($divInitialRow);
		$labelEditor = $('<label class="title-command ecquerybuilder-editor-label">Query Editor</label>');
		$labelEditor.appendTo($divQueryEditor);
		$inputEditor = $('<input type="text" id="input-'+id+'-'+opt.inputEditorId+'" name="'+opt.inputEditorName+'" placeholder="Input query commands"/>');
		$inputEditor.appendTo($divQueryEditor);

		$('#input-'+id+'-'+opt.inputEditorName+'').ecLookupDD({
			dataSource: opt.dataSource, 
			inputType: opt.inputType,
			inputSearch: opt.inputSearch, 
			idField: opt.idField, 
			idText: opt.idText,
			displayFields: opt.displayFields,
			minHeight: opt.minHeight, 
		});
	},

/*	modalShow : function(element,options, queryBuilderMode, id){
		var $content = $(element);
		var opt = options.optionModal;
		var idModal = (opt.idModal == '' ? "modal-"+id : opt.idModal);

		$divInitialModal = $('<div class="modal fade modal-query" tabindex="-1" role="dialog" id="'+idModal+'"></div>');
		$divInitialModal.appendTo($content);
		$divInitialDialog = $('<div class="modal-dialog ecquerybuilder-modal"></div>');
		$divInitialDialog.appendTo($divInitialModal);
		$divModalContent = $('<div class="modal-content"></div>');
		$divModalContent.appendTo($divInitialDialog);
		$divModalHeader = $('<div class="modal-header"></div>');
		$divModalHeader.appendTo($divModalContent);
		$divModalBody = $('<div class="modal-body query-of-'+queryBuilderMode+'"></div>');
		$divModalBody.appendTo($divModalContent);
		$divModalFooter = $('<div class="modal-footer"></div>');
		$divModalFooter.appendTo($divModalContent);
		$header = $(opt.header);
		$header.appendTo($divModalHeader);
		$title = $('<h4>Data for <span class="ecquerybuilder-modal-title">'+queryBuilderMode+'</span></h4>');
		$title.appendTo($divModalHeader);
		$footer = $(opt.footer);
		$footer.appendTo($divModalFooter);

		if(queryBuilderMode === 'select'){
			$modalBody = $('<div class="form-group">'+
		    		'<label class="col-md-4 filter-label">Fields</label>'+
		        	'<div class="col-md-5">'+
		        		'<input type="text" class="full-width form-control" >'+
		        	'</div>'+
		        	'<div class="clearfix"></div>'+
	        	'</div>');
		    $modalBody.appendTo($divModalBody);
		    $('#'+idModal).modal('show');
		}
		else if(queryBuilderMode === 'insert' || queryBuilderMode === 'update'){
			$(".modal-body").empty();
			$modalBody = $('<div class="col-md-12" style="margin-bottom: 10px;">'+
					'<button class="btn btn-sm btn-primary">'+
						'<span class="glyphicon glyphicon-plus"></span>'+
						'Add more'+
					'</button>'+
				'</div>');
		    $modalBody.appendTo($divModalBody);
		    $('#'+idModal).modal('show');
		    
		}

		// $('#'+idModal).on('hidden.bs.modal', function () {
		//     $(this).modal({show: false});
		// 	$(".modal-body").empty();
		// });
		console.log(queryBuilderMode);

	}*/
}

$.fn.ecQueryBuilderShowModal = function(element,options, queryBuilderMode, idModal){
		var $content = $(element);
		var opt = options.optionModal;
		var idModal = (opt.idModal == '' ? "modal-"+id : opt.idModal);

		$divInitialModal = $('<div class="modal fade modal-query" tabindex="-1" role="dialog" id="'+idModal+'"></div>');
		$divInitialModal.appendTo($content);
		$divInitialDialog = $('<div class="modal-dialog ecquerybuilder-modal"></div>');
		$divInitialDialog.appendTo($divInitialModal);
		$divModalContent = $('<div class="modal-content"></div>');
		$divModalContent.appendTo($divInitialDialog);
		$divModalHeader = $('<div class="modal-header"></div>');
		$divModalHeader.appendTo($divModalContent);
		$divModalBody = $('<div class="modal-body query-of-'+queryBuilderMode+'"></div>');
		$divModalBody.appendTo($divModalContent);
		$divModalFooter = $('<div class="modal-footer"></div>');
		$divModalFooter.appendTo($divModalContent);
		$header = $(opt.header);
		$header.appendTo($divModalHeader);
		$title = $('<h4>Data for <span class="ecquerybuilder-modal-title">'+queryBuilderMode+'</span></h4>');
		$title.appendTo($divModalHeader);
		$footer = $(opt.footer);
		$footer.appendTo($divModalFooter);

/*		if(queryBuilderMode === 'select'){
			$modalBody = $('<div class="form-group">'+
		    		'<label class="col-md-4 filter-label">Fields</label>'+
		        	'<div class="col-md-5">'+
		        		'<input type="text" class="full-width form-control" >'+
		        	'</div>'+
		        	'<div class="clearfix"></div>'+
	        	'</div>');
		    $modalBody.appendTo($divModalBody);
		    $('#'+idModal).modal('show');
		}
		else if(queryBuilderMode === 'insert' || queryBuilderMode === 'update'){
			$modalBody = $('<div class="col-md-12" style="margin-bottom: 10px;">'+
					'<button class="btn btn-sm btn-primary">'+
						'<span class="glyphicon glyphicon-plus"></span>'+
						'Add more'+
					'</button>'+
				'</div>');
		    $modalBody.appendTo($divModalBody);
		    $('#'+idModal).modal('show');
		    
		}
		*/
		$('#'+idModal).modal('show');
		console.log(queryBuilderMode);
}


