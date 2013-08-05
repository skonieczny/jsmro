
test('TEST constructor', function() {
    var A = Class(function(self, sup, x) {
        self.p = x;
        self.f = function() {
            return self.p;  
        };
    });

    var a = new A(15);
    equal(15, a.p);
    equal(15, a.f());
});

test('TEST init', function() {
    var A = Class(function(self, sup) {
        self.__init__ = function(x, y) {
            self.a = x;
            self.b = y;
        };
        self.f = function() {
            return self.a;  
        };
    });

    var a = new A(15, 44);
    equal(15, a.a);
    equal(15, a.f());
    equal(44, a.b)
});

test('TEST simple inheritance', function() {
    var A = Class(function(self) {
        self.a = 'a';
        self.c = 'a';
    });
    var B = Class(A, function(self) {
        self.b = 'b';
        self.c = 'b';
    });
    var b = new B();
    equal(b.b, "b");
    equal(b.a, "a");
    equal(b.c, "b");
});

test('TEST simple super', function() {
    var A = Class(function(self) {
        self.a = 'a';
        self.f = function() {
            return "A" + self.x;  
        };
    });
    var B = Class(A, function(self, sup) {
        self.x = 'X';
        self.b = 'b';
        self.f = function() {
            return "B" + sup.f();
        };
    });
    var b = new B();
    equal(b.f(), "BAX");
});

test('TEST jump super', function() {
    var A = Class(function(self) {
        self.f = function() {
            return "A";  
        };
    });
    var B = Class(A, function(self) {
    });
    var C = Class(B, function(self, sup) {
        self.f = function() {
            return "C" + sup.f();  
        };
    });
    var c = new C();
    equal("CA", c.f());
});

test('TEST two bases', function() {
    var A1 = Class(function(self, sup) {
        self.f = function() {
            return "A1" + sup.f(); 
        };
    });
    var A2 = Class(function(self, sup) {
        self.f = function() {
            return "A2";  
        };
    });
    var B = Class(A1, A2, function(self, sup) {
        self.f = function() {
            return "B" + sup.f();  
        };
    });
    var b = new B();
    equal(b.f(), "BA1A2");
});

test('TEST diamond', function() {
    var constructor = 0;
    var A = Class(function(self, sup) {
        constructor += 1;
        self.__init__ = function() {
            self.init += 1;
        };
        self.f = function() {
            return "A"; 
        };
    });
    var B1 = Class(A, function(self, sup) {
        self.f = function() {
            return "B1" + sup.f();  
        };
    });
    var B2 = Class(A, function(self, sup) {
        self.f = function() {
            return "B2" + sup.f();
        };
    });
    var C = Class(B1, B2, function(self, sup) {
        self.init = 0;
        self.f = function() {
            return "C" + sup.f();  
        };
    });
    var c = new C();
    equal(c.f(), "CB1B2A");
    equal(1, c.init);
    equal(1, constructor);
});

test('TEST triangle', function() {
    var A = Class(function(self, sup) {
        self.f = function() {
            return "A"; 
        };
    });
    var B = Class(A, function(self, sup) {
        self.f = function() {
            return "B" + sup.f();  
        };
    });
    var C = Class(B, function(self, sup) {
        self.f = function() {
            return "C" + sup.f();
        };
    });
    var D = Class(C, B, function(self, sup) {
        self.f = function() {
            return "D" + sup.f();  
        };
    });
    var d = new D();
    equal(d.f(), "DCBA");
});

test('TEST wrong order', function() {
    var A = Class(function(self, sup) {
    });
    var B = Class(A, function(self, sup) {
    });
    raises(function(){ 
        Class(A, B, function(self, sup) {});
    }, function(e) { return e.name === "Inconsistent hierarchy"; });
});

test('TEST no super class', function() {
    var A = Class(function(self, sup) {
        self.f = function() {
            return sup;
        };
    });
    var a = new A();
    equal(undefined, a.f());
});

test('TEST complicated mro', function() {
    var O = Class(function(self, sup) {
        self.f = function() {
            return "O";
        };
    });
    var F = Class(O, function(self, sup) {
        self.f = function() {
            return "F" + sup.f();
        };
    });
    var E = Class(O, function(self, sup) {
        self.f = function() {
            return "E" + sup.f();
        };
    });
    var D = Class(O, function(self, sup) {
        self.f = function() {
            return "D" + sup.f();
        };
    });
    var C = Class(D, F, function(self, sup) {
        self.f = function() {
            return "C" + sup.f();
        };
    });
    var B = Class(D, E, function(self, sup) {
        self.f = function() {
            return "B" + sup.f();
        };
    });
    var A = Class(B, C, function(self, sup) {
        self.f = function() {
            return "A" + sup.f();
        };
    });
    var a = new A();
    equal(a.f(), "ABCDEFO");
});

test('TEST complicated other mro', function() {
    var O = Class(function(self, sup) {
        self.f = function() {
            return "O";
        };
    });
    var F = Class(O, function(self, sup) {
        self.f = function() {
            return "F" + sup.f();
        };
    });
    var E = Class(O, function(self, sup) {
        self.f = function() {
            return "E" + sup.f();
        };
    });
    var D = Class(O, function(self, sup) {
        self.f = function() {
            return "D" + sup.f();
        };
    });
    var C = Class(D, F, function(self, sup) {
        self.f = function() {
            return "C" + sup.f();
        };
    });
    var B = Class(E, D, function(self, sup) {
        self.f = function() {
            return "B" + sup.f();
        };
    });
    var A = Class(B, C, function(self, sup) {
        self.f = function() {
            return "A" + sup.f();
        };
    });
    var a = new A();
    equal(a.f(), "ABECDFO");
});

test('TEST non 2.2 mro', function() {
    var O = Class(function(self, sup) {
        self.f = function() {
            return "O";
        };
    });
    var A = Class(O, function(self, sup) {
        self.f = function() {
            return "A" + sup.f();
        };
    });
    var B = Class(O, function(self, sup) {
        self.f = function() {
            return "B" + sup.f();
        };
    });
    var C = Class(O, function(self, sup) {
        self.f = function() {
            return "C" + sup.f();
        };
    });
    var D = Class(O, function(self, sup, full) {
        if (full) {
            self.f = function() {
                return "D" + sup.f();
            };
        }
    });
    var E = Class(O, function(self, sup) {
        self.f = function() {
            return "E" + sup.f();
        };
    });
    var K1 = Class(A, B, C, function(self, sup) {
        self.f = function() {
            return "K1" + sup.f();
        };
    });
    var K2 = Class(D, B, E, function(self, sup) {
        self.f = function() {
            return "K2" + sup.f();
        };
    });
    var K3 = Class(D, A, function(self, sup) {
        self.f = function() {
            return "K3" + sup.f();
        };
    });
    var Z = Class(K1, K2, K3, function(self, sup) {
        self.f = function() {
            return "Z" + sup.f();
        };
    });
    var z = new Z(true);
    equal(z.f(), "ZK1K2K3DABCEO");
    var z = new Z(false);
    equal(z.f(), "ZK1K2K3ABCEO");
});

test('TEST isInstance', function() {
    var A = Class(function(self, sup) {
    });
    var B = Class(A, function(self, sup) {
    });
    var C = Class(function(self, sup) {
    });
    var a = new A();
    var b = new B();
    equal(isInstance(null, A), false);
    equal(isInstance({}, A), false);
    equal(isInstance(a, A), true);
    equal(isInstance(b, A), true);
    equal(isInstance(a, B), false);
    equal(isInstance(b, B), true);
    equal(isInstance(b, C), false);
    equal(isInstance(a, a), false);
});

test('TEST isSubclass', function() {
    var A = Class(function(self, sup) {
    });
    var B = Class(A, function(self, sup) {
    });
    var C = Class(function(self, sup) {
    });
    equal(isSubclass(null, A), false);
    equal(isSubclass({}, A), false);
    equal(isSubclass(A, A), true);
    equal(isSubclass(B, A), true);
    equal(isSubclass(A, B), false);
    equal(isSubclass(B, B), true);
    equal(isSubclass(B, C), false);
});
