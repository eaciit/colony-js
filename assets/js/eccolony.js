$(function() {
	$('li.eclookup-txt>input').bind('focus', function () {
		$(this).closest('ul.eclookup-list').addClass('eclookup-list-selected');
	});
	$('li.eclookup-txt>input').bind('blur', function () {
		$(this).closest('ul.eclookup-list').removeClass('eclookup-list-selected');
	});
	$('body').click(function(e) {
		var target = $(e.target);
		if(!target.is('div.eclookup-dropdown') && !target.is('ul.eclookup-list')) {
			$('div.eclookup-dropdown').hide();
		}
	});
});

var KEY = {
	BACKSPACE    : 8,
	TAB          : 9,
	ENTER        : 13,
	ESCAPE       : 27,
	SPACE        : 32,
	PAGE_UP      : 33,
	PAGE_DOWN    : 34,
	END          : 35,
	HOME         : 36,
	LEFT         : 37,
	UP           : 38,
	RIGHT        : 39,
	DOWN         : 40,
	NUMPAD_ENTER : 108,
	COMMA        : 188
};

var Settings_EcLookup = {
	dataSource: {data:[]},
	inputType: 'value',
	idField: 'id',
	idText: 'value',
	displayFields: 'value',
	placeholder: 'Input Type Here !',
	minChar: 0,
	displayTemplate: function(){
		return "";
	},
};
var Setting_DataSource = {
	data: [],
	url: '',
	call: 'get',
	callData: 'q',
	timeout: 20,
	callOK: function(res){
		console.log('ggfgfgfgfg');
	},
	callFail: function(a,b,c){
		console.log('totototototo');
	},
	resultData: function(res){
		return res;
	},
	dataTemp: [],
	dataSelect: []
};
var methodsLookup = {
	init: function(options){
		// var $o = this;
		// console.log($o);
		var settings = $.extend({}, Settings_EcLookup, options || {});
		var settingDataSources = $.extend({}, Setting_DataSource, settings['dataSource'] || {});
		methodsLookup.createSearchLookup(this, settings);
		return this.each(function () {
			$(this).data("ecLookupSettings", settings);
			$(this).data("ecLookup", new $.ecDataSource(this, settingDataSources));
		});
	},
	createSearchLookup: function(element, options){
		var $o = $(element), $container = $o.parent(), idLookup = $o.attr('id');
		$o.css({'display':'none'});
		$ulLookup = $('<ul class="eclookup-list"></ul>');
		$ulLookup.appendTo($container);

		$liLookupTxt = $('<li class="eclookup-txt"></li>');
		$liLookupTxt.appendTo($ulLookup);

		$textSearch = $('<input type="text"/>');
		$textSearch.attr({'placeholder': options.placeholder});
		$textSearch.bind('keyup keydown').keyup(function(event){
			var search = $(this).val();
			switch(event.keyCode) {
				case KEY.BACKSPACE:
					$o.data('ecLookup').searchResult(search);
					break;
				default:
					if (search.length >= options.minChar){
						$o.data('ecLookup').searchResult(search);
					}
			}
		});
		$textSearch.appendTo($liLookupTxt);

		$divDropdown = $('<div class="eclookup-dropdown"></div>');
		$divDropdown.appendTo($container);

		$ulDropdown = $('<ul class="eclookup-listsearch"></ul>');
		$ulDropdown.appendTo($divDropdown);

		$divDetailLookup = $('<div class="eclookup-detail"></div>');
		$divDetailLookup.appendTo($container);

		$divSearch = $('<div class="eclookup-detail-search"></div>');
		$divSearch.html('<span>Search : </span>&nbsp;');
		$divSearch.appendTo($divDetailLookup);

		$inputSearch = $('<input type="text"/>');
		$inputSearch.appendTo($divSearch);

		$buttonRefresh = $('<button class="btn btn-sm btn-primary"><span class="glyphicon glyphicon-refresh"></span> Refresh</button>');
		$buttonRefresh.appendTo($divSearch);

		$divDetailData = $('<div class="eclookup-detail-data"></div>');
		$divDetailData.appendTo($divDetailLookup);

		$tableData = $('<table class="eclookup-table"></table>');
		$tableData.appendTo($divDetailData);
	},
	get: function() {
		var idLookup = $(this).attr('id');
		var dataGet = $('#'+idLookup).data('ecLookup').ParamDataSource.dataSelect;
		return dataGet;
	},
}
$.fn.ecLookup = function (method) {
	if (methodsLookup[method]) {
		return methodsLookup[method].apply(this, Array.prototype.slice.call(arguments, 1));
	} else {
		methodsLookup['init'].apply(this,arguments);
	}
}
$.ecDataSource = function(element,options){
	var elementLookup = element, chooseData = 'data';
	this.ParamDataSource = options;
	this.getUrlData = function(query){
		var dataPost = {};
		dataPost[this.ParamDataSource.callData] = query;
		$.ajax({
			url: this.ParamDataSource.url,
			type: this.ParamDataSource.call,
			dataType: 'json',
			contentType: 'application/json; charset=utf-8',
			data: dataPost,
			success: function (a) {
				$(elementLookup).data('ecLookup').ParamDataSource.callOK(a);
				var resultdata = $(elementLookup).data('ecLookup').ParamDataSource.resultData(a), dataTemp = $(elementLookup).data('ecLookup').ParamDataSource.dataTemp;
				$(elementLookup).data('ecLookup').ParamDataSource.dataTemp = dataTemp.concat(resultdata);

				$(elementLookup).data('ecLookup').resultSearchData(resultdata, '');
				// return resultdata;
			},
			error: function (a, b, c) {
				$(elementLookup).data('ecLookup').ParamDataSource.callFail(a,b,c);
				var resultdata = $(elementLookup).data('ecLookup').ParamDataSource.resultData([]);
				$(elementLookup).data('ecLookup').resultSearchData(resultdata, query);
				// return resultdata;
			},
		});
	};
	this.getGetStorage = function(){
		if (this.ParamDataSource.data.length > 0){
			chooseData = 'data';
			this.ParamDataSource.dataTemp = this.ParamDataSource.data;
		} else if (typeof(this.ParamDataSource.url) == 'string' && this.ParamDataSource.url != '' ){
			chooseData = 'url';
			// this.getUrlData();
		}
		// return this.ParamDataSource.dataTemp;
	};
	this.searchResult = function(query){
		if (chooseData == 'data' && this.ParamDataSource.dataTemp.length == 0){
			this.getGetStorage();
		}
		var searchData = jQuery.grep(this.ParamDataSource.dataTemp, function( item ) {
			var itemSearch = '';
			if ($(elementLookup).data('ecLookupSettings').inputType != ''){
				itemSearch = item[$(elementLookup).data('ecLookupSettings').inputType];
			} else {
				itemSearch = item;
			}
			return itemSearch.toLowerCase().indexOf(query.toLowerCase()) >= 0;
		});
		if (chooseData == 'url' && searchData.length == 0){
			// this.getGetStorage();
			this.getUrlData(query);
		} else if (chooseData == 'data'){
			this.resultSearchData(searchData, query);
		}
	};
	this.resultSearchData = function(data,query){
		var $ulDropdown = $(elementLookup).parent().find('ul.eclookup-listsearch');
		$(elementLookup).parent().find('div.eclookup-dropdown').show();
		$ulDropdown.html('');
		if (data.length > 0 && query !== ''){
			for (var key in data){
				var changeElemSearch = $(elementLookup).data('ecLookupSettings').displayTemplate();
				$liContentSearch = $('<li class="eclookup-itemsearch" idfield="'+ data[key][$(elementLookup).data('ecLookupSettings').idField] +'" valueDisplay="'+data[key][$(elementLookup).data('ecLookupSettings').displayFields]+'"></li>');
				if (changeElemSearch == ''){
					$liContentSearch.html(data[key][$(elementLookup).data('ecLookupSettings').idText]);
				} else{
					var splitElement = changeElemSearch.split('#'), elementCreate = '';
					for (var i in splitElement){
						var res = splitElement[i].substring(0,1);
						if (res == '*'){
							elementCreate += data[key][splitElement[i].substring(1,splitElement[i].length)];
						} else {
							elementCreate += splitElement[i];
						}
					}
					$liContentSearch.html(elementCreate);
				}
				$liContentSearch.bind('click').click(function(event){
					var $searchtxt = $(elementLookup).parent().find('ul.eclookup-list>li.eclookup-txt');

					$liLookup = $('<li class="eclookup-item"></li>');
					$liLookup.insertBefore($searchtxt);

					$titleLookup = $('<p></p>');
					$titleLookup.html($(this).attr('valueDisplay'));
					$titleLookup.appendTo($liLookup);

					var $searchtext = $(elementLookup).parent().find('li.eclookup-txt>input'), idField = $(this).attr('idfield');

					$btnRemoveLookup = $('<span class="eclookup-remove"></span>');
					$btnRemoveLookup.html('x');
					$btnRemoveLookup.bind('click').click(function(){
						$(this).parent().remove();
						$searchtext.val('');
						$searchtext.focus();
						var dataResult = $.grep($(elementLookup).data('ecLookup').ParamDataSource.dataSelect, function(e){ 
							var idGrep = idField;
							if (typeof(e[$(elementLookup).data('ecLookupSettings').idField]) == 'number')
								idGrep = parseInt(idGrep);
							return e[$(elementLookup).data('ecLookupSettings').idField] != idGrep; 
						});
						$(elementLookup).data('ecLookup').ParamDataSource.dataSelect = dataResult;
						$(elementLookup).data('ecLookup').createDetailData();
					});
					$btnRemoveLookup.appendTo($liLookup);

					$searchtext.val('');
					$searchtext.focus();

					var dataResult = $.grep(data, function(e){ 
						var idGrep = idField;
						if (typeof(e[$(elementLookup).data('ecLookupSettings').idField]) == 'number')
							idGrep = parseInt(idGrep);
						return e[$(elementLookup).data('ecLookupSettings').idField] == idGrep; 
					}), dataSelectTemp = $(elementLookup).data('ecLookup').ParamDataSource.dataSelect;
					dataSelectTemp = dataSelectTemp.concat(dataResult);
					$(elementLookup).data('ecLookup').ParamDataSource.dataSelect = dataSelectTemp;
					$(elementLookup).data('ecLookup').createDetailData();
				});
				$liContentSearch.appendTo($ulDropdown);
			}
		} else if (query !== ''){
			$liContentSearch = $('<li class="eclookup-itemsearch">Search Not Found !</li>');
			$liContentSearch.appendTo($ulDropdown);
		}
	};
	this.createDetailData = function(){
		var dataSelect = this.ParamDataSource.dataSelect;
		if (dataSelect.length == 0){
			$(elementLookup).parent().find('div.eclookup-detail').hide();
		} else {
			var $tableData = $(elementLookup).parent().find('table.eclookup-table'), dataKey = [];
			$tableData.html('');
			$tableHead = $('<thead></thead>');
			$tableHead.appendTo($tableData);
			$tableRow = $('<tr></tr>');
			$tableRow.appendTo($tableHead);

			$titleTable = $('<th>'+$(elementLookup).data('ecLookupSettings').idField+'</th>');
			$titleTable.appendTo($tableRow);
			dataKey.push($(elementLookup).data('ecLookupSettings').idField);
			$titleTable = $('<th>'+$(elementLookup).data('ecLookupSettings').idText+'</th>');
			$titleTable.appendTo($tableRow);
			dataKey.push($(elementLookup).data('ecLookupSettings').idText);

			$.each( dataSelect[0], function( key, value ) {
				if (key != $(elementLookup).data('ecLookupSettings').idText && key != $(elementLookup).data('ecLookupSettings').idField){
					$titleTable = $('<th>'+key+'</th>');
					$titleTable.appendTo($tableRow);
					dataKey.push(key);
				}
			});

			$tableBody = $('<tbody></tbody>');
			$tableBody.appendTo($tableData);

			for (var i in dataSelect){
				$tableRow = $('<tr></tr>');
				$tableRow.appendTo($tableBody);
				for (var n in dataKey){
					$tableColumn = $('<td>'+dataSelect[i][dataKey[n]]+'</td>');
					if(n == 1)
						$tableColumn.css('border-right','1px solid #DBDADA');
					$tableColumn.appendTo($tableRow);
				}
			}
			$(elementLookup).parent().find('div.eclookup-detail').show();
		}
	}
}
// ecDataSource.prototype.data = function(){

// }