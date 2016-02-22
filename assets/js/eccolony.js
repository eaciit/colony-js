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

var Settings_EcLookup = {
	dataSource: {data:[]},
	inputType: 'value',
	idField: 'id',
	idText: 'value',
	displayFields: 'value',
	placeholder: 'Input Type Here !',
	displayTemplate: function(item){
		console.log(item);
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
	dataSelect: [],
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

		// for (var i=0; i < 6; i++){
		// 	$liLookup = $('<li class="eclookup-item"></li>');
		// 	$liLookup.appendTo($ulLookup);

		// 	$titleLookup = $('<p></p>');
		// 	$titleLookup.html('aaaaaaa');
		// 	$titleLookup.appendTo($liLookup);

		// 	$btnRemoveLookup = $('<span class="eclookup-remove"></span>');
		// 	$btnRemoveLookup.html('x');
		// 	$btnRemoveLookup.appendTo($liLookup);
		// }

		$liLookupTxt = $('<li class="eclookup-txt"></li>');
		$liLookupTxt.appendTo($ulLookup);

		$textSearch = $('<input type="text"/>');
		$textSearch.attr({'placeholder': options.placeholder});
		$textSearch.bind('keyup keydown').keyup(function(event){
			var search = $(this).val();
			$o.data('ecLookup').searchResult(search);
		});
		$textSearch.appendTo($liLookupTxt);

		$divDropdown = $('<div class="eclookup-dropdown"></div>');
		$divDropdown.appendTo($container);

		$ulDropdown = $('<ul class="eclookup-listsearch"></ul>');
		$ulDropdown.appendTo($divDropdown);
		// for (var i=0; i < 6; i++){
		// 	$liContentSearch = $('<li class="eclookup-itemsearch">asdadasdsd</li>');
		// 	$liContentSearch.appendTo($ulDropdown);
		// }
	}
}
$.fn.ecLookup = function (method) {
	// console.log(this);
	// console.log(method);
	// console.log(arguments);
	methodsLookup['init'].apply(this,arguments);
	// methodsLookup[method].apply(this, Array.prototype.slice.call(arguments, 1));
}
$.ecDataSource = function(element,options){
	var elementLookup = element, chooseData = 'data';
	this.ParamDataSource = options;
	this.getUrlData = function(){
		$.ajax({
			url: this.ParamDataSource.url,
			type: this.ParamDataSource.call,
			dataType: 'json',
			contentType: 'application/json; charset=utf-8',
			data: this.ParamDataSource.callData,
			success: function (a) {
				$(elementLookup).data('ecLookup').ParamDataSource.callOK(a);
				var resultdata = $(elementLookup).data('ecLookup').ParamDataSource.resultData(a), dataTemp = $(elementLookup).data('ecLookup').ParamDataSource.dataTemp;
				$(elementLookup).data('ecLookup').ParamDataSource.dataTemp = dataTemp.concat(resultdata);

				$(elementLookup).data('ecLookup').resultSearchData(resultdata);
				// return resultdata;
			},
			error: function (a, b, c) {
				$(elementLookup).data('ecLookup').ParamDataSource.callFail(a,b,c);
				var resultdata = $(elementLookup).data('ecLookup').ParamDataSource.resultData([]);
				$(elementLookup).data('ecLookup').resultSearchData(resultdata);
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
			this.getUrlData();
			// var dataTemp = this.ParamDataSource.dataTemp, dataResult = this.getUrlData();
			// this.ParamDataSource.dataTemp = dataTemp.concat(dataResult);
		}
		return this.ParamDataSource.dataTemp;
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
			this.getGetStorage();
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
				$liContentSearch = $('<li class="eclookup-itemsearch" idlookup="eclookup-result'+ data[key][$(elementLookup).data('ecLookupSettings').idField] +'" valueDisplay="'+data[key][$(elementLookup).data('ecLookupSettings').displayFields]+'">'+ data[key][$(elementLookup).data('ecLookupSettings').idText] +'</li>');
				$liContentSearch.bind('click').click(function(event){
					var $searchtxt = $(elementLookup).parent().find('ul.eclookup-list>li.eclookup-txt');
					$liLookup = $('<li class="eclookup-item"></li>');
					$liLookup.insertBefore($searchtxt);

					$titleLookup = $('<p></p>');
					$titleLookup.html($(this).attr('valueDisplay'));
					$titleLookup.appendTo($liLookup);

					var $searchtext = $(elementLookup).parent().find('li.eclookup-txt>input');

					$btnRemoveLookup = $('<span class="eclookup-remove"></span>');
					$btnRemoveLookup.html('x');
					$btnRemoveLookup.bind('click').click(function(){
						$(this).parent().remove();
						$searchtext.val('');
						$searchtext.focus();
					});
					$btnRemoveLookup.appendTo($liLookup);

					$searchtext.val('');
					$searchtext.focus();
				});
				$liContentSearch.appendTo($ulDropdown);
			}
		} else if (query !== ''){
			$liContentSearch = $('<li class="eclookup-itemsearch">Search Not Found !</li>');
			$liContentSearch.appendTo($ulDropdown);
		}
	};
}
// ecDataSource.prototype.data = function(){

// }