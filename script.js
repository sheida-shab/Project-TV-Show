//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  
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
