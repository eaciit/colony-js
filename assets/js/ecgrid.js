$.fn.ecGrid = function (method) {
	if (methodsGrid[method]) {
		return methodsGrid[method].apply(this, Array.prototype.slice.call(arguments, 1));
	} else {
		methodsGrid['init'].apply(this,arguments);
	}
}

$(function() {
	
});

var Settings_EcGrid = {
	serverSide: false,
	dataSource: {
		data:[],
		serverModel: {
			recordsTotal: "",
			recordsData: "",
		},
	},
	height: 0,
	width: 0,
	// groupable: true,
	sortable: true,
	pageable: {
		refresh: true,
		// pageSizes: true,
		buttonCount: 5,
	},
	columns: [],
	footer: {
		visible: false,
		columnIndex: 0,
		displayTemplate: "",
		field: "",
	},
	selectRow: function(res){

	},
	changePage: function(res){

	},
};

var Setting_Coloumn = {
	displayTemplateRow: function(){
		return "";	
	},
	field: "",
	title: "",
	displayTemplateHeader: "",
	classHeader: "",
	attrHeader: {},
	width: "",
	freeze: false,
	displayTemplateFooter: "",
	classFooter: "",
	attrFooter: {},
	columns: [],
}

var methodsGrid = {
	init: function(options){
		var settings = $.extend({}, Settings_EcGrid, options || {});
		var settingDataSources = $.extend({}, Setting_DataSource_Lookup, settings['dataSource'] || {});
		return this.each(function () {
			$(this).data("ecGrid", new $.ecGridSetting(this,settings));
			$(this).data("ecGridDataSource", new $.ecDataSource(this,settings['dataSource'], "ecGridDataSource"));
			methodsGrid.createElementGrid(this, settings);
		});
	},
	createElementGrid: function(element, options){
		$(element).html("");
		var $o = $(element), $container = $o.parent(), idgrid = $o.attr('id'), columndata = {}, footerTemp = false;
		$o.data('ecGridDataSource').Reload();
		var records = $o.data('ecGridDataSource').getDataSource();

		$divGrid = $('<table class="table ecgrid table-bordered table-striped"></table>');
		$divGrid.appendTo($o);
		$tagHead = $('<thead class="ecgrid-head"></thead>');
		$tagHead.appendTo($divGrid);
		$tagHeadtr = $('<tr></tr>');
		$tagHeadtr.appendTo($tagHead);
		$tagbody = $('<tbody class="ecgrid-body"></tbody>');
		$tagbody.appendTo($divGrid);

		$tagFoottr = $('<tr></tr>');
		for (var a = 0; a < options.columns.length; a++){
			columndata = $.extend({}, Setting_Coloumn, options.columns[a] || {});
			$tagFoottd = $('<th>&nbsp;</th>');
			if(columndata.displayTemplateFooter != ""){
				footerTemp = true;
				$tagFoottd = $('<th>'+columndata.displayTemplateFooter+'</th>');
			}
			$tagFoottd.appendTo($tagFoottr);

			$tagHeadth = $('<th>&nbsp;</th>');
			if (columndata.displayTemplateHeader != "")
				$tagHeadth = $('<th>'+columndata.displayTemplateHeader+'</th>');
			else if (columndata.title != "" && columndata.displayTemplateHeader == "")
				$tagHeadth = $('<th>'+columndata.title+'</th>');
			
			$tagHeadth.appendTo($tagHeadtr);

		}
		if (footerTemp){
			$tagFoot = $('<tfoot></tfoot>');
			$tagFoottr.appendTo($tagFoot);
			$tagFoot.appendTo($divGrid);
		}

		for (var i = 0; i < records.length; i++) {
			$tagRow = $('<tr></tr>');
			$tagRow.appendTo($tagbody);
			for( var a = 0; a < options.columns.length; a++){
				columndata = $.extend({}, Setting_Coloumn, options.columns[a] || {});
				if(columndata.displayTemplateRow() != "" ){
					$tagColoumn = $('<td>'+columndata.displayTemplateRow()+'</td>');
				}else{
					$tagColoumn = $('<td>'+records[i][columndata.field]+'</td>');
				}
				$tagColoumn.appendTo($tagRow);
			}
		}

	},
	reloadData: function(options){

	},
}

$.ecGridSetting = function(element, options){

}