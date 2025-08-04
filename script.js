//You can edit ALL of the code here

const episodesCache = {};
let allEpisodes = [];


async function setup() {

  const episodeSelector = document.getElementById("selectEpisode");

  //Add Select Items for shows
  const showSelector = document.createElement("select");
  showSelector.id = "selectShow";
  const searchItemsContainer = document.getElementById("searchItems");
  searchItemsContainer.insertBefore(showSelector, document.getElementById("selectEpisode"));


  //Display a message while loading Data
  const loadingMessage = document.getElementById("loadingMessage");
  loadingMessage.textContent = "Please Wait! Loading Data .............";
  loadingMessage.style.display = "block";
  
  try {
    //Fetch shows and episodes Data
    const [showResponse, episodesResponse] = await Promise.all([
      fetch("https://api.tvmaze.com/shows"),
      fetch("https://api.tvmaze.com/shows/82/episodes"),
    ]);

    /*simulate an error to test Displaying Error Message
    const response = await fetch*/

    const allShows = await showResponse.json();

    allShows.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

    function populateShowDropdown(showList) {
      showSelector.innerHTML = "";
      const defaultOption = document.createElement("option");
      defaultOption.textContent = "Select a Show";
      defaultOption.value = "";
      showSelector.appendChild(defaultOption);

      showList.forEach((show) => {
        const option = document.createElement("option");
        option.value = show.id;
        option.textContent = show.name;
        showSelector.appendChild(option);
      });
    }

    populateShowDropdown(allShows);

    const errorMessage = document.getElementById("errorMessage");

    showSelector.addEventListener("change", async (event) => {
      const selectedShowId = event.target.value;
      if (!selectedShowId) return;

      loadingMessage.textContent = "Loading episodes for selected show...";
      loadingMessage.style.display = "block";
      errorMessage.style.display = "none";

      if (episodesCache[selectedShowId]) {
        allEpisodes = episodesCache[selectedShowId];
        displayEpisodes(allEpisodes);
        populateEpisodeDropdown(allEpisodes);
        loadingMessage.style.display = "none";
        return; 
      }

      try {
        const res = await fetch(`https://api.tvmaze.com/shows/${selectedShowId}/episodes`);
        if (!res.ok) throw new Error();

        allEpisodes = await res.json();
        episodesCache[selectedShowId] = allEpisodes;

        displayEpisodes(allEpisodes);
        populateEpisodeDropdown(allEpisodes);
      } catch (error) {
        errorMessage.textContent = "Could not load episodes for this show.";
        errorMessage.style.display = "block";
      }

      loadingMessage.style.display = "none";
    });


    allEpisodes = await episodesResponse.json();

    displayEpisodes(allEpisodes);
  } catch (error) {
    const errorMessage = document.getElementById("errorMessage");
    errorMessage.textContent = "An error occurred while fetching data!!!Please Try Again. ";
    errorMessage.style.display = "block";
  }

  //clear Loading Message
  loadingMessage.style.display = "none";
  if (allEpisodes.length === 0) {
    // No data available — exit setup
    return;
  }

  populateEpisodeDropdown(allEpisodes);


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

  //live Search Filtering
  const searchBox = document.getElementById("searchInput");
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
  const resultCount = document.getElementById("resultCount");
  resultCount.textContent = `Showing ${episodeList.length} Episodes`;
}


function populateEpisodeDropdown(episodes) {
  const episodeSelector = document.getElementById("selectEpisode");
  episodeSelector.innerHTML = "";
  const allOptions = document.createElement("option");
  allOptions.textContent = "Show All Episodes";
  allOptions.value = "All";
  episodeSelector.appendChild(allOptions);

  episodes.forEach((episode) => {
    const episodeCode = formatEpisodeCode(episode.season, episode.number);
    const selectorDisplayText = `${episodeCode} - ${episode.name}`;
    const episodeOption = document.createElement("option");
    episodeOption.textContent = selectorDisplayText;
    episodeOption.value = episode.id;
    episodeSelector.appendChild(episodeOption);
  });
}




window.onload = setup;
