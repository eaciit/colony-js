$.fn.ecGrid = function (method) {
	if (methodsGrid[method]) {
		return methodsGrid[method].apply(this, Array.prototype.slice.call(arguments, 1));
	} else {
		methodsGrid['init'].apply(this,arguments);
	}
}

$(function() {
	
});

// var dataku;
// var records;
var coba = '';

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
	attrColoumn: {},
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
		var $o = $(element), $container = $o.parent(), idgrid = $o.attr('id'), columndata = {}, footerTemp = false, $divHeadCol, $divRightCol;
		$o.data('ecGridDataSource').Reload();
		var dataku = $o.data('ecGridDataSource').getDataSource(),  objfreeze = {};
		var records = $o.data('ecGrid').mark(dataku, objfreeze, 1);
		
		$divTable = $("<div class='ecgrid-tbcontainer'></div>");
		$divTable.appendTo($o);

		options.columns.map(function (a,b) { 
			columndata = $.extend({}, Setting_Coloumn, options.columns[b] || {});
			if (columndata.freeze in objfreeze) objfreeze[columndata.freeze].push(columndata); else objfreeze[columndata.freeze] = [columndata]; } 
		);
	
		var splitElement = "", elementCreate = "";
		if (objfreeze.true){
			$divHeadCol = $("<div class='ecgrid-headcol'></div>");
			$divHeadCol.appendTo($divTable);

			$tablehead = $("<table class='table ecgrid table-bordered table-striped'></table>");
			$tablehead.appendTo($divHeadCol);

			$tagHead = $('<thead class="ecgrid-head"></thead>');
			$tagHead.appendTo($tablehead);
			$tagHeadtr = $('<tr></tr>');
			$tagHeadtr.appendTo($tagHead);
			$tagFootHeadtr = $('<tr></tr>');
			for (var a = 0; a < objfreeze.true.length; a++){
				$tagFoottd = $('<th>&nbsp;</th>');
				if(objfreeze.true[a].displayTemplateFooter != ""){
					footerTemp = true;
					$tagFoottd = $('<th>'+objfreeze.true[a].displayTemplateFooter+'</th>');
				}
				$tagFoottd.addClass(objfreeze.true[a].classFooter);
				$tagFoottd.appendTo($tagFootHeadtr);

				$tagHeadth = $('<th>&nbsp;</th>');
				if (objfreeze.true[a].displayTemplateHeader != "")
					$tagHeadth = $('<th>'+objfreeze.true[a].displayTemplateHeader+'</th>');
				else if (objfreeze.true[a].title != "" && objfreeze.true[a].displayTemplateHeader == "")
					$tagHeadth = $('<th>'+objfreeze.true[a].title+'</th>');
				$tagHeadth.addClass(objfreeze.true[a].classHeader);
				$tagHeadth.css("width", objfreeze.true[a].width);
				$tagHeadth.appendTo($tagHeadtr);
			}
			$tagbody = $('<tbody class="ecgrid-body"></tbody>');
			$tagbody.appendTo($tablehead);

			for (var i = 0; i < records.length; i++) {
				$tagRow = $('<tr></tr>');
				$tagRow.appendTo($tagbody);
				for( var a = 0; a < objfreeze.true.length; a++){
					if(objfreeze.true[a].displayTemplateRow() != "" ){
						splitElement = objfreeze.true[a].displayTemplateRow().split('#'); elementCreate = '';
						for (var key in splitElement){
							var res = splitElement[key].substring(0,1);
							if (res == '*'){
								elementCreate += records[i][splitElement[key].substring(1,splitElement[key].length)];
							} else {
								elementCreate += splitElement[key];
							}
						}
						$tagColoumn = $('<td>'+elementCreate+'</td>');
					}else{
						$tagColoumn = $('<td>'+records[i][objfreeze.true[a].field]+'</td>');
					}
					$tagColoumn.attr(objfreeze.true[a].attrColoumn);
					$tagColoumn.appendTo($tagRow);
				}
			}
			$divRightCol = $("<div class='ecgrid-rightcol'></div>");
			$divRightCol.appendTo($divTable);
		}

		$tableElem = $('<table class="table ecgrid table-bordered table-striped"></table>');
		if (objfreeze.true){
			$tableElem.appendTo($divRightCol);
		} else {
			$tableElem.appendTo($o);
		}

		$tagHead = $('<thead class="ecgrid-head"></thead>');
		$tagHead.appendTo($tableElem);
		$tagHeadtr = $('<tr></tr>');
		$tagHeadtr.appendTo($tagHead);
		$tagbody = $('<tbody class="ecgrid-body"></tbody>');
		$tagbody.appendTo($tableElem);

		$tagFoottr = $('<tr></tr>');
		var widthRight = 0;
		for (var a = 0; a < objfreeze.false.length; a++){
			$tagFoottd = $('<th>&nbsp;</th>');
			if(objfreeze.false[a].displayTemplateFooter != ""){
				footerTemp = true;
				$tagFoottd = $('<th>'+objfreeze.false[a].displayTemplateFooter+'</th>');
			}
			$tagFoottd.addClass(objfreeze.false[a].classFooter);
			$tagFoottd.appendTo($tagFoottr);

			$tagHeadth = $('<th>&nbsp;</th>');
			if (objfreeze.false[a].displayTemplateHeader != "")
				$tagHeadth = $('<th>'+objfreeze.false[a].displayTemplateHeader+'</th>');
			else if (objfreeze.false[a].title != "" && objfreeze.false[a].displayTemplateHeader == "")
				$tagHeadth = $('<th>'+objfreeze.false[a].title+'</th>');
			$tagHeadth.addClass(objfreeze.false[a].classHeader);
			if (objfreeze.false[a].width != 0)
				$tagHeadth.css("width", objfreeze.false[a].width);
			widthRight += objfreeze.false[a].width;
			$tagHeadth.appendTo($tagHeadtr);
		}
		if (widthRight > 0 && objfreeze.true != undefined){
			$tableElem.css("width",widthRight+'px');
		}
		if (footerTemp){
			$tagFoot = $('<tfoot></tfoot>');
			$tagFoottr.appendTo($tagFoot);
			$tagFoot.appendTo($tableElem);

			if (objfreeze.true){
				$tagFootHead = $('<tfoot></tfoot>');
				$tagFootHeadtr.appendTo($tagFootHead);
				$tagFootHead.appendTo($tablehead);
			}
		}

		var splitElement = "", elementCreate = "";
		for (var i = 0; i < records.length; i++) {
			$tagRow = $('<tr></tr>');
			$tagRow.appendTo($tagbody);
			for( var a = 0; a < objfreeze.false.length; a++){
				if(objfreeze.false[a].displayTemplateRow() != "" ){
					splitElement = objfreeze.false[a].displayTemplateRow().split('#'); elementCreate = '';
					for (var key in splitElement){
						var res = splitElement[key].substring(0,1);
						if (res == '*'){
							elementCreate += records[i][splitElement[key].substring(1,splitElement[key].length)];
						} else {
							elementCreate += splitElement[key];
						}
					}
					$tagColoumn = $('<td>'+elementCreate+'</td>');
				}else{
					$tagColoumn = $('<td>'+records[i][objfreeze.false[a].field]+'</td>');
				}
				$tagColoumn.attr(objfreeze.false[a].attrColoumn);
				$tagColoumn.appendTo($tagRow);
			}
		}
		if (objfreeze.true){
			$divRightCol.css("height",($tableElem.height()+2)+'px');
			$o.find('.ecgrid-rightcol table>tbody>tr').each(function( index ) {
				$o.find('.ecgrid-headcol table>tbody>tr').eq(index).css("height",$(this).height());
			});
		}

		var num_page = Math.ceil(dataku.length/options.pageable.buttonCount);
		for(var e=0; e< num_page; e++){
			//$divbutton = $("<div type='button' id='coba' class='btn btn-sm btn-success' value='"+(e+1)+"'>"+(e+1)+"</div>");
			$divbutton = $('<button  value="'+(e+1)+'">'+(e+1)+'</button>').click(function (event) {
				value = parseInt($(event.target).text());
				$o.data('ecGrid').mark1(dataku, objfreeze, value); 
			});
			$divbutton.appendTo($o);
		}

	},
	reloadData: function(options){

	},
}	

$.ecGridSetting = function(element, options){
	var $o = $(element), $container = $o.parent(), idgrid = $o.attr('id')
	this.num_page
	this.pageSize = options.pageable.buttonCount;
	this.mark=function(data, objfreeze, page){
		var end = this.pageSize * page;
		var mulai = this.pageSize * (page - 1);
		var hasil = data.slice(mulai,end);
		//$container.find('#cur_page_'+idgrid).val(page);
		//$o.data('ecGrid').makepager(data, page);
		return hasil;
	}

	this.mark1=function(data, objfreeze, page){
		this.el = $container.find('.ecgrid tbody');
		$container.find(".ecgrid tbody").empty();
		this.num_page += Math.ceil(data.length / 5);
		this.cur_link = (5 >= 0 ? 1 : 5 + 1);
		var end = this.pageSize * page;
		var mulai = this.pageSize * (page - 1);
		var hasil = data.slice(mulai,end);

		if(objfreeze.false.length != options.columns.length){
			var splitElement = "", elementCreate = "";
			for (var i = 0; i < hasil.length; i++) {
				$tagRow = $('<tr></tr>');
				$tagRow.appendTo($container.find(".ecgrid-headcol tbody"));
				for( var a = 0; a < objfreeze.true.length; a++){
					if(objfreeze.true[a].displayTemplateRow() != "" ){
						splitElement = objfreeze.true[a].displayTemplateRow().split('#'); elementCreate = '';
						for (var key in splitElement){
							var res = splitElement[key].substring(0,1);
							if (res == '*'){
								elementCreate += hasil[i][splitElement[key].substring(1,splitElement[key].length)];
							} else {
								elementCreate += splitElement[key];
							}
						}
						$tagColoumn = $('<td>'+elementCreate+'</td>');
					}else{
						$tagColoumn = $('<td>'+hasil[i][objfreeze.true[a].field]+'</td>');
					}
					$tagColoumn.attr(objfreeze.true[a].attrColoumn);
					$tagColoumn.appendTo($tagRow);
				}
			}
			// $divRightCol = $("<div class='ecgrid-rightcol'></div>");
			// $divRightCol.appendTo($divTable);
			
			for (var i = 0; i < hasil.length; i++) {
				$tagRow = $('<tr></tr>');
				$tagRow.appendTo($container.find(".ecgrid-rightcol tbody"));
				for( var a = 0; a < objfreeze.false.length; a++){
					if(objfreeze.false[a].displayTemplateRow() != "" ){
						splitElement = objfreeze.false[a].displayTemplateRow().split('#'); elementCreate = '';
						for (var key in splitElement){
							var res = splitElement[key].substring(0,1);
							if (res == '*'){
								elementCreate += hasil[i][splitElement[key].substring(1,splitElement[key].length)];
							} else {
								elementCreate += splitElement[key];
							}
						}
						$tagColoumn = $('<td>'+elementCreate+'</td>');
					}else{
						$tagColoumn = $('<td>'+hasil[i][objfreeze.false[a].field]+'</td>');
					}
					$tagColoumn.attr(objfreeze.false[a].attrColoumn);
					$tagColoumn.appendTo($tagRow);
				}
			}
			if (objfreeze.true){
				$container.find(".ecgrid-rightcol tbody").css("height",($tableElem.height()+2)+'px');
				$o.find('.ecgrid-rightcol table>tbody>tr').each(function( index ) {
					$o.find('.ecgrid-headcol table>tbody>tr').eq(index).css("height",$(this).height());
				});
			}
		}else{
			for (var i = 0; i < hasil.length; i++) {
				$tagRow = $('<tr></tr>');
				$tagRow.appendTo($container.find(".ecgrid tbody"));
				for( var a = 0; a < objfreeze.false.length; a++){
					if(objfreeze.false[a].displayTemplateRow() != "" ){
						splitElement = objfreeze.false[a].displayTemplateRow().split('#'); elementCreate = '';
						for (var key in splitElement){
							var res = splitElement[key].substring(0,1);
							if (res == '*'){
								elementCreate += hasil[i][splitElement[key].substring(1,splitElement[key].length)];
							} else {
								elementCreate += splitElement[key];
							}
						}
						$tagColoumn = $('<td>'+elementCreate+'</td>');
					}else{
						$tagColoumn = $('<td>'+hasil[i][objfreeze.false[a].field]+'</td>');
					}
					$tagColoumn.attr(objfreeze.false[a].attrColoumn);
					$tagColoumn.appendTo($tagRow);
				}
			}
			$container.find(".ecgrid tbody").css("height",($tableElem.height()+2)+'px');
			
		}
	}


}