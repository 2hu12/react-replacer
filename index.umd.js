(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react')) :
  typeof define === 'function' && define.amd ? define(['exports', 'react'], factory) :
  (factory((global.reactReplacer = global.reactReplacer || {}),global.React));
}(this, function (exports,React) { 'use strict';

  React = 'default' in React ? React['default'] : React;

  var toArray = function (arr) {
    return Array.isArray(arr) ? arr : Array.from(arr);
  };

  var toConsumableArray = function (arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    } else {
      return Array.from(arr);
    }
  };

  var keyid = 0;

  function plain(tag, keyid, str) {
    return React.DOM[tag]({ key: keyid }, str);
  }

  function span(keyid, str) {
    return plain('span', keyid, str);
  }

  function flattenFrom(arr) {
    if (arr.length === 1 && arr[0] instanceof Array) {
      return arr[0];
    }
    return arr;
  }

  function replaceChildren(rules) {
    if (!(rules instanceof Array)) rules = [rules];

    return function (raw) {
      if (!rules.length || !raw.length) return [span(keyid++, raw)];

      var _rules = rules;

      var _rules2 = toArray(_rules);

      var head = _rules2[0];

      var tail = _rules2.slice(1);

      if (typeof head.pattern === 'string' && !head.pattern.length) {
        return replaceChildren(tail)(raw);
      }

      // checkout String.prototype.split(), Capturing parentheses
      if (head.pattern instanceof RegExp) {
        var source = head.pattern.source;

        if (!/^\(.*\)$/.test(source)) {
          head.pattern = new RegExp('(' + source + ')', head.pattern.global ? head.pattern.flags : head.pattern.flags + 'g');
        }
      } else {
        if (!/^\(.*\)$/.test(head.pattern)) {
          head.pattern = new RegExp('(' + head.pattern + ')', 'g');
        }
      }

      var children = [];
      var lastIndex = 0;
      var match = void 0;

      while (match = head.pattern.exec(raw)) {
        if (match.index > lastIndex) {
          children.push(replaceChildren(tail)(raw.slice(lastIndex, match.index)));
        }
        children.push(head.replacement.apply(head, [keyid++, match[0]].concat(toConsumableArray(match.slice(2)))));
        lastIndex = match.index + match[0].length;
      }

      if (lastIndex < raw.length) {
        children.push(replaceChildren(tail)(raw.slice(lastIndex)));
      }

      return children;
    };
  }

  var replacer = function replacer(replacement) {
    return function (raw) {
      return function (pattern) {
        if (raw instanceof RegExp) {
          var _ref = [raw, pattern];
          pattern = _ref[0];
          raw = _ref[1];
        }

        return replaceChildren({
          pattern: pattern,
          replacement: replacement
        })(raw);
      };
    };
  };

  function greplacer() {
    for (var _len = arguments.length, rules = Array(_len), _key = 0; _key < _len; _key++) {
      rules[_key] = arguments[_key];
    }

    rules = flattenFrom(rules);

    return function (raw) {
      return replaceChildren(rules)(raw);
    };
  }

  function extendableGreplacers() {
    for (var _len2 = arguments.length, rules = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      rules[_key2] = arguments[_key2];
    }

    rules = flattenFrom(rules);

    function extendable(raw) {
      return replaceChildren(rules)(raw);
    }

    extendable.extend = function () {
      for (var _len3 = arguments.length, newConf = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        newConf[_key3] = arguments[_key3];
      }

      return function (raw) {
        return replaceChildren(rules.concat(newConf))(raw);
      };
    };

    return extendable;
  }

  exports['default'] = replaceChildren;
  exports.replacer = replacer;
  exports.greplacer = greplacer;
  exports.extendableGreplacers = extendableGreplacers;

  Object.defineProperty(exports, '__esModule', { value: true });

}));