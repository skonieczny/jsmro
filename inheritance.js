/**
 * JsMRO - A JavaScript multiple inheritance framework
 *
 * https://github.com/stanislaw-skonieczny/jsmro
 *
 * Copyright 2013 Stanisław Skonieczny
 * Released under the CC BY-SA 3.0.
 * http://creativecommons.org/licenses/by-sa/3.0/deed.pl
 */

(function(exports) {

    var extend = function(a, b) {
        for (var name in b) {
            a[name] = b[name];
        }
        return a;
    };

    var merge = function(seqs) {
        var res = [];
        while (true) {
            var nonemptyseqs = [];
            for (var i = 0; i < seqs.length; i++) {
                if (seqs[i].length > 0)
                    nonemptyseqs.push(seqs[i]);
            }
            if (nonemptyseqs.length <= 0)
                return res;
            for (var i = 0; i < nonemptyseqs.length; i++) {
                var seq = nonemptyseqs[i];
                var cand = seq[0];
                for (var j = 0; j < nonemptyseqs.length; j++) {
                    var s = nonemptyseqs[j];
                    if (s.indexOf(cand) > 0) {
                        cand = null;
                        break;
                    }
                }
                if (cand !== null)
                    break;
            }
            if (cand === null)
                throw {'name': 'Inconsistent hierarchy'};
            res.push(cand)
            for (var i = 0; i < nonemptyseqs.length; i++) {
                var seq = nonemptyseqs[i];
                if (seq[0] === cand)
                    seq.shift();
            }
        }
    };

    var class_counter = 0;
    var registry = {};

    var Class = function() {
        class_counter += 1;
        var class_id = class_counter;
        var init = arguments[arguments.length - 1];
        var bases = Array.prototype.slice.call(arguments, 0, -1);

        var constructor = function() {
            var self = this;
            self.__class__ = constructor;
            var args = Array.prototype.slice.call(arguments);

            var partial_obj = undefined;
            for (var i = constructor.__mro__.length - 1; i >= 0; i--) {
                var base_id = constructor.__mro__[i];
                var base = registry[base_id];
                base.__initializer__.apply(null, [self, partial_obj].concat(args));
                partial_obj = extend({}, self);
            }

            if (self.__init__ !== undefined) {
                self.__init__(args);
            }
        };
        constructor.__id__ = class_counter;
        registry[class_id] = constructor;

        var mros = [];
        var bases_ids = [];
        for (var i = 0; i < bases.length; i++) {
            var base = bases[i];
            mros.push(base.__mro__.slice());
            bases_ids.push(base.__id__);
        }
        var to_merge = [[class_id]];
        to_merge = to_merge.concat(mros);
        to_merge = to_merge.concat([bases_ids]);
        constructor.__mro__ = merge(to_merge);

        constructor.__initializer__ = init;
        return constructor;

    };

    exports.Class = Class;
    
    var isSubclass = function(sub, sup) {
        if (!sub) return false;
        if (!sub.__mro__) return false;
        return sub.__mro__.indexOf(sup.__id__) >= 0;
    };

    exports.isSubclass = isSubclass;

    var isInstance = function(obj, cls) {
        if (!obj) return false;
        return isSubclass(obj.__class__, cls);
    };

    exports.isInstance = isInstance;

})(window);
