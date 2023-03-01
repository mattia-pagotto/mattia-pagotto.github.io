import * as params from "@params";

let fuse; // holds our search engine
const box = document.getElementById("searchbox");
let resList = document.getElementById("searchResults");
let sInput = document.getElementById("searchInput");

// "Viewmore Button" variables
const viewMoreBtn = document.getElementById("view-more-btn-search");
const viewMoreBtnNum = document.getElementById("view-more-btn-num");

let first,
	last,
	current_elem = null;
let resultsAvailable = false;
const showLimit = 10;

// load our search index
window.onload = function () {
	let xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4) {
			if (xhr.status === 200) {
				let data = JSON.parse(xhr.responseText);

				if (data) {
					// fuse.js options; check fuse.js website for details
					let options = {
						distance: 100,
						threshold: 0.4,
						ignoreLocation: true,
						keys: ["title", "permalink", "summary", "content"],
					};

					if (params.fuseOpts) {
						options = {
							isCaseSensitive: params.fuseOpts.iscasesensitive ?? false,
							includeScore: params.fuseOpts.includescore ?? false,
							includeMatches: params.fuseOpts.includematches ?? false,
							minMatchCharLength:
								params.fuseOpts.minmatchcharlength ?? 1,
							shouldSort: params.fuseOpts.shouldsort ?? true,
							findAllMatches: params.fuseOpts.findallmatches ?? false,
							keys: params.fuseOpts.keys ?? [
								"title",
								"permalink",
								"summary",
								"content",
							],
							location: params.fuseOpts.location ?? 0,
							threshold: params.fuseOpts.threshold ?? 0.4,
							distance: params.fuseOpts.distance ?? 100,
							ignoreLocation: params.fuseOpts.ignorelocation ?? true,
						};
					}
					fuse = new Fuse(data, options); // build the index from the json file
				}
			} else {
				console.log(xhr.responseText);
			}
		}
	};
	xhr.open("GET", "../index.json");
	xhr.send();
};

function activeToggle(ae) {
	document.querySelectorAll(".focus").forEach(function (element) {
		// rm focus class
		element.classList.remove("focus");
	});
	if (ae) {
		ae.focus();
		document.activeElement = current_elem = ae;
		ae.parentElement.classList.add("focus");
	} else {
		document.activeElement.parentElement.classList.add("focus");
	}
}

function reset() {
	resultsAvailable = false;
	resList.innerHTML = sInput.value = ""; // clear inputbox and searchResults
	sInput.focus(); // shift focus to input box
}

/*
	Funzione che stampa aggiunge al DOM i risultati della ricerca rilasciati da Fuse.js.
	Gestisce anche la possibilità di visualizzare solo una parte di questi risultati tramite la variabile "showLimit"
*/
const loadEntries = (searchResult, startIndex, showLimit) => {
	if (searchResult.length <= startIndex) {
		resultsAvailable = false;
		resList.innerHTML = "";
	}

	let entriesHtml = "",
		lastIndex = startIndex + showLimit;

	for (let i = startIndex; i < lastIndex && i < searchResult.length; i += 1) {
		const { item } = searchResult[i];
		const date = new Date(item.date);

		entriesHtml +=
			`<li class="post-entry">
            <header class="entry-header"><h2>${item.title}&nbsp;»</h2></header>
            <footer class="entry-footer">
					<span> pubblicato il ${
						("0" + date.getDate()).slice(-2) +
						"/" +
						("0" + (date.getMonth() + 1)).slice(-2) +
						"/" +
						date.getFullYear()
					}</span></footer>` +
			`<a href="${item.permalink}" aria-label="${item.title}"></a></li>`;
	}

	if (startIndex == 0) {
		resList.innerHTML = entriesHtml;
	} else {
		resList.innerHTML += entriesHtml;
	}

	resultsAvailable = true;
	first = resList.firstChild;
	last = resList.lastChild;

	if (searchResult.length > lastIndex) {
		viewMoreBtn.classList.add("show");
		viewMoreBtnNum.textContent = searchResult.length - lastIndex;

		viewMoreBtn.onclick = () =>
			loadEntries(searchResult, lastIndex, showLimit);
	} else {
		viewMoreBtn.classList.remove("show");
	}
};

// execute search as each character is typed
sInput.onkeyup = function (e) {
	// run a search query (for "term") every time a letter is typed
	// in the search box
	if (fuse) {
		const results = fuse.search(this.value.trim()); // the actual query being run using fuse.js
		loadEntries(results, 0, showLimit); // our results bucket
	}
};

sInput.addEventListener("search", function (e) {
	// clicked on x
	if (!this.value) reset();
});

// kb bindings
document.onkeydown = function (e) {
	let key = e.key;
	let ae = document.activeElement;

	let inbox = document.getElementById("searchbox").contains(ae);

	if (ae === sInput) {
		let elements = document.getElementsByClassName("focus");
		while (elements.length > 0) {
			elements[0].classList.remove("focus");
		}
	} else if (current_elem) ae = current_elem;

	if (key === "Escape") {
		reset();
	} else if (!resultsAvailable || !inbox) {
		return;
	} else if (key === "ArrowDown") {
		e.preventDefault();
		if (ae == sInput) {
			// if the currently focused element is the search input, focus the <a> of first <li>
			activeToggle(resList.firstChild.lastChild);
		} else if (ae.parentElement != last) {
			// if the currently focused element's parent is last, do nothing
			// otherwise select the next search result
			activeToggle(ae.parentElement.nextSibling.lastChild);
		}
	} else if (key === "ArrowUp") {
		e.preventDefault();
		if (ae.parentElement == first) {
			// if the currently focused element is first item, go to input box
			activeToggle(sInput);
		} else if (ae != sInput) {
			// if the currently focused element is input box, do nothing
			// otherwise select the previous search result
			activeToggle(ae.parentElement.previousSibling.lastChild);
		}
	} else if (key === "ArrowRight") {
		ae.click(); // click on active link
	}
};
