(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["underscore", "jquery"], function (_, $) {
            return (root.hyp = factory(_, $));
        });
    } else if (typeof module === "object" && module.exports) {
        module.exports = (root.myModule = factory(require("underscore", "jquery")));
    } else {
        root.hyp = factory(root._, root.$, {});
    }

}(this, function (_, $, Hyp) {
    var version = "0.0.1";

    var hypModule = {
        version: function () {
            return version;
        },
        routeManager: function (callback, states) {
            if ("onhashchange" in window) {
                window.onhashchange = function () {
                    callback(hyp.getCurrentView(window.location.hash), states);
                };
            } else {
                var storedHash = window.location.hash;
                var intervalId = window.setInterval(function () {
                    if (window.location.hash != storedHash) {
                        storedHash = window.location.hash;
                        callback(hyp.getCurrentView(storedHash), states);
                    }
                }, 100);
                return intervalId;
            }
        },
        getCurrentView: function (view) {
            var viewArray = view.split('/');
            if (viewArray.length > 0) {
                return viewArray[0];
            }
            return view;
        },
        loadView: function (state, callback) {
            var items = { "items": callback() };
            var templateId = $(state.view.template).html();
            var tmpl = _.template(templateId);
            $(state.view.target).html(tmpl(items));

        },
        getViewByLocation: function (viewId, states, callback) {
            var state = _.filter(states, function (state) {
                return state.view.id === viewId;
            }, this);
            if (state.length > 0) {
                return callback(state[0], function () {
                    if (state[0].view.id === '#user.detail') {
                        return {
                            'id': "a43c12",
                            'name': 'franco',
                            'lastname': 'malatacca',
                            '_meta': [{
                                'uri': '/api/user/a43c12',
                                'rel': 'user.detail'
                            }]
                        }
                    } else {
                        return [
                                {
                                    'id': "a43c12",
                                    '_meta': [{
                                        'uri': '/api/user/a43c12',
                                        'rel': 'user.detail'
                                    }]
                                },
                                {
                                    'id': "c56d11",
                                    '_meta': [{
                                        'uri': '/api/user/c56d11',
                                        'rel': 'user.detail'
                                    }]
                                }
                        ];
                    }
                });
            } else {
                throw new Error('Undefined view: ' + viewId);
            }
        },
        updateViewOnChange: function (viewId, states) {
            var location = hyp.getViewByLocation(viewId, states, hyp.loadView);
        },
        init: function (states, callbacks) {
            this.states = states || [];

            this.routeManager(hyp.updateViewOnChange, states);
        }

    };
    return hypModule;
}));
