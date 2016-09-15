// Generated by LiveScript 1.3.1
(function(){
  var p, STRIP_COMMENTS, ARGUMENT_NAMES, native_func, params, $new, toString$ = {}.toString;
  p = require('prelude-ls');
  STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
  ARGUMENT_NAMES = /([^\s,]+)/g;
  native_func = "function () { [native code] }";
  params = function(func){
    var current, fnStr, result;
    current = func.toString();
    if (current === native_func) {
      throw "Native Function by Flyber is not supported. Please use configuration of injections instead: { inject: ['service1', 'service2'], func: func }";
    }
    fnStr = func.toString().replace(STRIP_COMMENTS, '');
    result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
    if (result === null) {
      return [];
    } else {
      return result;
    }
  };
  $new = function(){
    var registry, register, transform, loadString, load, cloneService, clone, cloneObject, object, service, flyber, extract, x$;
    registry = {};
    register = function(name){
      var o;
      if (registry[name] != null) {
        return name;
      }
      o = function(){
        var ref$;
        return (ref$ = o.$get) != null ? typeof ref$.apply == 'function' ? ref$.apply(o, arguments) : void 8 : void 8;
      };
      registry[name] = o;
      return name;
    };
    transform = function(name){
      return registry[name];
    };
    loadString = function(str){
      if (str.indexOf('*') > -1) {
        return require('glob').sync(str).forEach(load);
      } else {
        return load(
        require(
        str));
      }
    };
    load = function(any){
      switch (false) {
      case toString$.call(any).slice(8, -1) !== 'Array':
        return p.map(load)(
        any);
      case toString$.call(any).slice(8, -1) !== 'Object':
        return any.func.apply(this, p.map(transform)(
        p.each(register)(
        any.inject)));
      case toString$.call(any).slice(8, -1) !== 'Function':
        return any.apply(this, p.map(transform)(
        p.each(register)(
        params(
        any))));
      case toString$.call(any).slice(8, -1) !== 'String':
        return loadString(
        any);
      default:
        return any;
      }
    };
    cloneService = function(obj, copy){
      switch (toString$.call(obj).slice(8, -1)) {
      case 'Object':
        return cloneObject(obj, copy);
      case 'Function':
        return copy.$get = obj;
      }
    };
    clone = function(obj, copy, attr){
      switch (toString$.call(obj[attr]).slice(8, -1)) {
      case 'Function':
        return copy[attr] = function(){
          return obj[attr].apply(obj, arguments);
        };
      default:
        return copy[attr] = obj[attr];
      }
    };
    cloneObject = function(obj, copy){
      var attr, results$ = [];
      for (attr in obj) {
        results$.push(clone(obj, copy, attr));
      }
      return results$;
    };
    object = function(name, object){
      var pub;
      pub = transform(
      register(
      name));
      return cloneObject(object, pub);
    };
    service = function(name, object){
      var pub;
      pub = transform(
      register(
      name));
      return cloneService(object, pub);
    };
    flyber = {};
    extract = function(item){
      if (item != null) {
        return p.pairsToObj(
        p.objToPairs(
        transform(
        item)));
      } else {
        return p.map(function(it){
          return it[0];
        })(
        p.objToPairs(
        registry));
      }
    };
    x$ = flyber;
    x$.registry = extract;
    x$.require = function(path){
      return load(
      require(
      path));
    };
    x$.run = function(f){
      load(f);
      return flyber;
    };
    x$.service = function(name, func){
      service(name, load(
      func));
      return flyber;
    };
    x$.object = function(name, o){
      object(name, o);
      return flyber;
    };
    x$.eval = load;
    x$.$new = $new;
    flyber.object('$flyber', flyber);
    return flyber;
  };
  module.exports = $new();
}).call(this);
