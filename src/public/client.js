let store = {
    rovers : ['curiosity','spirit','opportunity'],
    imgOfEachRover:[
        'https://cdn.mos.cms.futurecdn.net/NB3BaBuHQbrynUjYaP6oLf-1200-80.jpg',
        'https://media4.s-nbcnews.com/j/newscms/2020_29/2463761/180613-mars-rover-ew-102p_55e53c91addee3ec9204725bfe177a1c.fit-760w.jpg',
        'https://www.slashgear.com/wp-content/uploads/2012/12/curiosity-rover-580x3261.jpg'
    ],
    rover_details: {},
  	rover_images: {},
    selectedPage: 'home'
}

// add our markup to the page
const root = document.getElementById('root')

// update store i.e state of the app
const updateStore = (store, newState) => {
    store = Object.assign(store, newState)
    render(root, store)
}
// set content and add event listeners for 3 gallery buttons and its a higher order function that return another function
const render = async (root, state) => {
    if(store.selectedPage == 'home'){
        root.innerHTML = App()
    } else if(store.selectedPage == 'curiosity' || store.selectedPage == 'spirit' || store.selectedPage == 'opportunity'){
        root.innerHTML = appGal();
    }
    
    return setEvents();
    
}


function setEvents () {
    document.getElementById('curiosity').addEventListener('click', () => {
        roverClick('curiosity');
    })
    document.getElementById('spirit').addEventListener('click', () => {
        roverClick('spirit');
    })
    document.getElementById('opportunity').addEventListener('click', () => {
        roverClick('opportunity');
    })
}
// create app html without gallery showing
const App = () => {
    return `
        <main>
            <section>
            <div class="row">
                ${genrateRovers(store.rover_details,store.imgOfEachRover)}
          </div>
            </section>
        </main>
        <footer></footer>
    `
}

// create gallery html
const appGal = () => {
    return `
    <main>
    <section>
            <div class="row">
                ${genrateRovers(store.rover_details,store.imgOfEachRover)}
          </div>
            </section>
        <section id="appGal">

        ${generateGallery(store.rover_images)}

        <div class="clearfix"></div>

        </section>
    </main>
    `
}
// when window loads get rovers information cards
window.addEventListener('load', () => {
    getRovers();
})

// when view gallery button is clicked && its a higher order function as it returns another function
function roverClick(roverName) {
    store.selectedPage = roverName;
    return getRoverImagesApiData(roverName);
}

// call backend for latest photos taken selected rover
const getRoverImagesApiData = (rover) => {
    fetch(`http://localhost:3000/${rover}`)
    .then(res => res.json())
    .then(data => {
        updateStore(store,data)
    })
}

// get deatils data of all rovers
const getRovers = () => {
    fetch(`http://localhost:3000/rovers`)
    .then(res => res.json())
    .then(data => {
        updateStore(store,data);
    })
}
// genrate all rover details cards html
let genrateRovers = (rovers,imgs) => {
    let i;
    let html = '';
    for(i=0; i<rovers.length; i++) {
     html += GenrateRoverTile(rovers[i],imgs[i])
    }   
    return html
}
// genrate single rover card html & this one is a pure function
const GenrateRoverTile = (rover,img) =>{
   return `<div class="column">
    <div class="card">
    <img src="${img}" alt="Avatar" class="avatar">
    <h3>${rover.name}</h3>
    <p>landing date : ${rover.landing_date}</p>
    <p>launch_date : ${rover.launch_date}</p>
    <p>status : ${rover.status}</p>
    <a href='#appGal' id='${rover.name.toLowerCase()}' class="button"'>View Gallery</a>
    </div>
  </div>`
};

// genrate image gallery html
const generateGallery = (Images)=>{
    let i;
    let html = "";
    for(i=0; i<Images.length; i++) {
        html += genrateGalleryImg(Images[i].img_src)
       }   
       return html
}

// genrate a single image html for image gallery && a pure function
const genrateGalleryImg = (img)=>{
    return `<div class="responsive">
    <div class="gallery">
      <a target="_blank" href="${img}">
        <img src="${img}" width="600" height="400">
      </a>
    </div>
  </div>`
}
