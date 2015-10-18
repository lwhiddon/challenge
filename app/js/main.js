var app = angular.module('myApp', []);

app.controller('OrdersController', function($scope){
	$scope.items = window.items;
	$scope.selectedOrders = [];
	$scope.total = 0;
	$scope.tax = 0;
	$scope.roundedTax = 0;
	$scope.computedItems = [];
	$scope.baseTaxRate = .1;
	$scope.importTaxRate = .05;
	
	$scope.buildOrder = function(orders){
		$scope.computedItems = [];
		$scope.total = 0;
		$scope.tax = 0;
		$scope.roundedTax = 0;
		if(!orders) {
			orders = $scope.selectedOrders;
		}
		$scope.selectedOrders = orders;
		angular.forEach($scope.items, function(item, key){
			if($scope.selectedOrders.indexOf(item.id) > -1){
				$scope.calculateOrder(item);
			}
		});
	},

	$scope.roundTax = function(tax) {
		return Math.floor(tax) + ((Math.ceil((Math.round((tax - Math.floor(tax))* 100))/5))*5)/100;
	},

	$scope.addTax = function(price, rate) {
		tax = price * rate;
		tax = $scope.roundTax(tax);
		return tax;
	},

	$scope.getTaxRate = function(item){
		taxRate = 0;
		if(!item.isExempt){
			taxRate += $scope.baseTaxRate;
		}
		if(item.isImport){
			taxRate += $scope.importTaxRate;
		}
		return taxRate;
	}
	$scope.calculateOrder = function(item){
		finalItem = {
			name: item.name,
			price: item.price
		};
		taxRate = 0;
		tax = 0;

		$scope.getTaxRate(item);

		if(taxRate > 0){
			tax = $scope.addTax(finalItem.price, taxRate);
			finalItem.price = finalItem.price + tax;
		}
		$scope.tax += tax;
		$scope.total += finalItem.price;
		$scope.computedItems.push(finalItem);
	}

});

app.directive('checkList', function(){
	return {
		link: function(scope, elem, attrs){
			elem.bind('change', function(){
				itemValue = parseInt(elem.prop('value'));
				if(elem.prop('checked'))
					scope.selectedOrders.push(itemValue);
				else {
					index = scope.selectedOrders.indexOf(itemValue);
					scope.selectedOrders.splice(index, 1);
				}
			});
		}
	};
});