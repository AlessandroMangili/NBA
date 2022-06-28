const link = document.getElementById("style");
const toggle = document.getElementById("darkmode");

if(localStorage.getItem("click") == null) {
	localStorage.setItem("click", "off");
	link.setAttribute("media", "(prefers-color-scheme: light)");
} else {
	toggle.checked = localStorage.getItem("click") == "off" ? false : true;
	link.setAttribute("media", !toggle.checked ? "(prefers-color-scheme: light)" : "(prefers-color-scheme: dark)");
	if(window.location.href.split("/").pop() == "table")
		document.getElementById("mj-img").src = !toggle.checked ? "../images/mj.jpg" : "../images/mjDark.jpg";
}

toggle.addEventListener("click", () => {
	link.setAttribute("media", !toggle.checked ? "(prefers-color-scheme: light)" : "(prefers-color-scheme: dark)");
	if(window.location.href.split("/").pop() == "table")
	document.getElementById("mj-img").src = !toggle.checked ? "../images/mj.jpg" : "../images/mjDark.jpg";
	localStorage.setItem("click", localStorage.getItem("click") == "off" ? "on" : "off");
});