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
	optionEditor : {},
	optionModal:{},
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
	dataCollection : [],
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
		//console.log(options.optionModal.dataCollection);
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
}

$.fn.ecQueryBuilderShowModal = function(element,options, queryBuilderMode, idModal){
		var $content = $(element);
		var opt = options.optionModal;
		var idModal = (opt.idModal == '' ? "modal-"+idModal : opt.idModal);

		$('#'+idModal).remove();

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

		switch(queryBuilderMode){
			case 'select':
				$modalBody =  $('<div class="form-group">'+
		    		'<label class="col-md-4 filter-label">Fields</label>'+
		        	'<div class="col-md-5">'+
		        		'<input type="text" class="full-width form-control input-sm" >'+
		        	'</div>'+
		        	'<div class="clearfix"></div>'+
	        	'</div>');
	        	$modalBody.appendTo($divModalBody);
				$('#'+idModal).modal('show');
	        	break;
	        case 'insert':
	        case 'update':
	        	$modalBody = $('<div class="col-md-12" style="margin-bottom: 10px;">'+
					'<button class="btn btn-sm btn-success">'+
						'<span class="glyphicon glyphicon-plus"></span>'+
						'Add more'+
					'</button>'+
				'</div>'+
	        	'<div class="col-md-12">'+
				    '<div class="form-group">'+
				        '<label class="col-sm-2 filter-label" style="text-align: right; padding-left: 0px;">Field</label>'+
	        			'<div class="col-md-3" style="padding-left: 0px;">'+
	        				'<input required data-required-msg="Field cannot be empty" type="text" class="form-control input-sm full-width" placeholder="Type field here"/>'+
		        			'<span class="k-invalid-msg"></span>'+
	        			'</div>'+
				        '<label class="col-sm-2 filter-label" style="text-align: right; padding-left: 0px;">Value</label>'+
	        			'<div class="col-md-3" style="padding-left: 0px;">'+
	        				'<input required data-required-msg="Value cannot be empty" type="text" class="form-control input-sm full-width" placeholder="Type value here"/>'+
		        			'<span class="k-invalid-msg"></span>'+
	        			'</div>'+
	        			'<div class="col-md-1">'+
							'<button class="btn btn-sm btn-danger">'+
								'<span class="glyphicon glyphicon-remove"></span>'+
							'</button>'+
	        			'</div>'+
        				'<div class="clearfix"></div>'+
				    '</div>'+
	        	'</div>'+
	        	'<div class="clearfix"></div>');
	        	$modalBody.appendTo($divModalBody);
				$('#'+idModal).modal('show');
	        	break;
	        case 'from' :
	        	$modalBody = $('<div class="form-group">'+
		    		'<label class="col-md-4 filter-label">Table Name</label>'+
		        	'<div class="col-md-6">'+
		        		'<select required data-required-msg="Table name cannot be empty" name="query-from" class="form-control input-sm full-width"></select>'+
		        		'<span class="k-invalid-msg" data-for="query-from"></span>'+
		        	'</div>'+
		        	'<div class="clearfix"></div>'+
	        	'</div>');
	        	$modalBody.appendTo($divModalBody);
				$('#'+idModal).modal('show');
	        	break;
	        case 'order':
	        	$modalBody = $('<div class="col-md-12" style="margin-bottom: 10px;">'+
					'<button class="btn btn-sm btn-success">'+
						'<span class="glyphicon glyphicon-plus"></span>'+
						'Add more'+
					'</button>'+
				'</div>'+
	        	'<div class="col-md-12">'+
					'<table class="table">'+
						'<thead>'+
							'<tr>'+
								'<th>Field</th>'+
								'<th>Direction</th>'+
								'<th>&nbsp;</th>'+
							'</tr>'+
						'</thead>'+
						'<tbody class="query-of-order">'+
							'<tr>'+
								'<td>'+
			        				'<select required class="form-control input-sm" data-required-msg="Field cannot be empty"></select>'+
									'<span class="k-invalid-msg"></span>'+
								'</td>'+
								'<td>'+
			        				'<select required class="form-control input-sm" data-required-msg="Value cannot be empty"></select>'+
									'<span class="k-invalid-msg"></span>'+
								'</td>'+
								'<td>'+
									'<button class="btn btn-sm btn-danger">'+
										'<span class="glyphicon glyphicon-remove"></span>'+
									'</button>'+
								'</td>'+
							'</tr>'+
						'</tbody>'+
					'</table>'+
				'</div>'+
				'<div class="clearfix"></div>');
				$modalBody.appendTo($divModalBody);
				$('#'+idModal).modal('show');
				break;
			case 'skip':
			case 'take':
				$modalBody = $('<div class="form-group">'+
		    		'<label class="col-md-5 filter-label" style="text-align: right; text-transform: capitalize">Total '+queryBuilderMode+' records</label>'+
		        	'<div class="col-md-4">'+
		        		'<input type="text" class="full-width form-control input-sm"/>'+
		        	'</div>'+
		        	'<div class="clearfix"></div>'+
	        	'</div>');
	        	$modalBody.appendTo($divModalBody);
				$('#'+idModal).modal('show');
	        	break;
	        case 'command':
	        	$modalBody = $('<div class="col-md-12">'+
				    '<div class="form-group">'+
				        '<label class="col-sm-2 filter-label" style="text-align: right; padding-left: 0px;">Command</label>'+
	        			'<div class="col-md-4" style="padding-left: 0px;">'+
	        				'<input required data-required-msg="Command cannot be empty" type="text" class="form-control input-sm full-width" placeholder="Type command here"/>'+
		        			'<span class="k-invalid-msg"></span>'+
	        			'</div>'+
				        '<label class="col-sm-2 filter-label" style="text-align: right; padding-left: 0px;">Param</label>'+
	        			'<div class="col-md-4" style="padding-left: 0px;">'+
	        				'<input required data-required-msg="Param cannot be empty" type="text" class="form-control input-sm full-width" placeholder="Type param here"/>'+
		        			'<span class="k-invalid-msg"></span>'+
	        			'</div>'+
        				'<div class="clearfix"></div>'+
				    '</div>'+
	        	'</div>'+
	        	'<div class="clearfix"></div>');
	        	$modalBody.appendTo($divModalBody);
				$('#'+idModal).modal('show');
	        	break;
	        default:
		}		
}
