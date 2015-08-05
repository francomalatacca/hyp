(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["underscore","jquery"], function (_,$) {
            return (root.hyp = factory(_,$));
        });
    } else if (typeof module === "object" && module.exports) {
        module.exports = (root.myModule = factory(require("underscore","jquery")));
    } else {
        root.hyp = factory(root._,root.$, {});
    }

}(this, function (_,$, Hyp) {
    var version = "0.0.1";

    var hypModule = {
        version: function () {
            return version;
        },
        routeManager: function (callback) {
            if ("onhashchange" in window) {
                window.onhashchange = function () {
                    callback(window.location.hash);
                };
            } else { 
                var storedHash = window.location.hash;
                var intervalId = window.setInterval(function () {
                    if (window.location.hash != storedHash) {
                        storedHash = window.location.hash;
                        callback(storedHash);
                    }
                }, 100);
                return intervalId;
            }
        },
		getCurrentView: function() {
			return window.location.hash;
		},
		loadView: function(state, callback) {
			var items = {"items": callback()};
			var templateId = $(state.view.template).html();
			var tmpl = _.template(templateId);
			$(state.view.target).html(tmpl(items));
			
		},
		getViewByLocation: function(states, callback) {
			var viewId = this.getCurrentView();
			var state = _.filter(states, function(state) {
				return state.view.id === viewId;
			}, this);
			if(state.length > 0) {
				callback(state[0], function(){
					return [
							{
								'id':"a43c12", 
								'_meta': [{
									'uri': '/api/user/0',
									'rel': 'self'
									}]
							},
							{
								'id':"c56d11", 
								'_meta': [{
									'uri': '/api/user/0',
									'rel': 'self'
									}]
							}
						];
				});
			}else{
				throw new Error('Undefined view: ' + viewId);
			}
		},
		init: function(states, callbacks) {
			this.states = states || [];
			this.routeManager(this.getViewByLocation(states, this.loadView));
		}

    };
    return hypModule;
}));

var usersListState = {
	id: 'users.list',
	changeOn: {id: '#users.list', evt: 'load'},
	view: {id: '#users.list', target: '#view', template: '#usersTmpl'}
};

var userDetailsState = {
	id: 'users.list',
	changeOn: {id: '#user.detail', evt: 'load'},
	view: {id: '#user.detail', target: ''}
};
hyp.init([usersListState,userDetailsState], function(userListState,userDetailsState) {

});