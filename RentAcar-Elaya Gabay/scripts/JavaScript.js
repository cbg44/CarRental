 //Set current year in pages footer -start//
	$(function() {
	    var year = new Date().getFullYear();
	    $(".copyright").append(' ' + year);
	    document.getElementById('play').load();
	    loadAll();
	});



	 //JASON cars list load and parse functions start//

	var datacar = localStorage.getItem("json_cars");
	var cars = JSON.parse(datacar); //store cars
	var currentDis;
	var RentalPrice;
	var gear = "";
	var worker = new Worker("scripts/webworker.js");
	var LocationWorker = new Worker("scripts/LocationWorker.js");


	function run2() {
	    buildlist();
	};

	function buildlist() {

	    for (i = 0; i < cars.length; i++) {
	        if (cars[i].avilability == "true") {
	            $("#carsList").append(
	                '<div class="collaps" data-role="collapsible" data-mini="true" data-theme="a" data-content-theme="b">' + '<h3>' + cars[i].carModel + ", " + cars[i].gear + ", " + cars[i].year + '</h3>' + '<img src="' + cars[i].imageSrc + '" width="200px"/>' + '<input type="button" value="Select this car" data-icon="check" onclick="selectedCar(' + i + ')"/></div>');
	        };
	    };
	};

	 //save form fields on every change//
	function savefield(fieldName) {
	    var value = document.getElementById(fieldName).value;
	    localStorage.setItem(fieldName, value);
	};


	 //here the loading from local storage to the form fields starts//
	function loadAll() {
	    document.getElementById("idNumber").value = localStorage.getItem("idNumber");
	    document.getElementById("fName").value = localStorage.getItem("fName");
	    document.getElementById("LName").value = localStorage.getItem("LName");
	    document.getElementById("eMail").value = localStorage.getItem("eMail");
	    document.getElementById("landNum").value = localStorage.getItem("landNum");
	    document.getElementById("mobileNum").value = localStorage.getItem("mobileNum");
	    document.getElementById("birthDate").value = localStorage.getItem("birthDate");
	    document.getElementById("licenseNum").value = localStorage.getItem("licenseNum");
	    document.getElementById("Password").value = localStorage.getItem("Password");
	};


	 //phonenumber validation start//
	function validateForm() {
	    var tel = document.getElementById("landNum").value;
	    var mobile = document.getElementById("mobileNum").value;

	    if ((tel == null || tel == "") && (mobile == null || mobile == "")) {
	        $("#RegistrationPopup").popup("open");
	        return false;
	    } else {
	        $.ajax({
	            type: "POST",
	            url: "submit.php",
	            data: "userNo",
	            success: function() {
	                alert("Registration Completed");

	            },
	        });
	        location.href = "#catalog";
	        alert("Registration Completed");
	    }
	};


	 //Clear form//
	function clearForm() {
	    alert("clear");
	    localStorage.clear();
	    loadAll();
	};

	 //Validation on log in //
	function logIn() {
	    var storeID = localStorage.getItem("idNumber"),
	        storePass = localStorage.getItem("Password"),
	        enterID = document.getElementById("loginID").value,
	        enterPass = document.getElementById("loginPassword").value;

	    if ((storeID != enterID) || (storePass != enterPass)) {

	        $("#loginPop").popup("open");
	        return false;
	    } else {
	        $.mobile.changePage("#catalog", {
	            transition: "slide"
	        });

	    }
	};


	 //save selected car to local storage and present//
	function selectedCar(x) {

	    selectedCar = {
	        carIndex: x,
	        carNo: cars[x].carNo,
	        carModel: cars[x].carModel,
	        gear: cars[x].gear,
	        imageSrc: cars[x].imageSrc,
	        year: cars[x].year,
	        avilability: "false"
	    };

	    localStorage.setItem("selected_car", JSON.stringify(selectedCar));

	    document.getElementById("Scar").value = selectedCar.carNo + " " + selectedCar.carModel;
	    document.getElementById("Syear").value = selectedCar.year;
	    document.getElementById("Sgear").value = selectedCar.gear;
	    document.getElementById("Ssrc").src = selectedCar.imageSrc;
	    $.mobile.changePage("#tripCalc", {
	        transition: "slide"
	    });


	};


	 //Return car//
	function returnCar() {

	    var plate = document.getElementById("LicensePlate").value;
	    var plateCheck = 0;
	    for (i = 0; i < cars.length; i++) {
	        if (cars[i].avilability == "false" && plate == cars[i].carNo) {
	            cars[i] = {
	                carNo: cars[i].carNo,
	                carModel: cars[i].carModel,
	                gear: cars[i].gear,
	                imageSrc: cars[i].imageSrc,
	                year: cars[i].year,
	                avilability: "true"
	            };
	            localStorage.setItem("json_cars", JSON.stringify(cars));
	            alert(cars[i].carNo + " " + cars[i].carModel + " Returned to pool");
	            refresh();
	        } else {
	            plateCheck++;
	        }
	    }
	    if (plateCheck == cars.length) {
	        alert('Car license plate not found');
	    }
	};

	

	$(document).on("pageshow", "#tripCalc", function(event) {
	    $('#submit').click(function() {
	        runGeocoder()
	    });
	    Init();
	    getLocation();


	});

	function showPosition(position) {

	    var lat = position.coords.latitude;
	    var lon = position.coords.longitude;
	    currentPosition = new google.maps.LatLng(lat, lon);
	    mapholder = document.getElementById('map_canvas');
	    mapholder.style.height = '250px';
	    mapholder.style.width = '500px';
	    var myOptions = {
	        center: currentPosition,
	        zoom: 18,
	        mapTypeId: google.maps.MapTypeId.ROADMAP,
	        mapTypeControl: false,
	        navigationControlOptions: {
	            style: google.maps.NavigationControlStyle.SMALL
	        }
	    };
	    map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	    var myMarker = new google.maps.Marker({
	        position: currentPosition,
	        map: map,
	        title: "You are here!"
	    });
	    google.maps.event.trigger(map, "resize");

	};


	function Init() {

	    destinationMarker = null;
	    directionsService = new google.maps.DirectionsService();
	    directionsDisplay = new google.maps.DirectionsRenderer();
	}

	function getLocation() {
	    if (destinationMarker != null)
	        destinationMarker.setMap(null);

	    if (directionsDisplay != null)
	        directionsDisplay.setMap(null);

	    document.getElementById("to").value = "";

	    if (Modernizr.geolocation) {
	        navigator.geolocation.getCurrentPosition(showPosition, showError);

	    }
	};

	function runGeocoder() {

	    var geoCoder = new google.maps.Geocoder();

	    directionsDisplay.setMap(null);
	    if (destinationMarker != null) {
	        destinationMarker.setMap(null);
	    }

	    var stringToSearch = $('#to').val();

	    geoCoder.geocode({
	            'address': stringToSearch
	        },
	        function(results, status) {
	            if (status == google.maps.GeocoderStatus.OK) {
	                LocationWorker.postMessage("");
	                LocationWorker.onmessage = function(e) {
	                    document.getElementById('play').play();
	         
	                }

	                resultLocation = results[0].geometry.location;
	                map.setCenter(results[0].geometry.location);
	                if (destinationMarker != null)
	                    destinationMarker.setPosition(results[0].geometry.location);
	            } else {
	                destinationMarker = new google.maps.Marker({
	                    map: map,
	                    'title': stringToSearch,
	                    position: results[0].geometry.location
	                });


	            }
	            displayRoute();
	        });

	};


	function displayRoute() {
	    if (directionsDisplay != null)
	        directionsDisplay.setMap(map);
	    var request = {
	        'origin': currentPosition,
	        'destination': resultLocation,
	        'travelMode': google.maps.DirectionsTravelMode.DRIVING,
	        'unitSystem': google.maps.UnitSystem.METRIC
	    };

	    directionsService.route(
	        request,
	        function(response, status) {

	            if (status === google.maps.DirectionsStatus.OK) {

	                directionsDisplay.setDirections(response);

	                var routeDistance = response.routes[0].legs[0].distance.value;
	                document.getElementById("Sdist").value = (Math.round(routeDistance / 1000) + " km");
	                currentDis = Math.round(routeDistance / 1000);
	            } else {
	                // the request failed,should do some error handling//
	                alert("Failed to get route");
	            }

	        }
	    );
	};


	function showError(error) {
	    switch (error.code) {
	        case error.PERMISSION_DENIED:
	            x.innerHTML = "User denied the request for Geolocation."
	            break;
	        case error.POSITION_UNAVAILABLE:
	            x.innerHTML = "Location information is unavailable."
	            break;
	        case error.TIMEOUT:
	            x.innerHTML = "The request to get user location timed out."
	            break;
	        case error.UNKNOWN_ERROR:
	            x.innerHTML = "An unknown error occurred."
	            break;
	    }
	}

	 //Calculate  price//

	function callWorker() {
	        if (currentDis == null) {
	            $("#Popalert1").popup("open");
	            document.getElementById("Price").value = "Please calculate distance first.";
	            return false;
	        }
	        worker.postMessage({
	            dis: currentDis,
	            gear: selectedCar.gear
	        });

	        worker.onmessage = function(e) {
	            RentalPrice = e.data;
	            var interval = setInterval(function() {
	                document.getElementById("Price").value = (RentalPrice + " ILS");
	                clearInterval(interval);
	            }, 2000);
	        }
	        wwterminate();

	    }


	 //confirm order//		
	function confirmOrder() {

	    var x = selectedCar.carIndex;

	    if (RentalPrice == null) {
	        $("#Popalert").popup("open");
	        return false;
	    }

	    cars[x] = {
	        carNo: selectedCar.carNo,
	        carModel: selectedCar.carModel,
	        gear: selectedCar.gear,
	        imageSrc: selectedCar.imageSrc,
	        year: selectedCar.year,
	        avilability: "false"
	    };

	    localStorage.setItem("json_cars", JSON.stringify(cars));
	    alert('Thank You. \n We will contact you shortly.');
	    refresh();
	};



	 
	 //refresh to update//
	function refresh() {
	        var path = location.pathname;
	        var filename = path.match(/.*\/([^/]+)\.([^?]+)/i)[1] + ".html";
	        location.href = filename;
	    }


	 //Canvas//
	function drawImage() {
	        var canvas = document.getElementById('myCanvas');
	        var context = canvas.getContext('2d');
	        var interval = setInterval(draw_next_image, 3000);

	        var img = new Image();
	        img.src = "img/localstorageimg/audir8.jpg";

	        img.onload = function() {
	            context.drawImage(img, 0, 0, 529, 298);
	        };
	    }


	 //web worker//	
	function wwterminate() {
	        document.getElementById('play').pause();
	        $.mobile.loading('hide');
	        LocationWorker.terminate();
	    }
