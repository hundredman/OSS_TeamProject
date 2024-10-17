const clearBtn = document.querySelector(".clear-btn");
const searchBar = document.querySelector(".search-bar");

searchBar.addEventListener("keyup", function() {
    if(searchBar.value && clearBtn.style.visibility != "visible"){
        clearBtn.style.visibility = "visible"
    } else if(!searchBar.value) {
        clearBtn.style.visibility = "hidden"
    }
});

clearBtn.addEventListener("click", function() {
    searchBar.value = "";
    clearBtn.style.visibility = "hidden";
});