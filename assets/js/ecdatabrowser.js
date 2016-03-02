$.fn.ecDataBrowser = function (method) {
	if (methodsDataBrowser[method]) {
		return methodsDataBrowser[method].apply(this, Array.prototype.slice.call(arguments, 1));
	} else {
		methodsDataBrowser['init'].apply(this,arguments);
	}
}
// Format : Integer, Double, Float, Currency, Date, DateTime and Date Format
var Setting_DataBrowser = {
	title: "",
	widthPerColumn: 4,
	widthKeyFilter: 3,
	showFilter: "Simple",
	dataSource: {data:[]},
	metadata: [],
	dataSimple: [],
	dataAdvance: [],
};
var Setting_ColumnGridDB = {
	Field: "",
    Label: "",
    Format: "",
    Align: "",
    ShowIndex: 1,
    Sortable: true,
    SimpleFilter: true,
    AdvanceFilter: true,
    Aggregate: ""
};
var Setting_TypeData = {
	number: ['integer', 'int', 'double', 'float', 'n0'],
	date: ['date','datetime'],
}

var methodsDataBrowser = {
	init: function(options){
		var settings = $.extend({}, Setting_DataBrowser, options || {});
		var sortMeta = settings.metadata.sort(function(a, b) {
		    return parseFloat(a.ShowIndex) - parseFloat(b.ShowIndex);
		});
		settings.metadata = sortMeta;
		// var settingDataSources = $.extend({}, Setting_DataBrowser, settings['dataSource'] || {});
		return this.each(function () {
			// $(this).data("ecDataSource", settingDataSources);
			$(this).data("ecDataBrowser", new $.ecDataBrowserSetting(this, settings));
			methodsDataBrowser.createElement(this, settings);
		});
	},
	createElement: function(element, options){
		$(element).html("");
		var $o = $(element), settingFilter = {}, widthfilter = 0, dataSimple= [], dataAdvance= [];

		$divFilterSimple = $('<div class="col-md-12 ecdatabrowser-filtersimple"></div>');
		$divFilterSimple.appendTo($o);
		$divFilterAdvance = $('<div class="col-md-12 ecdatabrowser-filteradvance"></div>');
		$divFilterAdvance.appendTo($o);
		console.log(options);
		for (var key in options.metadata){
			settingFilter = $.extend({}, Setting_ColumnGridDB, options.metadata[key] || {});
			widthfilter = 12-options.widthKeyFilter;
			if (settingFilter.SimpleFilter){
				$divFilter = $('<div class="col-md-'+options.widthPerColumn+' filter-'+key+'"></div>');
				$divFilter.appendTo($divFilterSimple);
				$labelFilter = $("<label class='col-md-"+options.widthKeyFilter+" ecdatabrowser-filter'>"+settingFilter.Label+"</label>");
				$labelFilter.appendTo($divFilter);
				$divContentFilter = $('<div class="col-md-'+widthfilter+'"></div>');
				$divContentFilter.appendTo($divFilter);
				methodsDataBrowser.createElementFilter(settingFilter, 'simple', key, $divContentFilter, $o);
				dataSimple.push('#filter-simple-'+key);
			}
			if (settingFilter.AdvanceFilter){
				$divFilter = $('<div class="col-md-'+options.widthPerColumn+' filter-'+key+'"></div>');
				$divFilter.appendTo($divFilterAdvance);
				$labelFilter = $("<label class='col-md-"+options.widthKeyFilter+" ecdatabrowser-filter'>"+settingFilter.Label+"</label>");
				$labelFilter.appendTo($divFilter);
				$divContentFilter = $('<div class="col-md-'+widthfilter+'"></div>');
				$divContentFilter.appendTo($divFilter);
				methodsDataBrowser.createElementFilter(settingFilter, 'advance', key, $divContentFilter, $o);
				dataAdvance.push('#filter-advance-'+key);
			}
		}
		$(element).data("ecDataBrowser").dataSimple = dataSimple;
		$(element).data("ecDataBrowser").dataAdvance = dataAdvance;

		$divContainerGrid = $('<div class="col-md-12 ecdatabrowser-gridview"></div>');
		$divContainerGrid.appendTo($o);

		$divGrid = $('<div class="ecdatabrowser-grid"></div>');
		$divGrid.appendTo($divContainerGrid);

		methodsDataBrowser.createGrid($divGrid, options, $o);

		$(element).data("ecDataBrowser").ChangeViewFilter(options.showFilter);

	},
	createElementFilter: function(settingFilter, filterchoose, index, element, id){
		var $divElementFilter;
		var dataResult = $.grep(Setting_TypeData.number, function(e){ 
			return settingFilter.Format.toLowerCase().indexOf(e) >= 0; 
		});
		if (dataResult.length>0){
			// var splitElement = settingFilter.Format.split('#'), formatCreate = '';
			// for (var i in splitElement){
			// 	var res = splitElement[i].substring(0,1);
			// 	if (res == '*'){
			// 		formatCreate += splitElement[i].substring(1,splitElement[i].length);
			// 	} 
			// }
			$divElementFilter = $('<input idfilter="filter-'+filterchoose+'-'+index+'" typedata="number"/>');
			$divElementFilter.appendTo(element);
			id.find('input[idfilter=filter-'+filterchoose+'-'+index+']').kendoNumericTextBox();
			return '';
		}
		dataResult = $.grep(Setting_TypeData.date, function(e){ 
			return settingFilter.Format.toLowerCase().indexOf(e) >= 0; 
		});
		if (dataResult.length>0){
			var splitElement = settingFilter.Format.split('#'), formatCreate = '';
			for (var i in splitElement){
				var res = splitElement[i].substring(0,1);
				if (res == '*'){
					formatCreate += splitElement[i].substring(1,splitElement[i].length);
				} 
			}
			$divElementFilter = $('<input idfilter="filter-'+filterchoose+'-'+index+'" typedata="date"/>');
			$divElementFilter.appendTo(element);
			id.find('input[idfilter=filter-'+filterchoose+'-'+index+']').kendoDatePicker({
				format: formatCreate,
			});
			return '';
		}
		if (settingFilter.Format.toLowerCase() == "string"){
			$divElementFilter = $('<input type="text" class="form-control input-sm" id="filter-'+filterchoose+'-'+index+'" typedata="string"/>');
			$divElementFilter.appendTo(element);
			return '';
		}
	},
	createGrid: function(element, options, id){
		var colums = [];
		for(var key in options.metadata){
			colums.push({
				field: options.metadata[key].Field,
				title: options.metadata[key].Label,
			});
		}
		$divElementGrid = $('<div class="col-md-12" idfilter="gridFilterBrowser"></div>');
		$divElementGrid.appendTo(element);
		if (options.dataSource.data.length > 0){
			id.find('div[idfilter=gridFilterBrowser]').kendoGrid({
				dataSource: {data: options.dataSource.data},
				columns: colums,
			});
		} else {
			id.find('div[idfilter=gridFilterBrowser]').kendoGrid({
				dataSource: options.dataSource,
				columns: colums,
			});
		}
	},
	setShowFilter: function(res){
		$(element).data("ecDataBrowser").ChangeViewFilter(res);
	},
	getDataFilter: function(){
		return "";
	}
}

$.ecDataBrowserSetting = function(element,options){
	this.mapdatabrowser = options;
	this.ChangeViewFilter = function(res){
		if (res.toLowerCase() == 'simple'){
			$(element).find('div.ecdatabrowser-filtersimple').show();
			$(element).find('div.ecdatabrowser-filteradvance').hide();
		} else {
			$(element).find('div.ecdatabrowser-filtersimple').hide();
			$(element).find('div.ecdatabrowser-filteradvance').show();
		}
	};
}