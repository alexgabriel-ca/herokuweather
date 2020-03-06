fetch("http://localhost:3000/weather?address=180%20Jardin%20Drive%20Vaughan").then((response) => {
	response.json().then((data) => {
		if (data.error) {
			console.log(data.error);
		} else {
			console.log(data);
		}
	});
});