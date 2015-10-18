describe('OrdersController', function(){
    beforeEach(module('myApp'));
    
    var $controller;
    
    beforeEach(inject(function(_$controller_){
        $controller = _$controller_;
    }));

    var $scope, controller, testItem;

    beforeEach(function() {
        $scope = {};
        controller = $controller('OrdersController', { $scope: $scope });
        testItem = {
            id: 1,
            name: 'item',
            isExempt: false,
            isImport: false,
            price: 1.00
        };
        testItem2 = {
            id: 2,
            name: 'item2',
            isExempt: false,
            isImport: false,
            price: 1.00
        };
    });

    it("domestic exempt items don't have tax", function(){
        testItem.isExempt = true;
        $scope.calculateOrder(testItem);
        expect($scope.tax).toBe(0);
    });
    
    it("imported exempt items have impor tax", function(){
        testItem.isImport = true;
        testItem.isExempt = true;
        $scope.calculateOrder(testItem);
        exectedVal = $scope.roundTax(testItem.price * $scope.importTaxRate);
        expect($scope.tax).toBe(exectedVal);
    });
    
    it("domestic items have base sales tax", function(){
        $scope.calculateOrder(testItem);
        expectedVal = $scope.roundTax(testItem.price * $scope.baseTaxRate);
        expect($scope.tax).toBe(expectedVal);
    });
    
    it("imported non-exempt items have base sales tax and import tax", function(){
        testItem.isImport = true;
        $scope.calculateOrder(testItem);
        expectedVal = $scope.roundTax(testItem.price * ($scope.baseTaxRate + $scope.importTaxRate));
        expect($scope.tax).toBe(expectedVal);
    });
    
    it("tax rounds to $0.05", function(){
        testItem.price = 1.23;
        $scope.calculateOrder(testItem);
        expect(($scope.tax * 100) % 5).toBe(0);
    });

    it("tax is sum of all items's tax", function(){
        $scope.calculateOrder(testItem);
        itemTax = $scope.tax;
        $scope.calculateOrder(testItem2);
        item2Tax = $scope.tax;
        expectedVal = $scope.roundTax(testItem.price * $scope.baseTaxRate) + $scope.roundTax(testItem2.price * $scope.baseTaxRate);
        expect($scope.tax).toBe(expectedVal);
    });

    it("total is sum of items + tax", function(){
        $scope.calculateOrder(testItem);
        itemTax = $scope.tax;

        $scope.tax = 0;
        $scope.calculateOrder(testItem2);
        item2Tax = $scope.tax;

        totalTax = itemTax + item2Tax;
        totalItemPrices = testItem.price + testItem2.price;

        $scope.items = [testItem, testItem2];
        $scope.buildOrder([1,2]);
        expect($scope.total).toBe(totalItemPrices + totalTax);
    });

});