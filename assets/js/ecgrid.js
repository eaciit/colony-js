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
	displayTemplate: "",
	field: "",
	title: "",
	displayTemplateHeader: "",
	classHeader: "",
	attrHeader: {},
	width: "",
	freeze: false,
	footer: false,
	displayTemplateFooter: "",
	classFooter: "",
	attrFooter: {},
	columns: [],
}

var methodsGrid = {
	init: function(options){
		var settings = $.extend({}, Settings_EcLookup, options || {});
		return this.each(function () {
			$(this).data("ecGrid", new $.ecGridSetting(this,settings));
			$(this).data("ecGridDataSource", new $.ecDataSource(this,settings['dataSource'], "ecGridDataSource"));
			methodsGrid.createElementGrid(this, settings);
		});
	},
	createElementGrid: function(element, options){
		$(element).html("");
		var $o = $(element);
		$o.data('ecGridDataSource').Reload();
		var data = $o.data('ecGridDataSource').getDataSource();
		var headcol = options.columns;
		console.log(JSON.stringify(data));
		for(var e=0; e< headcol.length; e++){
			console.log(headcol[e].title);
		}

		$divGrid = $('<table class="table ecgrid table-bordered table-striped"></table>');
		$divGrid.appendTo($o);
		$tagHead = $('<thead class="ec-gridhead"></thead>');
		$tagHeadtr = $('<tr></tr>');
		for (var a = 0; a < headcol.length; a++){
			$tagHeadth = $('<th>'+headcol[a].title+'</th>');
			$tagHeadth.appendTo($tagHeadtr);
		}
		$tagHeadtr.appendTo($tagHead);
		$tagHead.appendTo($divGrid);
		for (var i = 0; i < data.length; i++) {
			$tagRowtr = $('<tr></tr>');
			$tagRowtr.appendTo($divGrid);
			for( var a = 0; a< headcol.length; a++){
				$tagRowtd = $('<td>'+data[i][headcol[a].field]+'</td>');
				$tagRowtd.appendTo($tagRowtr);
			}
		}
	},
	reloadData: function(options){

	},
}
$.fn.ecGrid = function (method) {
	if (methodsGrid[method]) {
		return methodsGrid[method].apply(this, Array.prototype.slice.call(arguments, 1));
	} else {
		methodsGrid['init'].apply(this,arguments);
	}
}

$.ecGridSetting = function(element, options){
	
}