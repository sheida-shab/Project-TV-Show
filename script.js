//You can edit ALL of the code here
const searchBar = document.createElement("input");
searchBar.placeholder = "Find an episode";
document.body.insertBefore(searchBar, document.body.firstChild);

const episodeCountDisplay = document.createElement("p");
document.body.insertBefore(episodeCountDisplay, searchBar.nextSibling);



function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);


  searchBar.addEventListener("input", function () {
    const searchTerm = searchBar.value.toLowerCase();
    const matchingEpisodes = allEpisodes.filter((episode) => {
      const name = episode.name.toLowerCase();
      const summary = episode.summary.toLowerCase();
      return name.includes(searchTerm) || summary.includes(searchTerm);
    });

    episodeCountDisplay.textContent = `Displaying ${matchingEpisodes.length}/${allEpisodes.length} episodes.`;

    makePageForEpisodes(matchingEpisodes);
  });
  
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "";
  
  
  //rootElem.textContent = "Popular TV Shows";
  episodeList.forEach((episode) => {
    
    //create episode card
    const episodeCard = document.createElement("div");
    episodeCard.classList.add("episode-Card");
    
    //create show season and episode number
    const seasonNumber = "S" + String(episode.season).padStart(2, "0");
    const episodeNumber = "E" + String(episode.number).padStart(2, "0");
      
    //create show title
    const episodeTitle = document.createElement("h2");
    episodeTitle.textContent = `${episode.name} - ${seasonNumber}${episodeNumber}`;
    episodeCard.appendChild(episodeTitle);
    episodeTitle.classList.add("show-Title");
    
    //create show image
    const episodeImage = document.createElement("img");
    episodeImage.src = episode.image.medium;
    episodeImage.alt = "TV Show Image";
    episodeCard.appendChild(episodeImage);
    episodeImage.classList.add("show-Image");

    //create show summary
    const episodeSummary = document.createElement("div");
    episodeSummary.innerHTML = `<strong>The summary is : </strong>${episode.summary}`;
    episodeCard.appendChild(episodeSummary);
    episodeSummary.classList.add("show-Summary");
    
    //create show original link
    const episodeLink = document.createElement("a");
    episodeLink.textContent = `for mre information visit "tvmaze.com"`;
    episodeLink.target = "_blank";
    episodeLink.href = episode.url;
    episodeLink.classList.add("show-Link");
    episodeCard.appendChild(episodeLink);

    rootElem.appendChild(episodeCard);
  });

}

window.onload = setup;
