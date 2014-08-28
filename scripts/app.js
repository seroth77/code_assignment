(function(){
	// create moduel directive
	var app = angular.module('weather',[]);
	// create controller
	app.controller('WeatherController', ['$scope', '$http', function($scope, $http){
		// get the submit click event
		$scope.fetchWeather = function(zip){
			// clear the weather object
			$scope.newWeather = {};
			// get the weather based on zip code
			getWeather(zip);
		}

		// this function will use the Yahoo API to retrieve the weather information
		// based on user entered zip code information
		function getWeather(zip){
			// Make the JSON Rest call
			$http.get('https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20location%3D'+zip+'&format=json&diagnostics=true&callback=')
				.then(function(data){
					console.log(data.data.query.results.channel);
					// upon completion set the returned JSON object to the scope object
					$scope.newWeather = data.data.query.results.channel;

					$scope.currentdate = new Date();

					var hours = $scope.currentdate.getHours();
					var minutes = $scope.currentdate.getMinutes();

					var timeOfDay = "";
					var dn = "";
					(hours>=12) ? dn="PM" : dn="AM";
					if (hours>12){ hours=hours-12; }
					if (hours==0){ hours=12; }
					if (minutes<=9){ minutes="0"+minutes; }

					if ((hours > 6) &&  (dn == "PM")){ timeOfDay = "n" }
					else{ timeOfDay = "d" }

					$scope.todayDate = hours + ":" + minutes + " " + dn;
					$scope.dayNight = timeOfDay;

					$scope.heatIndex = getHeatIndex($scope.newWeather.atmosphere.humidity, $scope.newWeather.item.condition.temp);
					//console.log($scope.heatIndex);
					//console.log($scope.todayDate);
				});
		}

		function getHeatIndex(humidity, temp){
			var index = Math.round(-Math.abs(42.379) + (2.04901523 * temp) + (10.14333127 * humidity) - (0.22475541 * temp * humidity) - (6.83783 * Math.pow(10,-3) * Math.pow(temp,2)) - (5.481717 * Math.pow(10,-2) * Math.pow(humidity,2)) + (1.22874 * Math.pow(10,-3) * Math.pow(temp,2) * humidity) + (8.5282 * Math.pow(10,-4) * temp * Math.pow(humidity,2)) - (1.99 * Math.pow(10,-6) * Math.pow(temp,2) * Math.pow(humidity,2)));
			return index;
		}

		// default set the weather 
		getWeather('32792');
	}]);
})();
