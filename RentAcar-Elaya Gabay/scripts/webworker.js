		//Calculate price - start//
		
		onmessage = function (e) {
				
					if (e.data.dis > 89){
						RentalPrice=Math.round(((e.data.dis-90)*0.9)+108);
					}
					else{
						RentalPrice=Math.round(e.data.dis*1.2);
					};
					
					if (e.data.gear == 'Manual'){
						RentalPrice= Math.round(RentalPrice-(RentalPrice*0.1));
					};
				postMessage(RentalPrice);
				};
				
		//Calculate price - end//