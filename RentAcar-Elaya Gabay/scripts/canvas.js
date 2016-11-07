

var numOfPic =  5 //the number of images of my folder


	var images = new Array(numOfPic);// this creates the images objects in an Array so the later i can is it in the interval function
		for (var i = 0;i<images.length;i++) {
			images[i] = new Image;
			images[i].src = "img/canvas/"+(i)+".jpg"// i have neamed the images on my folder as "1.jpg", "2.jpg" and so on
			//if i have more images to add to it i will name them with the appropriate number.
		};

		



			// global variabls
			
			var counter = 0
			var context
			var interval
			
			// this is the main function
			
			function draw(){
				myCanvas = document.getElementById('myCanvas');
				context = myCanvas.getContext('2d');
				interval = setInterval(draw_next_image, 3000);
			}
			
			// this is the function called with each interval to draw next image
			
			function draw_next_image(){
				context.clearRect(0, 0, myCanvas.width, myCanvas.height);
				context.drawImage(images[counter], 0, 0, 529, 298);
				counter++;
				if (counter==images.length) {counter=0;}
			}

			window.onload = draw;
			
			
			//finish canvas!//