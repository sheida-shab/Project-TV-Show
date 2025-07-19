//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  const firstEpisode = episodeList[0];
  rootElem.textContent = "Popular TV Shows";
  //create show title
  const showTitle = document.createElement("h2");
  showTitle.textContent = `${firstEpisode.name}`;
  rootElem.appendChild(showTitle);
  //create show image
  const showImage = document.createElement("img");
  showImage.src = firstEpisode.image.medium;
  rootElem.appendChild(showImage);
  //create show season and episode number
  const showSeasonEpisode = document.createElement("h3");
  console.log(String(firstEpisode.season).padStart(2, "0"));
  const showSeasonNumber = "S" + String(firstEpisode.season).padStart(2, "0");
  const showEpisodeNumber = "E" + String(firstEpisode.number).padStart(2, "0");
  showSeasonEpisode.textContent = showEpisodeNumber + showSeasonNumber;
  rootElem.appendChild(showSeasonEpisode);
  //create show summary
  const showSummary = document.createElement("div");
  showSummary.innerHTML = firstEpisode.summary;
  rootElem.appendChild(showSummary);
  //create show original link
  const showLink = document.createElement("a");
  showLink.textContent = "for mre information visit :";
  showLink.target = "_blank";
  showLink.href = firstEpisode.url;
  console.log(showLink.textContent);
  rootElem.appendChild(showLink);

  console.log(episodeList);
}

window.onload = setup;
