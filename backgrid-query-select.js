/*
  backgrid-query-select
  http://github.com/natearmagost/backgrid-query-select

  Copyright (c) 2015 Nate Armagost
  Licensed under the MIT @license.
*/
(function (root, factory) {

  /* globals require, module, define */

  "use strict";

  // CommonJS
  if (typeof exports === "object") {
    module.exports = factory(require("underscore"),
                             require("backbone"),
                             require("backgrid"),
                             require("backbone.paginator"));
  }
  // AMD. Register as an anonymous module.
  else if (typeof define === 'function' && define.amd) {
    define(['underscore', 'backbone', 'backgrid', 'backbone.paginator'], factory);
  }
  // Browser
  else {
    factory(root._, root.Backbone, root.Backgrid);
  }

}(this, function (_, Backbone, Backgrid) {

  /* globals console, QuerySelect, $ */

  "use strict";

  var QuerySelect = Backgrid.Extension.QuerySelect = Backbone.View.extend({

    tagName: "select",

    template: _.template('<% _.each(options, function(option) { %> <option value="<%= option.value %>"<% if (option.label) { %> label="<%= option.label %>"<% } %><% if (option.selected) { %> selected<% } %><% if (option.disabled) { %> disabled<% } %>><%= option.text %></option><% }); %>'),

    events: {
      "change": "changeOption"
    },

    selectBox: {
      options: []
    },

    queryParam: null,

    initialize: function (options) {

      this.selectBox = _.defaults(options.selectBox || {}, this.selectBox);
      this.queryParam = options.queryParam;

      // Required
      if (!(Backbone.PageableCollection && this.collection instanceof Backbone.PageableCollection)) {
        throw "backbone.paginator is required";
      }
      if (this.collection.mode === "client") {
        throw '"server" or "infinite" mode is required';
      }
      if (!this.queryParam) {
        throw 'A query parameter is required';
      }

      var selected = _.where(this.selectBox.options, { selected: true });

      if (selected.length > 1) {
        throw "A maximum of 1 item should be marked as selected";
      }
      // Option not selected but there are options available => The first option in the dropdown should match the queryParam on the collection
      if ((window.console) && (selected.length === 0) && (this.selectBox.options.length) && (this.selectBox.options[0].value !== this.collection.queryParams[this.queryParam])) {
        console.warn("The default option's value does not match collection's queryParam value");
      }
      // Option selected but that option doesn't match the match the queryParam on the collection
      if ((window.console) && (selected.length === 1) && (selected[0].value !== this.collection.queryParams[this.queryParam])) {
        console.warn("The selected option's value does not match the collection's queryParam value");
      }

    },

    render: function () {

      this.$el.empty().append(this.template(this.selectBox));
      return this;

    },

    changeOption: function (e) {

      // New value of the select box
      var value = $(e.currentTarget).val();

      // Remove the old value from the selectBox options
      _.each(_.where(this.selectBox.options, { selected: true }), function (old) {
        delete old.selected;
      });

      // Set the new value in the selectBox options
      _.where(this.selectBox.options, { value: value })[0].selected = true;

      if (value === "") { // Don't send the queryParam to the server if it is blank
        delete this.collection.queryParams[this.queryParam];
      } else { // Set the new queryParam
        this.collection.queryParams[this.queryParam] = value;
      }

      // Grab the first page
      this.collection.getFirstPage();

    }

  });

}));