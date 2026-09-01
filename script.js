// array to hold all students
var students = [];

// load saved data if there is any (bonus part)
if (localStorage.getItem("students")) {
	try {
		students = JSON.parse(localStorage.getItem("students"));
	} catch(e) {
		students = [];
	}
}

// runs when page loads
displayStudents();

function addStudent() {

	var errorBox = document.getElementById("errorMsg");
	errorBox.innerHTML = "";

	try {
		var name = document.getElementById("name").value.trim();
		var math = document.getElementById("math").value;
		var science = document.getElementById("science").value;
		var english = document.getElementById("english").value;
		var history = document.getElementById("history").value;

		// basic validation
		if (name == "") {
			throw "Name cannot be empty!";
		}

		if (math === "" || science === "" || english === "" || history === "") {
			throw "Please fill in all the score fields.";
		}

		math = Number(math);
		science = Number(science);
		english = Number(english);
		history = Number(history);

		// check they are numbers 0-100
		var allScores = [math, science, english, history];
		for (var i = 0; i < allScores.length; i++) {
			if (isNaN(allScores[i]) || allScores[i] < 0 || allScores[i] > 100) {
				throw "Scores must be numbers between 0 and 100.";
			}
		}

		var total = math + science + english + history;
		var avg = total / 4;
		var grade = getGrade(avg);

		var newStudent = {
			name: name,
			math: math,
			science: science,
			english: english,
			history: history,
			total: total,
			average: avg,
			grade: grade
		};

		students.push(newStudent);

		saveData();
		displayStudents();

		// clear form
		document.getElementById("name").value = "";
		document.getElementById("math").value = "";
		document.getElementById("science").value = "";
		document.getElementById("english").value = "";
		document.getElementById("history").value = "";

	} catch (err) {
		errorBox.innerHTML = err;
	}
}

function getGrade(avg) {
	if (avg >= 90) {
		return "A";
	} else if (avg >= 80) {
		return "B";
	} else if (avg >= 70) {
		return "C";
	} else if (avg >= 60) {
		return "D";
	} else {
		return "F";
	}
}

function deleteStudent(index) {
	students.splice(index, 1);
	saveData();
	displayStudents();
}

function displayStudents() {

	var tbody = document.getElementById("tableBody");
	tbody.innerHTML = "";

	var filterGrade = document.getElementById("filterGrade").value;
	var filterAvg = Number(document.getElementById("filterAvg").value);

	// filter using filter()
	var filteredStudents = students.filter(function(s) {
		var gradeMatch = (filterGrade == "all" || s.grade == filterGrade);
		var avgMatch = (s.average >= filterAvg);
		return gradeMatch && avgMatch;
	});

	// map() to build rows
	filteredStudents.map(function(s) {
		var realIndex = students.indexOf(s); // need this for delete button
		var row = document.createElement("tr");
		row.innerHTML = "<td>" + s.name + "</td>" +
			"<td>" + s.math + "</td>" +
			"<td>" + s.science + "</td>" +
			"<td>" + s.english + "</td>" +
			"<td>" + s.history + "</td>" +
			"<td>" + s.total + "</td>" +
			"<td>" + s.average.toFixed(2) + "</td>" +
			"<td>" + s.grade + "</td>" +
			"<td><button class='deletebtn' onclick='deleteStudent(" + realIndex + ")'>X</button></td>";
		tbody.appendChild(row);
		return row;
	});

	updateSummary();
}

function updateSummary() {

	document.getElementById("totalStudents").innerHTML = "Total Students: " + students.length;

	if (students.length == 0) {
		document.getElementById("classAvg").innerHTML = "Class Average: 0";
		document.getElementById("highScore").innerHTML = "Highest Score: 0";
		document.getElementById("lowScore").innerHTML = "Lowest Score: 0";
		return;
	}

	// reduce() to get class average
	var sumOfAverages = students.reduce(function(acc, s) {
		return acc + s.average;
	}, 0);
	var classAverage = sumOfAverages / students.length;

	// reduce() to find highest total score
	var highest = students.reduce(function(a, b) {
		return a.total > b.total ? a : b;
	});

	// reduce() to find lowest total score
	var lowest = students.reduce(function(a, b) {
		return a.total < b.total ? a : b;
	});

	document.getElementById("classAvg").innerHTML = "Class Average: " + classAverage.toFixed(2);
	document.getElementById("highScore").innerHTML = "Highest Score: " + highest.total + " (" + highest.name + ")";
	document.getElementById("lowScore").innerHTML = "Lowest Score: " + lowest.total + " (" + lowest.name + ")";
}

function saveData() {
	// save to localStorage so data doesnt disappear on refresh
	localStorage.setItem("students", JSON.stringify(students));
}

function exportJSON() {
	try {
		var dataStr = JSON.stringify(students, null, 2);
		var blob = new Blob([dataStr], {type: "application/json"});
		var url = URL.createObjectURL(blob);

		var link = document.createElement("a");
		link.href = url;
		link.download = "students.json";
		link.click();

	} catch (err) {
		alert("Something went wrong while exporting: " + err);
	}
}

// example of using find() - not really used in UI but required by project
function findStudentByName(name) {
	return students.find(function(s) {
		return s.name == name;
	});
}
