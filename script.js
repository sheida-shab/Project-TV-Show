//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  
  rootElem.textContent = "Popular TV Shows";
  episodeList.forEach((episode) => {
    //create episode card
    const episodeCard = document.createElement("div");
    episodeCard.classList.add("episode-Card");
    //create show title
    const showTitle = document.createElement("h2");
    showTitle.textContent = `${episode.name}`;
    episodeCard.appendChild(showTitle);
    showTitle.classList.add("show-Title");
    //create show image
    const showImage = document.createElement("img");
    showImage.src = episode.image.medium;
    showImage.alt="TV Show Image"
    episodeCard.appendChild(showImage);
    showImage.classList.add("show-Image");
    //create show season and episode number
    const showSeasonEpisode = document.createElement("h3");
    const showSeasonNumber = "S" + String(episode.season).padStart(2, "0");
    const showEpisodeNumber =
      "E" + String(episode.number).padStart(2, "0");
    showSeasonEpisode.textContent = showSeasonNumber + showEpisodeNumber;
    episodeCard.appendChild(showSeasonEpisode);
    showSeasonEpisode.classList.add("show-Season-Episode");
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
  
}

window.onload = setup;
