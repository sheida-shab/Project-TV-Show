//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  const firstEpisode = episodeList[0];
  rootElem.textContent = "Popular TV Shows";
  //create episode card
  const episodeCard=document.createElement("div");

  //create show title
  const showTitle = document.createElement("h2");
  showTitle.textContent = `${firstEpisode.name}`;
  episodeCard.appendChild(showTitle);
  //create show image
  const showImage = document.createElement("img");
  showImage.src = firstEpisode.image.medium;
  episodeCard.appendChild(showImage);
  //create show season and episode number
  const showSeasonEpisode = document.createElement("h3");
  console.log(String(firstEpisode.season).padStart(2, "0"));
  const showSeasonNumber = "S" + String(firstEpisode.season).padStart(2, "0");
  const showEpisodeNumber = "E" + String(firstEpisode.number).padStart(2, "0");
  showSeasonEpisode.textContent = showEpisodeNumber + showSeasonNumber;
  episodeCard.appendChild(showSeasonEpisode);
  //create show summary
  const showSummary = document.createElement("div");
  showSummary.innerHTML = `<strong>The summary is : </strong>${firstEpisode.summary}`;
  episodeCard.appendChild(showSummary);
  //create show original link
  const showLink = document.createElement("a");
  showLink.textContent = `for mre information visit "tvmaze.com"`;
  showLink.target = "_blank";
  showLink.href = firstEpisode.url;
  console.log(showLink.textContent);
  episodeCard.appendChild(showLink);
  rootElem.appendChild(episodeCard);
  console.log(episodeList);
}

window.onload = setup;
