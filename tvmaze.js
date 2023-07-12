"use strict";

const $showsList = $("#showsList");
const $episodesList = $("#episodesList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");

const TV_MAZE_SEARCH_URL = "http://api.tvmaze.com/search/shows";
const TV_MAZE_EPISODES_URL = "http://api.tvmaze.com/shows";
const TV_MAZE_LOGO_IMG = "https://pbs.twimg.com/media/EIOH05vWoAA0yr2.jpg";


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  let response = await axios.get(TV_MAZE_SEARCH_URL, { params: { q: term } });
  let showsData = response.data;
  console.log("showsData", showsData);

  const showsArr = showsData.map(function (tvShow) {
    return {
      id: tvShow.show.id,
      name: tvShow.show.name,
      summary: tvShow.show.summary || "",
      image: tvShow.show.image ? tvShow.show.image.original : TV_MAZE_LOGO_IMG
    };
  });

  return showsArr;
}

/** Given list of shows, create markup for each and append to DOM.
 *
 * A show is {id, name, summary, image}
 * */

function displayShows(shows) {
  $showsList.empty();

  for (const show of shows) {
    const $show = $(`
        <div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src=${show.image}
              alt="${show.name} Thumbnail"
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes" id=${show.id}>
               Episodes
             </button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($show);
  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchShowsAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  displayShows(shows);
}

$searchForm.on("submit", async function handleSearchForm(evt) {
  evt.preventDefault();
  await searchShowsAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */
async function getEpisodesOfShow(id) {
  let response = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
  let episodesData = response.data;
  console.log("episodes consolelog", episodesData);

  const episodesArr = episodesData.map(function (episode) {
    console.log(episode);
    return {
      id: episode.id,
      name: episode.name,
      season: episode.season,
      number: episode.number,
      rating: episode.rating,
      summary: episode.summary
    };
  });

  return episodesArr;
}


/** Appends episode list to the DOM.
 *  Empties episode area beforehand if needed.
 */
function displayEpisodes(episodes) {
  $episodesList.empty();

  for (const episode of episodes) {
    const $episode = $(`
        <li>
        Name: ${episode.name},
        Season: ${episode.season},
        Episode: ${episode.number}
        </li>
      `);

    $episodesList.append($episode);
  }
}


/** Retrieves episode information from the tvMaze API and displays it on the
 * page.
 */
async function retrieveAndDisplayEpisodes(showId) {
  const episodes = await getEpisodesOfShow(showId);

  $episodesArea.show();
  displayEpisodes(episodes);
}


/** Handles click event for the Show-Episodes button. */
$showsList.on("click", ".Show-getEpisodes", async function handleEpisodesButton(evt) {
  console.log("clicked!");
  await retrieveAndDisplayEpisodes(evt.target.id);
});


// add other functions that will be useful / match our structure & design