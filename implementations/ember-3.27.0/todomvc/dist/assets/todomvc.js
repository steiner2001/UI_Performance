'use strict';



;define("todomvc/app", ["exports", "@ember/application", "todomvc/resolver", "ember-load-initializers", "todomvc/config/environment"], function (_exports, _application, _resolver, _emberLoadInitializers, _environment) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  const App = _application.default.extend({
    modulePrefix: _environment.default.modulePrefix,
    podModulePrefix: _environment.default.podModulePrefix,
    Resolver: _resolver.default
  });

  (0, _emberLoadInitializers.default)(App, _environment.default.modulePrefix);
  var _default = App;
  _exports.default = _default;
});
;define("todomvc/components/todo-item", ["exports", "@ember/object", "@ember/utils", "@ember/runloop", "@ember/service", "@ember/component"], function (_exports, _object, _utils, _runloop, _service, _component) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = _component.default.extend({
    repo: (0, _service.inject)(),
    tagName: 'li',
    editing: false,
    classNameBindings: ['todo.completed', 'editing'],
    actions: {
      startEditing() {
        this.onStartEdit();
        this.set('editing', true);
        (0, _runloop.scheduleOnce)('afterRender', this, 'focusInput');
      },

      doneEditing(todoTitle) {
        if (!this.editing) {
          return;
        }

        if ((0, _utils.isBlank)(todoTitle)) {
          this.send('removeTodo');
        } else {
          this.set('todo.title', todoTitle.trim());
          this.set('editing', false);
          this.onEndEdit();
        }
      },

      handleKeydown(e) {
        if (e.keyCode === 13) {
          e.target.blur();
        } else if (e.keyCode === 27) {
          this.set('editing', false);
        }
      },

      toggleCompleted(e) {
        let todo = this.todo;
        (0, _object.set)(todo, 'completed', e.target.checked);
        this.repo.persist();
      },

      removeTodo() {
        this.repo.delete(this.todo);
      }

    },

    focusInput() {
      this.element.querySelector('input.edit').focus();
    }

  });

  _exports.default = _default;
});
;define("todomvc/components/todo-list", ["exports", "@ember/object", "@ember/service", "@ember/component"], function (_exports, _object, _service, _component) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = _component.default.extend({
    repo: (0, _service.inject)(),
    tagName: 'section',
    classNames: ['main'],
    canToggle: true,
    allCompleted: (0, _object.computed)('todos.@each.completed', function () {
      return this.todos.isEvery('completed');
    }),
    actions: {
      enableToggle() {
        this.set('canToggle', true);
      },

      disableToggle() {
        this.set('canToggle', false);
      },

      toggleAll() {
        let allCompleted = this.allCompleted;
        this.todos.forEach(todo => (0, _object.set)(todo, 'completed', !allCompleted));
        this.repo.persist();
      }

    }
  });

  _exports.default = _default;
});
;define("todomvc/controllers/active", ["exports", "@ember/object/computed", "@ember/controller"], function (_exports, _computed, _controller) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = _controller.default.extend({
    todos: (0, _computed.filterBy)('model', 'completed', false)
  });

  _exports.default = _default;
});
;define("todomvc/controllers/application", ["exports", "@ember/utils", "@ember/object/computed", "@ember/service", "@ember/controller"], function (_exports, _utils, _computed, _service, _controller) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = _controller.default.extend({
    repo: (0, _service.inject)(),
    remaining: (0, _computed.filterBy)('model', 'completed', false),
    completed: (0, _computed.filterBy)('model', 'completed'),
    actions: {
      createTodo(e) {
        if (e.keyCode === 13 && !(0, _utils.isBlank)(e.target.value)) {
          this.repo.add({
            title: e.target.value.trim(),
            completed: false
          });
          e.target.value = '';
        }
      },

      clearCompleted() {
        this.model.removeObjects(this.completed);
        this.repo.persist();
      }

    }
  });

  _exports.default = _default;
});
;define("todomvc/controllers/completed", ["exports", "@ember/object/computed", "@ember/controller"], function (_exports, _computed, _controller) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = _controller.default.extend({
    todos: (0, _computed.filterBy)('model', 'completed', true)
  });

  _exports.default = _default;
});
;define("todomvc/helpers/app-version", ["exports", "@ember/component/helper", "todomvc/config/environment", "ember-cli-app-version/utils/regexp"], function (_exports, _helper, _environment, _regexp) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.appVersion = appVersion;
  _exports.default = void 0;

  function appVersion(_, hash = {}) {
    const version = _environment.default.APP.version; // e.g. 1.0.0-alpha.1+4jds75hf
    // Allow use of 'hideSha' and 'hideVersion' For backwards compatibility

    let versionOnly = hash.versionOnly || hash.hideSha;
    let shaOnly = hash.shaOnly || hash.hideVersion;
    let match = null;

    if (versionOnly) {
      if (hash.showExtended) {
        match = version.match(_regexp.versionExtendedRegExp); // 1.0.0-alpha.1
      } // Fallback to just version


      if (!match) {
        match = version.match(_regexp.versionRegExp); // 1.0.0
      }
    }

    if (shaOnly) {
      match = version.match(_regexp.shaRegExp); // 4jds75hf
    }

    return match ? match[0] : version;
  }

  var _default = (0, _helper.helper)(appVersion);

  _exports.default = _default;
});
;define("todomvc/helpers/gt", ["exports", "@ember/component/helper"], function (_exports, _helper) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.gt = gt;
  _exports.default = void 0;

  function gt([n1, n2]
  /*, hash*/
  ) {
    return n1 > n2;
  }

  var _default = (0, _helper.helper)(gt);

  _exports.default = _default;
});
;define("todomvc/helpers/pluralize", ["exports", "@ember/component/helper", "ember-inflector"], function (_exports, _helper, _emberInflector) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.pluralizeHelper = pluralizeHelper;
  _exports.default = void 0;

  function pluralizeHelper([singular, count]
  /*, hash*/
  ) {
    return count === 1 ? singular : (0, _emberInflector.pluralize)(singular);
  }

  var _default = (0, _helper.helper)(pluralizeHelper);

  _exports.default = _default;
});
;define("todomvc/helpers/singularize", ["exports", "ember-inflector/lib/helpers/singularize"], function (_exports, _singularize) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  var _default = _singularize.default;
  _exports.default = _default;
});
;define("todomvc/initializers/app-version", ["exports", "ember-cli-app-version/initializer-factory", "todomvc/config/environment"], function (_exports, _initializerFactory, _environment) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  let name, version;

  if (_environment.default.APP) {
    name = _environment.default.APP.name;
    version = _environment.default.APP.version;
  }

  var _default = {
    name: 'App Version',
    initialize: (0, _initializerFactory.default)(name, version)
  };
  _exports.default = _default;
});
;define("todomvc/initializers/container-debug-adapter", ["exports", "ember-resolver/resolvers/classic/container-debug-adapter"], function (_exports, _containerDebugAdapter) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  var _default = {
    name: 'container-debug-adapter',

    initialize() {
      let app = arguments[1] || arguments[0];
      app.register('container-debug-adapter:main', _containerDebugAdapter.default);
      app.inject('container-debug-adapter:main', 'namespace', 'application:main');
    }

  };
  _exports.default = _default;
});
;define("todomvc/initializers/export-application-global", ["exports", "ember", "todomvc/config/environment"], function (_exports, _ember, _environment) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.initialize = initialize;
  _exports.default = void 0;

  function initialize() {
    var application = arguments[1] || arguments[0];

    if (_environment.default.exportApplicationGlobal !== false) {
      var theGlobal;

      if (typeof window !== 'undefined') {
        theGlobal = window;
      } else if (typeof global !== 'undefined') {
        theGlobal = global;
      } else if (typeof self !== 'undefined') {
        theGlobal = self;
      } else {
        // no reasonable global, just bail
        return;
      }

      var value = _environment.default.exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = _ember.default.String.classify(_environment.default.modulePrefix);
      }

      if (!theGlobal[globalName]) {
        theGlobal[globalName] = application;
        application.reopen({
          willDestroy: function () {
            this._super.apply(this, arguments);

            delete theGlobal[globalName];
          }
        });
      }
    }
  }

  var _default = {
    name: 'export-application-global',
    initialize: initialize
  };
  _exports.default = _default;
});
;define("todomvc/resolver", ["exports", "ember-resolver"], function (_exports, _emberResolver) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  var _default = _emberResolver.default;
  _exports.default = _default;
});
;define("todomvc/router", ["exports", "@ember/routing/router", "todomvc/config/environment"], function (_exports, _router, _environment) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  const Router = _router.default.extend({
    location: _environment.default.locationType,
    rootURL: _environment.default.rootURL
  });

  Router.map(function () {
    this.route('active');
    this.route('completed');
  });
  var _default = Router;
  _exports.default = _default;
});
;define("todomvc/routes/application", ["exports", "@ember/service", "@ember/routing/route"], function (_exports, _service, _route) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = _route.default.extend({
    repo: (0, _service.inject)(),

    model() {
      return this.repo.findAll();
    }

  });

  _exports.default = _default;
});
;define("todomvc/services/ajax", ["exports", "ember-ajax/services/ajax"], function (_exports, _ajax) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _ajax.default;
    }
  });
});
;define("todomvc/services/repo", ["exports", "@ember/service"], function (_exports, _service) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = _service.default.extend({
    lastId: 0,
    data: null,

    findAll() {
      return this.data || this.set('data', JSON.parse(window.localStorage.getItem('todos') || '[]'));
    },

    add(attrs) {
      let todo = Object.assign({
        id: this.incrementProperty('lastId')
      }, attrs);
      this.data.pushObject(todo);
      this.persist();
      return todo;
    },

    delete(todo) {
      this.data.removeObject(todo);
      this.persist();
    },

    persist() {
      window.localStorage.setItem('todos', JSON.stringify(this.data));
    }

  });

  _exports.default = _default;
});
;define("todomvc/templates/active", ["exports", "@ember/template-factory"], function (_exports, _templateFactory) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = (0, _templateFactory.createTemplateFactory)({
    "id": "Gt6QuyEG",
    "block": "[[[1,[28,[35,0],null,[[\"todos\"],[[33,1]]]]]],[],false,[\"todo-list\",\"todos\"]]",
    "moduleName": "todomvc/templates/active.hbs",
    "isStrictMode": false
  });

  _exports.default = _default;
});
;define("todomvc/templates/application", ["exports", "@ember/template-factory"], function (_exports, _templateFactory) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = (0, _templateFactory.createTemplateFactory)({
    "id": "h+7ndky1",
    "block": "[[[10,\"section\"],[14,0,\"todoapp\"],[12],[1,\"\\n  \"],[10,\"header\"],[14,0,\"header\"],[12],[1,\"\\n    \"],[10,\"h1\"],[12],[1,\"todos\"],[13],[1,\"\\n    \"],[10,\"input\"],[14,0,\"new-todo\"],[15,\"onkeydown\",[28,[37,0],[[30,0],\"createTodo\"],null]],[14,\"placeholder\",\"What needs to be done?\"],[14,\"autofocus\",\"\"],[12],[13],[1,\"\\n  \"],[13],[1,\"\\n  \"],[46,[28,[37,2],null,null],null,null,null],[1,\"\\n\"],[41,[28,[37,4],[[33,5,[\"length\"]],0],null],[[[1,\"    \"],[10,\"footer\"],[14,0,\"footer\"],[12],[1,\"\\n      \"],[10,1],[14,0,\"todo-count\"],[12],[10,\"strong\"],[12],[1,[33,6,[\"length\"]]],[13],[1,\" \"],[1,[28,[35,7],[\"item\",[33,6,[\"length\"]]],null]],[1,\" left\"],[13],[1,\"\\n      \"],[10,\"ul\"],[14,0,\"filters\"],[12],[1,\"\\n        \"],[10,\"li\"],[12],[6,[39,8],null,[[\"activeClass\",\"route\"],[\"selected\",\"index\"]],[[\"default\"],[[[[1,\"All\"]],[]]]]],[13],[1,\"\\n        \"],[10,\"li\"],[12],[6,[39,8],null,[[\"activeClass\",\"route\"],[\"selected\",\"active\"]],[[\"default\"],[[[[1,\"Active\"]],[]]]]],[13],[1,\"\\n        \"],[10,\"li\"],[12],[6,[39,8],null,[[\"activeClass\",\"route\"],[\"selected\",\"completed\"]],[[\"default\"],[[[[1,\"Completed\"]],[]]]]],[13],[1,\"\\n      \"],[13],[1,\"\\n\"],[41,[33,9,[\"length\"]],[[[1,\"        \"],[10,\"button\"],[14,0,\"clear-completed\"],[15,\"onclick\",[28,[37,0],[[30,0],\"clearCompleted\"],null]],[12],[1,\"Clear completed\"],[13],[1,\"\\n\"]],[]],null],[1,\"    \"],[13],[1,\"\\n\"]],[]],null],[13],[1,\"\\n\"],[10,\"footer\"],[14,0,\"info\"],[12],[1,\"\\n  \"],[10,2],[12],[1,\"Double-click to edit a todo\"],[13],[1,\"\\n  \"],[10,2],[12],[1,\"\\n    Created by\\n    \"],[10,3],[14,6,\"http://github.com/cibernox\"],[12],[1,\"Miguel Camba\"],[13],[1,\",\\n    \"],[10,3],[14,6,\"http://github.com/addyosmani\"],[12],[1,\"Addy Osmani\"],[13],[1,\"\\n  \"],[13],[1,\"\\n  \"],[10,2],[12],[1,\"Part of \"],[10,3],[14,6,\"http://todomvc.com\"],[12],[1,\"TodoMVC\"],[13],[13],[1,\"\\n\"],[13]],[],false,[\"action\",\"component\",\"-outlet\",\"if\",\"gt\",\"model\",\"remaining\",\"pluralize\",\"link-to\",\"completed\"]]",
    "moduleName": "todomvc/templates/application.hbs",
    "isStrictMode": false
  });

  _exports.default = _default;
});
;define("todomvc/templates/completed", ["exports", "@ember/template-factory"], function (_exports, _templateFactory) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = (0, _templateFactory.createTemplateFactory)({
    "id": "7nr2GsSH",
    "block": "[[[1,[28,[35,0],null,[[\"todos\"],[[33,1]]]]]],[],false,[\"todo-list\",\"todos\"]]",
    "moduleName": "todomvc/templates/completed.hbs",
    "isStrictMode": false
  });

  _exports.default = _default;
});
;define("todomvc/templates/components/todo-item", ["exports", "@ember/template-factory"], function (_exports, _templateFactory) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = (0, _templateFactory.createTemplateFactory)({
    "id": "cv8V5EHE",
    "block": "[[[10,0],[14,0,\"view\"],[12],[1,\"\\n  \"],[10,\"input\"],[14,0,\"toggle\"],[15,\"checked\",[33,0,[\"completed\"]]],[15,\"onchange\",[28,[37,1],[[30,0],\"toggleCompleted\"],null]],[14,4,\"checkbox\"],[12],[13],[1,\"\\n  \"],[10,\"label\"],[15,\"ondblclick\",[28,[37,1],[[30,0],\"startEditing\"],null]],[12],[1,[33,0,[\"title\"]]],[13],[1,\"\\n  \"],[10,\"button\"],[14,0,\"destroy\"],[15,\"onclick\",[28,[37,1],[[30,0],\"removeTodo\"],null]],[12],[13],[1,\"\\n\"],[13],[1,\"\\n\"],[10,\"input\"],[14,0,\"edit\"],[15,2,[33,0,[\"title\"]]],[15,\"onblur\",[28,[37,1],[[30,0],\"doneEditing\"],[[\"value\"],[\"target.value\"]]]],[15,\"onkeydown\",[28,[37,1],[[30,0],\"handleKeydown\"],null]],[14,\"autofocus\",\"\"],[12],[13]],[],false,[\"todo\",\"action\"]]",
    "moduleName": "todomvc/templates/components/todo-item.hbs",
    "isStrictMode": false
  });

  _exports.default = _default;
});
;define("todomvc/templates/components/todo-list", ["exports", "@ember/template-factory"], function (_exports, _templateFactory) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = (0, _templateFactory.createTemplateFactory)({
    "id": "g1/dDHeO",
    "block": "[[[41,[33,1,[\"length\"]],[[[41,[33,2],[[[1,\"    \"],[10,\"input\"],[14,1,\"toggle-all\"],[14,0,\"toggle-all\"],[15,\"checked\",[36,3]],[15,\"onchange\",[28,[37,4],[[30,0],\"toggleAll\"],null]],[14,4,\"checkbox\"],[12],[13],[1,\"\\n    \"],[10,\"label\"],[14,\"for\",\"toggle-all\"],[12],[1,\"Mark all as complete\"],[13],[1,\"\\n\"]],[]],null],[1,\"  \"],[10,\"ul\"],[14,0,\"todo-list\"],[12],[1,\"\\n\"],[42,[28,[37,6],[[28,[37,6],[[33,1]],null]],null],null,[[[1,\"      \"],[1,[28,[35,7],null,[[\"todo\",\"onStartEdit\",\"onEndEdit\"],[[30,1],[28,[37,4],[[30,0],\"disableToggle\"],null],[28,[37,4],[[30,0],\"enableToggle\"],null]]]]],[1,\"\\n\"]],[1]],null],[1,\"  \"],[13],[1,\"\\n\"]],[]],null]],[\"todo\"],false,[\"if\",\"todos\",\"canToggle\",\"allCompleted\",\"action\",\"each\",\"-track-array\",\"todo-item\"]]",
    "moduleName": "todomvc/templates/components/todo-list.hbs",
    "isStrictMode": false
  });

  _exports.default = _default;
});
;define("todomvc/templates/index", ["exports", "@ember/template-factory"], function (_exports, _templateFactory) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = (0, _templateFactory.createTemplateFactory)({
    "id": "68JJvZem",
    "block": "[[[41,[33,1,[\"length\"]],[[[1,\"  \"],[1,[28,[35,2],null,[[\"todos\"],[[33,1]]]]],[1,\"\\n\"]],[]],null]],[],false,[\"if\",\"model\",\"todo-list\"]]",
    "moduleName": "todomvc/templates/index.hbs",
    "isStrictMode": false
  });

  _exports.default = _default;
});
;

;define('todomvc/config/environment', [], function() {
  var prefix = 'todomvc';
try {
  var metaName = prefix + '/config/environment';
  var rawConfig = document.querySelector('meta[name="' + metaName + '"]').getAttribute('content');
  var config = JSON.parse(decodeURIComponent(rawConfig));

  var exports = { 'default': config };

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

});

;
          if (!runningTests) {
            require("todomvc/app")["default"].create({"name":"todomvc","version":"0.0.0+5d305666"});
          }
        
//# sourceMappingURL=todomvc.map
