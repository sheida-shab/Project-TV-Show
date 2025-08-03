//You can edit ALL of the code here
let allEpisodes = [];
let resultCount;
const episodeCache = new Map();
let episodeSelector;
let showSelector;
let searchBox;
let loadingMessage;
let errorMessage;
async function setup() {
  resultCount = document.getElementById("resultCount");
   episodeSelector = document.getElementById("selectEpisode");
   showSelector = document.getElementById("selectShow");
   searchBox = document.getElementById("searchInput");
   errorMessage = document.getElementById("errorMessage");
  //Display a message while loading Data
  loadingMessage = document.getElementById("loadingMessage");
  loadingMessage.textContent = "Please Wait! Loading Data .............";
  loadingMessage.style.display = "block";
  
  try {
    //Fetch Data from API Instead of  Episodes.json file
    const response = await fetch("https://api.tvmaze.com/shows/82/episodes");

    /*simulate an error to test Displaying Error Message
    const response = await fetch("https://api.tvmaze.com/shows/82/epiiiiiiisodes");*/

    allEpisodes = await response.json();
     
    //insert in cache
      episodeCache.set("82", allEpisodes);

    displayEpisodes(allEpisodes);
  } catch (error) {
    
    errorMessage.textContent =
      "An error occurred while fetching data!!!Please Try Again. ";
    errorMessage.style.display = "block";
  }

  //clear Loading Message
  loadingMessage.style.display = "none";
  if (allEpisodes.length === 0) {
    // No data available — exit setup
    return;
  }

  //Add Episode Selector 
  
  episodeSelector.innerHTML = "";
  const allOptions = document.createElement("option");
  allOptions.textContent = "Show All Episodes";
  allOptions.value = "All";
  episodeSelector.insertBefore(allOptions, episodeSelector.firstChild);
  populateEpisodeSelector(allEpisodes);
  // allEpisodes.forEach((episode) => {
  //   const episodeCode = formatEpisodeCode(episode.season, episode.number);
  //   const selectorDisplayText = episodeCode + " - " + episode.name;
  //   const episodeOption = document.createElement("option");
  //   episodeOption.textContent = selectorDisplayText;
  //   episodeOption.value = episode.id;
  //   episodeSelector.appendChild(episodeOption);
  // });
  episodeSelector.addEventListener("change", (event) => {
    const selectedValue = event.target.value;
    if (selectedValue === "All") {
      displayEpisodes(allEpisodes);
    } else {
      const selectedEpisode = allEpisodes.find(
        (episode) => episode.id === Number(selectedValue)
      );

      if (selectedEpisode) {
        displayEpisodes([selectedEpisode]);
      }
    }
  });

  //Add Show Selector
  
  const showAllOptions=document.createElement("option");
  showAllOptions.textContent="All Shows";
  showAllOptions.value="All";
  showSelector.insertBefore(showAllOptions,showSelector.firstChild);
  const allShows = await fetchAllShows();
  allShows.sort((a, b) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  );
  populateShowSelector(allShows);
  
  showSelector.addEventListener("change", async (event) => {
    const showSelectedId = event.target.value;

    if (showSelectedId === "All") {
      allEpisodes = episodeCache.get("82");
      populateEpisodeSelector(allEpisodes);
      displayEpisodes(allEpisodes);
      searchBar.value = "";
      episodeCountDisplay.textContent = `Displaying ${allEpisodes.length}/${allEpisodes.length} episodes.`;
      return;
    }

    //search show episodes in cache
    if (episodeCache.has(showSelectedId)) {
      const cachedEpisode = episodeCache.get(showSelectedId);
      allEpisodes = cachedEpisode;
      populateEpisodeSelector(allEpisodes);
      displayEpisodes(allEpisodes);
      searchBar.value = "";
      resultCount.textContent = `Displaying ${allEpisodes.length}/${allEpisodes.length} episodes.`;
    } else {
      try {
        loadingMessage.textContent = "Loading episodes, please wait...";

        const response = await fetch(
          `https://api.tvmaze.com/shows/${showSelectedId}/episodes`
        );
        if (!response.ok) throw new Error("Network error");
        const data = await response.json();
        //save episodes in cache
        episodeCache.set(showSelectedId, data);
        allEpisodes = data;
        populateEpisodeSelector(allEpisodes);
        displayEpisodes(allEpisodes);
        searchBar.value = "";
        resultCount.textContent = `Displaying ${allEpisodes.length}/${allEpisodes.length} episodes.`;
        loadingMessage.textContent = "";
      } catch (error) {
        errorMessage.textContent =
          "Failed to load episodes. Please try again later.";
      }
    }
  });


  //live Search Filtering
  searchBox.addEventListener("input", function () {
    const searchItem = searchBox.value.toLowerCase();
    const filteredEpisodes = allEpisodes.filter((episode) => {
      const episodeName = episode.name.toLowerCase();
      const episodeSummaryText = episode.summary.toLowerCase();
      return (
        episodeName.includes(searchItem) ||
        episodeSummaryText.includes(searchItem)
      );
    });
    displayEpisodes(filteredEpisodes);
  });
}

//create show season and episode number
function formatEpisodeCode(season, number) {
  return (
    "S" +
    String(season).padStart(2, "0") +
    "E" +
    String(number).padStart(2, "0")
  );
}

function populateShowSelector(shows){
  shows.forEach((show) => {
    const option = document.createElement("option");
    option.value = show.id;
    option.textContent = show.name;
    showSelector.appendChild(option);
  });
}

function populateEpisodeSelector(Episodes) {
    Episodes.forEach((episode) => {
    const episodeCode = formatEpisodeCode(episode.season, episode.number);
    const selectorDisplayText = episodeCode + " - " + episode.name;
    const episodeOption = document.createElement("option");
    episodeOption.textContent = selectorDisplayText;
    episodeOption.value = episode.id;
    episodeSelector.appendChild(episodeOption);
  });
}


function displayEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "";
  //rootElem.textContent = "Popular TV Shows";
  episodeList.forEach((episode) => {
    //create episode card
    const episodeCard = document.createElement("div");
    episodeCard.classList.add("episode-Card");

    //create show title
    const showTitle = document.createElement("h2");
    showTitle.textContent = `${episode.name} - ${formatEpisodeCode(
      episode.season,
      episode.number
    )}`;
    episodeCard.appendChild(showTitle);
    showTitle.classList.add("show-Title");

    //create show image
    const showImage = document.createElement("img");
    showImage.src = episode.image.medium;
    showImage.alt = "TV Show Image";
    episodeCard.appendChild(showImage);
    showImage.classList.add("show-Image");

    //create show summary
    const showSummary = document.createElement("div");
    showSummary.innerHTML = `<strong>The summary is : </strong>${episode.summary}`;
    episodeCard.appendChild(showSummary);
    showSummary.classList.add("show-Summary");

    //create show original link
    const showLink = document.createElement("a");
    showLink.textContent = `for mre information visit "tvmaze.com"`;
    showLink.target = "_blank";
    showLink.href = episode.url;
    showLink.classList.add("show-Link");
    episodeCard.appendChild(showLink);
    rootElem.appendChild(episodeCard);
  });
  //Display Result Count
  //resultCount = document.getElementById("resultCount");
  resultCount.textContent = `Showing ${episodeList.length} Episodes`;
}
async function fetchAllShows() {
  let pageNumber = 0;
  let allShows = [];
  loadingMessage.textContent = "Loading list of shows...";
  try {
    while (pageNumber < 5) {
      const URL = `https://api.tvmaze.com/shows?page=${pageNumber}`;
      const response = await fetch(URL);
      if (response.status === 404) {
        break;
      } else {
        const data = await response.json();
        if (data.length === 0) {
          break;
        } else {
          allShows = allShows.concat(data);
          pageNumber++;
        }
      }
    }
    return allShows;
  } catch (error) {
    errorMessage.textContent = "Failed to load shows. Please refresh.";
    return [];
  }
}
window.onload = setup;
