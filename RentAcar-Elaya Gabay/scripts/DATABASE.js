		//just a data base//
		
		
	$(function () {
			 
		run();
		run2();
		})

	function run() {
				
	if (localStorage.getItem('json_cars') == null) {
		var cars = [
		{ carNo: "86-821-92", carModel: "AlFA Romeo giulietta", gear: "Automatic", imageSrc: "img/localstorageimg/alfa.jpg", year: "2013", avilability: "true" },
		{ carNo: "86-821-93", carModel: "Audi R8", gear: "Automatic", imageSrc: "img/localstorageimg/audir8.jpg", year: "2011", avilability: "true" },
		{ carNo: "86-821-94", carModel: "B.M.W Z 4", gear: "Manual", imageSrc: "img/localstorageimg/bmwz4.jpg", year: "2013", avilability: "true" },
		{ carNo: "86-821-95", carModel: "Ferrari 458", gear: "Manual", imageSrc: "img/localstorageimg/ferrari.jpg", year: "2013", avilability: "true" },
		{ carNo: "86-821-96", carModel: "Porsche 911", gear: "Automatic", imageSrc: "img/localstorageimg/Porsche911.jpg", year: "2014", avilability: "true" },
		];
		localStorage.setItem("json_cars", JSON.stringify(cars));
		}
		}
			
		//finish//