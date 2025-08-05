//You can edit ALL of the code here
let allEpisodes = [];
const episodeCache = new Map();
let episodeSelector;
let showSelector;
let searchBox;
let loadingMessage;
let errorMessage;
async function setup() {
  
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
      searchBox.textContent=""
      episodeSelector.innerHTML = "";
      populateEpisodeSelector(allEpisodes);
      displayEpisodes(allEpisodes);
      searchBox.value = "";
      episodeCountDisplay.textContent = `Displaying ${allEpisodes.length}/${allEpisodes.length} episodes.`;
      return;
    }

    //search show episodes in cache
    if (episodeCache.has(showSelectedId)) {
      const cachedEpisode = episodeCache.get(showSelectedId);
      allEpisodes = cachedEpisode;
      episodeSelector.innerHTML = "";
      populateEpisodeSelector(allEpisodes);
      displayEpisodes(allEpisodes);
      searchBox.value = "";
      
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
        episodeSelector.innerHTML = "";
        populateEpisodeSelector(allEpisodes);
        displayEpisodes(allEpisodes);
        searchBox.value = "";
        
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

    //create episode title
    const episodeTitle = document.createElement("h2");
    episodeTitle.textContent = `${episode.name} - ${formatEpisodeCode(
      episode.season,
      episode.number
    )}`;
    episodeCard.appendChild(episodeTitle);
    episodeTitle.classList.add("episode-Title");

    //create episode image
    const episodeImage = document.createElement("img");
    episodeImage.src = episode.image.medium;
    episodeImage.alt = "TV Show Image";
    episodeCard.appendChild(episodeImage);
    episodeImage.classList.add("episode-Image");

    //create episode summary
    const episodeSummary = document.createElement("div");
    episodeSummary.innerHTML = `<strong>The summary is : </strong>${episode.summary}`;
    episodeCard.appendChild(episodeSummary);
    episodeSummary.classList.add("Episode-Summary");

    //create episode original link
    const episodeLink = document.createElement("a");
    episodeLink.textContent = `for mre information visit "tvmaze.com"`;
    episodeLink.target = "_blank";
    episodeLink.href = episode.url;
    episodeLink.classList.add("show-Link");
    episodeCard.appendChild(episodeLink);
    rootElem.appendChild(episodeCard);
  });
  //Display Result Count
  const resultCount = document.getElementById("resultCount");
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
function createShowPage(show){
  const showCard=document.createElement("div");
  showCard.classList.add("show-card");

  const showTitle=document.createElement("h2");
  showTitle.textContent=show.name;
  
  const showImage=document.createElement("img");
  showImage.src = show.image.medium;
  showImage.alt = `${show.name} Image`;

   const showSummary = document.createElement("div");
   showSummary.innerHTML = `<strong> Summary : </strong>${show.summary}`;
   showSummary.classList.add("Show-Summary");

   const showDetails=document.createElement("p");
   showDetails.innerHTML = `
   <strong>Genres : </strong> S{show.genres.join(", ")}<br/>
   <strong> Rated : </strong> ${show.rating}<br/>
   <strong> Status : </strong> ${show.status}<br/>
   <strong> Runtime : </strong> ${show.runtime} min
   `;

   showCard.appendChild(showTitle);
   showCard.appendChild(showImage);
   showCard.appendChild(showSummary);
   showCard.appendChild(showDetails);
   
}
window.onload = setup;
