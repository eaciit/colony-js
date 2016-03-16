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

		$taginputPaging = $('<input type="hidden" id="cur_page"/><input type="hidden" id="show_ppage" /><div id="page_nav"></div>');
		$taginputPaging.appendTo($o);

		//console.log("the option", options.pageable.buttonCount);

		/*paging*/
		var count = options.pageable.buttonCount;
		makepager = function(page){
			var show_ppage = count;
			var num_item = $container.find('.ecgrid tbody>tr').size();
			var num_page = Math.ceil(num_item / show_ppage);
			var num_toshow = 4;
			var nav_html = '';
			var cur_page = page;
			var cur_link = (num_toshow >= cur_page ? 1 : num_toshow + 1);
			if(cur_page > 1)
				cur_link = cur_page;
			if(cur_link != 1)
				nav_html += "<a class='nextbutton' href=\"javascript:first();\">« start&nbsp;</a>&nbsp;<a class='nextbutton' href=\"javascript:previous();\">« prev&nbsp;</a>&nbsp;";
			if(cur_link == num_page - 1)
				cur_link = cur_link - 3;
			else if(cur_link == num_page)
				cur_link = cur_link - 4;
			else if(cur_link > 2)
				cur_link = cur_link - 2;
			else 
				cur_link = 1;
			var pages = num_toshow;
			while(pages != 0){
				if (num_page < cur_link) { break; }
				if (cur_link >= 1)
					nav_html += "<a class='" + ((cur_link == cur_page) ? "currentPageButton" : "numericButton") + "' href=\"javascript:showPage(" + cur_link + ")\" longdesc='" + cur_link + "'>" + (cur_link) + "</a>&nbsp;";
				cur_link ++;
				pages--;
			}
			if (num_page > cur_page){
                nav_html += "<a class='nextbutton' href=\"javascript:next()\">next »</a>&nbsp;<a class='nextbutton' href=\"javascript:last(" + num_page + ");\">last »</a>";
            }

            $container.find('#page_nav').html(nav_html);
		}
		var pageSize = count;
		showPage = function (page) {
            $container.find('.ecgrid tbody>tr').hide();
            $container.find('#cur_page').val(page);
            $container.find('.ecgrid tbody>tr').each(function (n) {
                if (n >= pageSize * (page - 1) && n < pageSize * page)
                    $(this).show();
            });
        	makepager(page);
       }
        showPage(1);
       next = function () {
            new_page = parseInt($container.find('#cur_page').val()) + 1;
            showPage(new_page);
        }
        last = function (num_page) {
            new_page = num_page;
            $container.find('#cur_page').val(new_page);
            showPage(new_page);
        }
        first = function () {
            var new_page = "1";
            $container.find('#cur_page').val(new_page);
            showPage(new_page);    
      }
        previous = function () {
            new_page = parseInt($container.find('#cur_page').val()) - 1;
            $container.find('#cur_page').val(new_page);
            showPage(new_page);
      }



	},
	reloadData: function(options){

	},
}	

$.ecGridSetting = function(element, options){

}