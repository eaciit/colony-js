var Setting_DataSource = {
	data: [],
	url: '',
	call: 'get',
	callData: {},
	timeout: 3000,
	callOK: function(res){

	},
	callFail: function(a,b,c){

	},
	dataTemp: [],
};

$.ecDataSource = function(element, options, bind) {
	var elementId = element;
	this.settingDataSources = $.extend({}, Setting_DataSource, options || {});
	this.Reload = function(){
		if (this.settingDataSources.data.length > 0){
			this.settingDataSources.dataTemp = this.settingDataSources.data;
		} else {
			contentType = '';
			if (this.settingDataSources.call.toLowerCase() == 'post'){
				contentType = 'application/json; charset=utf-8';
			}
			$.ajax({
				url: this.settingDataSources.url,
				type: this.settingDataSources.call,
				dataType: 'json',
				contentType: contentType,
				data: this.settingDataSources.callData,
				success: function (a) {
					$(elementId).data(bind).settingDataSources.callOK(a);
					$(elementId).data(bind).settingDataSources.dataTemp = a;
				},
				error: function (a, b, c) {
					$(elementId).data(bind).settingDataSources.callFail(a,b,c);
					$(elementId).data(bind).settingDataSources.dataTemp = [];
				},
				timeout: this.settingDataSources.timeout
			});
		}
	};
	this.getDataSource = function(){
		return this.settingDataSources.dataTemp;
	};
	this.setDataSource = function(res){
		this.settingDataSources.dataTemp = res;
	}
}