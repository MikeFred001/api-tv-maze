"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");

const tvMazeSearchUrl = "http://api.tvmaze.com/search/shows";
const tvMazeEpisodesUrl = "http://api.tvmaze.com/shows";
const tvMazeLogoImg = "https://pbs.twimg.com/media/EIOH05vWoAA0yr2.jpg";


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  let response = await axios.get(tvMazeSearchUrl, {params: {q: term}});
  let showsData = response.data;
  console.log("showsData", showsData);

  // showsData.map(function(tvShow){
  //   console.log(tvShow);
  //   return {
  //     id: tvShow.show.id,
  //     name: tvShow.show.name,
  //     summary: tvShow.show.summary,
  //     image: tvShow.show.image ? tvShow.show.image.original : tvMazeLogoImg
  //   }
  // })
  // Revisiting this refactor later

  let showsArr = [];

  for (let i = 0; i < showsData.length; i++) {
    let id = showsData[i].show.id;
    let name = showsData[i].show.name;
    let summary = showsData[i].show.summary || "";
    let image = showsData[i].show.image ?
      showsData[i].show.image.original : tvMazeLogoImg;

    showsArr.push({id, name, summary, image});
  }

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
              alt="Bletchly Circle San Francisco"
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
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

$searchForm.on("submit", async function handleSearchForm (evt) {
  evt.preventDefault();
  await searchShowsAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

// async function getEpisodesOfShow(id) { }

/** Write a clear docstring for this function... */

// function displayEpisodes(episodes) { }

// add other functions that will be useful / match our structure & design


// {
//   id: 1767,
//   name: "The Bletchley Circle",
//   summary:
//     `<p><b>The Bletchley Circle</b> follows the journey of four ordinary
//        women with extraordinary skills that helped to end World War II.</p>
//      <p>Set in 1952, Susan, Millie, Lucy and Jean have returned to their
//        normal lives, modestly setting aside the part they played in
//        producing crucial intelligence, which helped the Allies to victory
//        and shortened the war. When Susan discovers a hidden code behind an
//        unsolved murder she is met by skepticism from the police. She
//        quickly realises she can only begin to crack the murders and bring
//        the culprit to justice with her former friends.</p>`,
//   image:
//       "http://static.tvmaze.com/uploads/images/medium_portrait/147/369403.jpg"
// }