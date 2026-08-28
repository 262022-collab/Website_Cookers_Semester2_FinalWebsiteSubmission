class Movie {
    constructor(_title, _overview, _releaseDate, _image) {
        this.title = _title;
        this.overview = _overview;
        this.releaseDate = _releaseDate;
        this.image = _image;
    }
}

!async function () {
    const url = 'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1';
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjN2JhZTIwZjJiYWQ4OTFiODk0YTc5ZjU3YjQwYWY3MyIsIm5iZiI6MTc4NzczNDc4OS45NzQwMDAyLCJzdWIiOiI2YThlYWIwNTY3ZDVlZTMyYmNiNGY1MTAiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.puYjgDGBYFueOCi84hXL0WF7k6X7BYO56f4f6rekRWw'
        }
    };

    let data = await fetch(url, options)
        .then((response) => response.json())
        .then((result) => { return result })
        .catch((error) => console.log(error));

    console.log(data);
    console.log(data.results[4].title); //should return me toy story 5 as a test

          /*  let title=data.results[0].title;
            let overview=data.results[0].overview;
            let releaseDate=data.results[0].release_date;
            let image = "https://image.tmdb.org/t/p/w200" + data.results[0].poster_path;

            let newMovie=new Movie(title, overview, releaseDate, image);

            document.getElementById('title').innerHTML=newMovie.title
            document.getElementById('content').innerHTML=newMovie.overview+"<br>"+newMovie.releaseDate+"<br>"+"<img src='"+newMovie.image+"'>";
*/


 //1st film from api data (Has come from array index 0)           
let title1 = data.results[0].title;
let overview1 = data.results[0].overview;
let releaseDate1 = data.results[0].release_date;
let image1 = "https://image.tmdb.org/t/p/w200" + data.results[0].poster_path;

let movie1 = new Movie(title1, overview1, releaseDate1, image1);

//2nd film from api data (Has come from array index 1)
let title2 = data.results[1].title;
let overview2 = data.results[1].overview;
let releaseDate2 = data.results[1].release_date;
let image2 = "https://image.tmdb.org/t/p/w200" + data.results[1].poster_path;

let movie2 = new Movie(title2, overview2, releaseDate2, image2);

//3rd film from api data (Has come from array index 2)
let title3 = data.results[2].title;
let overview3 = data.results[2].overview;
let releaseDate3 = data.results[2].release_date;
let image3 = "https://image.tmdb.org/t/p/w200" + data.results[2].poster_path;

let movie3 = new Movie(title3, overview3, releaseDate3, image3);


//Here I have neatly formatted the HTML to display the three movie cards side by side in a flex container. Each card contains the movie title, image, overview, and release date.

document.getElementById('movie-container').innerHTML = `
  <div class="movie-card">
    <h2>${movie1.title}</h2>
    <img src="${movie1.image}">
    <p>${movie1.overview}</p>
    <p class="rd">${movie1.releaseDate}</p>
    
  </div>
  <div class="movie-card">
    <h2 class="mt">${movie2.title}</h2>
    <img src="${movie2.image}">
    <p>${movie2.overview}</p>
    <p class="rd">${movie2.releaseDate}</p>
    
  </div>
  <div class="movie-card">
    <h2 class="mt">${movie3.title}</h2>
    <img src="${movie3.image}">
    <p>${movie3.overview}</p>
    <p class="rd">${movie3.releaseDate}</p>
    
  </div>
`;
    
}();

