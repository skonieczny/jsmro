JsMRO
=====

Multiple inheritance for JS. Simple, but powerfull. Well tested.
Inspired by the Python MRO C3 algorythm. (http://www.python.org/download/releases/2.3/mro/)

JsMRO provides:
* simple and easy to use interface,
* method resolution order identical to MRO C3,
* private members,
* do not interfere with JS `this` keyword,
* simple and short stacktraces form super methods.

To use JsMRO in your project just include `inheritance.js` and use global `Class` function to define your classes.
See the examples below.


Examples
========

Simple cases
------------

To define class call the `Class` function and pass constructor:

    // This is empty class
    var MyClass = Class(function(self, sup) {});

    // Instantiate it
    var myObject = new MyClass();

You can pass params when creating instance and initialize your object inside constructor:

    var MyClass = Class(function(self, sup, myParam) {
        // Here comes initialisation:
        self.myAttr = myParam;
        self.myFunction = function() {
            return self.myAttr;
        };
    });
    
    var myObject = new MyClass(15);
    // now myObject.myAttr == 15 and myObject.myFunction() returns 15

Inheritance
-----------

To inherite pass base-classes before constructor. Use `sup` to call super methods:

    var MyBaseClass = Class(function(self, sup) {
        self.f = function() {
            return 'MyBaseClass';
        };
    });

    var MySubClass = Class(MyBaseClass, function(self, sup) {
        self.f = function() {
            // call super class function:
            var superValue = sup.f();
            return superValue + ' MySubClass';
        };
    });
    
    var o = new MySubClass();
    // now o.f() returns 'MyBaseClass MySubClass'

Multiple inheritance
--------------------

To inherite form more than one base classe pass all of them before constructor.
Super-methods are called from left to right. 
To fully understand method resolution order (C3 MRO) read http://www.python.org/download/releases/2.3/mro/ .

    var MyBaseClass = Class(function(self, sup) {
        self.f = function() {
            return 'MyBaseClass';
        };
    });

    var MyMixin = Class(function(self, sup) {
        self.f = function() {
            return 'MyMixin ' + sup.f();
        };
    });

    var MySubClass = Class(MyMixin, MyBaseClass, function(self, sup) {
        self.f = function() {
            return 'MySubClass ' + sup.f();
        };
    });

    var o = new MySubClass();
    // now o.f() returns 'MySubClass MyMixin MyBaseClass'

Initializers
------------

Initializer is a `__init__` method. 
It is called just after the object has been constructed and with the same parameters the constructor has been called. 
Since object has allready been constructed, inside `__init__` you can do everything you can do in any other method,
including calling super and other methods. 

    var MyClass = Class(function(self, sup) {
        self.__init__ = function(param) {
            self.param = param;
        };
    });

    var o = new MyClass('value');
    // now o.param == 'value'

Private members
---------------

You can simply create private members with `var` keyword:

    var MyClass = Class(function(self, sup) {
        var myPrivateCounter = 0;
        
        self.getCounter = function() {
            myPrivateCounter += 1;
            return myPrivateCounter;
        };
    });

In the similar way you can create private functions.


Full API
========

Function Class
--------------

`Class(baseClasses..., function(self, sup, args...) { // constructor body })` - returns new class.
Takes base classes and a constructor function as an argument. 
Inside constructor function `self` is current object, `sup` is super object and `args` is argument list.
Returns new class that inherits from 'baseClasses' and is constructed with constructor function.

To instantiate class use `new` keyword on class: `o = new C(args...);`.
At first constructor function is invoked on classes bottom-up to construct the object.
When object is fully constructed and it has `__init__` method, it is called with initial arguments. 

Use `__init__` method to initialize your object using MRO.

Function isInstance
-------------------

`isInstance(obj, cls)` function checks if object `obj` is instance of class `cls`. 

Function isSubclass
-------------------

`isSubclass(sub, sup)` function checks if class `sub` is subclass of class `sup` or equal. 

Other notes
-----------

JsMRO use `__class__` attribute on your objects and `__mro__`, `__id__` and `__initializer__` on classes.
Do not use them, or you 'll mess everything up.
