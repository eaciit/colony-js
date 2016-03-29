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
		$input_curr = $('<input type="text" id="cur_page_'+idgrid+'" value="1" hidden>');
		$input_curr.appendTo($o);
		// if(objfreeze.false.length != options.columns.length){
		// 	var num_page = Math.ceil(dataku.length/options.pageable.buttonCount);
		// 	$divbutton = $("<div class='pagination pagination-sm' id='paginate' style='margin-top: -6px;'></div>");
		// 	$divback = $('<li id="back"><a class="glyphicon glyphicon-step-backward" style="margin-top:-1px;"></a></li>').click(function (event) {
		// 		value = parseInt($container.find('#cur_page_'+idgrid).val())-1;
		// 		if(value == 1 || parseInt($container.find('#cur_page_'+idgrid).val()) == 0){
		// 			$container.find('#back').hide();
		// 			$container.find('#forward').show();
		// 		}else{
		// 			$container.find('#back').show();
		// 			$container.find('#forward').hide();
		// 		}
		// 		if(value != 0){
		// 			$o.data('ecGrid').mark1(dataku, objfreeze, value);
		// 		}
				
		// 	});
		// 	$divback.appendTo($divbutton);
		// 	for(var e=0; e< num_page; e++){
		// 		$buttonpage = $('<li id="num"><a>'+(e+1)+'</a></li>').click(function (event) {
		// 			$(this).siblings('li').removeClass('active');
  //   				$(this).addClass('active');
		// 			value = parseInt($(event.target).text());
		// 			if(parseInt($container.find('#cur_page_'+idgrid).val())+1 == num_page || value == num_page || value +1 == num_page){
		// 				$container.find('#forward').hide();
		// 				$container.find('#back').show();
		// 			}else{
		// 				$container.find('#forward').show();
		// 				$container.find('#back').hide();
		// 			}
		// 			$o.data('ecGrid').mark1(dataku, objfreeze, value); 
		// 		});
		// 		$buttonpage.appendTo($divbutton);
		// 		$divbutton.appendTo($o);
		// 	}
		// 	$divnext = $('<li id="forward"><a class="glyphicon glyphicon-step-forward" style="margin-top:-1px;"></a></li>').click(function (event) {
		// 		value = parseInt($container.find('#cur_page_'+idgrid).val())+1;
		// 		if(parseInt($container.find('#cur_page_'+idgrid).val())+1 == num_page || parseInt($container.find('#cur_page').val()) == num_page){
		// 			$container.find('#forward').hide();
		// 			$container.find('#back').show();
		// 		}else{
		// 			$container.find('#forward').show();
		// 			$container.find('#back').hide();
		// 		}
		// 		$o.data('ecGrid').mark1(dataku, objfreeze, value); 
		// 	});
		// 	$divnext.appendTo($divbutton);
		// }else{
		// 	var nomor = 0;
		// 	var num_page = Math.ceil(dataku.length/options.pageable.buttonCount);
		// 	$divbutton = $("<div class='pagination pagination-sm' id='paginate' style='margin-top:20px;'></div>");
		// 	$divback = $('<li id="back"><a class="glyphicon glyphicon-step-backward" style="margin-top:-1px;"></a></li>').click(function (event) {
		// 		value = parseInt($container.find('#cur_page_'+idgrid).val())-1;
		// 		if(value == 1 || parseInt($container.find('#cur_page_'+idgrid).val()) == 0){
		// 			$container.find('#back').hide();
		// 			$container.find('#forward').show();
		// 		}else{
		// 			$container.find('#back').show();
		// 			$container.find('#forward').hide();
		// 		}
		// 		if(value != 0){
		// 			$o.data('ecGrid').mark1(dataku, objfreeze, value);
		// 		}
				
		// 	});
		// 	$divback.appendTo($divbutton);
		// 	for(var e=0; e< num_page; e++){
		// 		$buttonpage = $('<li id="num"><a>'+(e+1)+'</a></li>').click(function (event) {
		// 			//nomor = (e+1);
		// 			$(this).siblings('li').removeClass('active');
  //   				$(this).addClass('active');
		// 			value = parseInt($(event.target).text());
		// 			nomor = value;
		// 			if(  parseInt($container.find('#cur_page_'+idgrid).val())+1 == num_page || value == num_page || value +1 == num_page){
		// 				$container.find('#forward').hide();
		// 				$container.find('#back').show();
		// 			}else{
		// 				$container.find('#forward').show();
		// 				$container.find('#back').hide();
		// 			}
		// 			$o.data('ecGrid').mark1(dataku, objfreeze, value); 
		// 		});
		// 		$buttonpage.appendTo($divbutton);
		// 		$divbutton.appendTo($o);
		// 		nomor++;
		// 		console.log("nomor------", nomor);
		// 	}
		// 	$divnext = $('<li id="forward"><a class="glyphicon glyphicon-step-forward" style="margin-top:-1px;"></a></li>').click(function (event) {
		// 		value = parseInt($container.find('#cur_page_'+idgrid).val())+1;
		// 		if(value == num_page || parseInt($container.find('#cur_page_'+idgrid).val()) == num_page){
		// 			$container.find('#forward').hide();
		// 			$container.find('#back').show();
		// 		}else{
		// 			$container.find('#forward').show();
		// 			$container.find('#back').hide();
		// 		}
		// 		$o.data('ecGrid').mark1(dataku, objfreeze, value); 
		// 	});
		// 	$divnext.appendTo($divbutton);

		// }

		var page = parseInt($container.find('#cur_page_'+idgrid).val());
		$o.data('ecGrid').pageMaker(dataku, objfreeze, page);
	},
	reloadData: function(options){

	},
}	

$.ecGridSetting = function(element, options){
	var $o = $(element), $container = $o.parent(), idgrid = $o.attr('id');
	this.num_page
	this.pageSize = options.pageable.buttonCount;
	this.mark=function(data, objfreeze, page){
		//$o.data('ecGrid').pageMaker(data, objfreeze, page);
		var end = this.pageSize * page;
		var mulai = this.pageSize * (page - 1);
		var hasil = data.slice(mulai,end);
		return hasil;
	}

	this.mark1=function(data, objfreeze, page){
		$container.find('#cur_page_'+idgrid).val(page);
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
			//$container.find(".ecgrid tbody").css("height",($tableElem.height()+2)+'px');
			$container.find('#paginate').css('margin-top','20px');
		}
		//$o.data('ecGrid').pageMaker(data, objfreeze, page);
	}

	this.pageMaker = function(data, objfreeze, page){
		console.log("pagenya ----", page);
		if(objfreeze.false.length != options.columns.length){
			$divbutton = $("<div class='pagination pagination-sm' id='paginate' style='margin-top: -6px;'></div>");
		}else{
			$divbutton = $("<div class='pagination pagination-sm' id='paginate' style='margin-top:20px;'></div>");	
		}
		$divback = $('<li id="back"><a class="glyphicon glyphicon-step-backward" style="margin-top:-1px;"></a></li>').click(function (event) {
			value = parseInt($container.find('#cur_page_'+idgrid).val())-1;
			$o.data('ecGrid').back(num_page, value, data, objfreeze);
		});
		$divback.appendTo($divbutton);
		var no = page - 1;
		console.log("------ *1",no);
		var num_page = Math.ceil(data.length/options.pageable.buttonCount);
		for(var e = no; e< 5+no; e++){
			if(e+1 == num_page+1){break;}
			$buttonpage = $('<li id="'+(e+1)+'"><a>'+(e+1)+'</a></li>').click(function (event) {
				$container.find("#"+page).addClass('active');
				value = parseInt($(event.target).text());
				$o.data('ecGrid').number(num_page, value, data, objfreeze);
				$container.find('#paginate').remove();
				$o.data('ecGrid').pageMaker(data, objfreeze, value);
				
			});
			$buttonpage.appendTo($divbutton);
			$divbutton.appendTo($o);
		}

		$divnext = $('<li id="forward"><a class="glyphicon glyphicon-step-forward" style="margin-top:-1px;"></a></li>').click(function (event) {
			value = parseInt($container.find('#cur_page_'+idgrid).val())+1;
			$o.data('ecGrid').next(num_page, value, data, objfreeze);
		});
		$divnext.appendTo($divbutton);
		
	}

	this.back = function(num_page, value, data, objfreeze){
		if(value == 1 || parseInt($container.find('#cur_page_'+idgrid).val()) == 0){
			$container.find('#back').hide();
			$container.find('#forward').show();
		}else{
			$container.find('#back').show();
			$container.find('#forward').hide();
		}
		if(value != 0){
			$o.data('ecGrid').mark1(data, objfreeze, value);
		}		
	}

	this.next = function(num_page, value, data, objfreeze){
		if(value == num_page || parseInt($container.find('#cur_page_'+idgrid).val()) == num_page){
			$container.find('#forward').hide();
			$container.find('#back').show();
		}else{
			$container.find('#forward').show();
			$container.find('#back').hide();
		}
		$o.data('ecGrid').mark1(data, objfreeze, value); 
	}

	this.number = function(num_page, value, data, objfreeze){
		if(  parseInt($container.find('#cur_page_'+idgrid).val())+1 == num_page || value == num_page || value +1 == num_page){
			$container.find('#forward').hide();
			$container.find('#back').show();
		}else{
			$container.find('#forward').show();
			$container.find('#back').hide();
		}
		$o.data('ecGrid').mark1(data, objfreeze, value); 
	}


}