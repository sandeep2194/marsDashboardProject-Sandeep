let store = Immutable.Map({
    rovers : ['curiosity','spirit','opportunity'],
    imgOfEachRover:[
        'https://cdn.mos.cms.futurecdn.net/NB3BaBuHQbrynUjYaP6oLf-1200-80.jpg',
        'https://media4.s-nbcnews.com/j/newscms/2020_29/2463761/180613-mars-rover-ew-102p_55e53c91addee3ec9204725bfe177a1c.fit-760w.jpg',
        'https://www.slashgear.com/wp-content/uploads/2012/12/curiosity-rover-580x3261.jpg'
    ],
    rover_details: {},
  	rover_images: {},
    selectedPage: 'home'
});

// add our markup to the page
const root = document.getElementById('root')
const view = document.getElementById('view')
// update store i.e state of the app
const updateStore = (state,newState) => {
    newstore = state.merge(newState);
    
    render(root, newstore)
}
// set content and add event listeners for 3 gallery buttons and its a higher order function that return another function
const render = async (root, state) => {
    if(state.get('selectedPage') == 'home'){
        
        root.innerHTML = App(state)
    } else if(state.get('selectedPage') == 'curiosity' || state.get('selectedPage') == 'spirit' || state.get('selectedPage') == 'opportunity'){
        
        view.innerHTML = appGal(state);
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
const App = (state) => {
    
    return `
            <section>
            <div class="row">
                ${genrateRovers(state.get('rover_details'),state.get('imgOfEachRover'))}
          </div>
            </section>
    `
}

// create gallery html
const appGal = (state) => {
    
    return `
        <section id="appGal">

        ${generateGallery(state.get('rover_images'))}

        <div class="clearfix"></div>

        </section>
    `
}
// when window loads get rovers information cards
window.addEventListener('load', () => {
    getRovers(store);
})

// when view gallery button is clicked && its a higher order function as it returns another function
function roverClick(roverName) {
    
    const selectedState = store.update((store) => {
        return store.set('selectedPage', roverName)
    })
    return getRoverImagesApiData(roverName,selectedState);
}

// call backend for latest photos taken selected rover
const getRoverImagesApiData = (rover,state) => {
    fetch(`http://localhost:3000/${rover}`)
    .then(res => res.json())
    .then(data => {
        
        updateStore(state,data)
    })
}

// get deatils data of all rovers
const getRovers = (state) => {
    fetch(`http://localhost:3000/rovers`)
    .then(res => res.json())
    .then(data => {
        updateStore(state,data);
    })
}
// genrate all rover details cards html
let genrateRovers = (rovers,imgs) => {
    let i;
    let html = '';
    
    for(i=0; i<rovers.size; i++) {
        
     html += GenrateRoverTile(rovers.get(i),imgs.pop())
    }   
    return html
}
// genrate single rover card html & this one is a pure function
const GenrateRoverTile = (rover,img) =>{
    
   return `<div class="column">
    <div class="card">
    <img src="${img}" alt="Avatar" class="avatar">
    <h3>${rover.get('name')}</h3>
    <p>landing date : ${rover.get('landing_date')}</p>
    <p>launch_date : ${rover.get('launch_date')}</p>
    <p>status : ${rover.get('status')}</p>
    <a href='#appGal' id='${rover.get('name').toLowerCase()}' class="button"'>View Gallery</a>
    </div>
  </div>`
};

// genrate image gallery html
const generateGallery = (Images)=>{
    let i;
    let html = "";
    
    for(i=0; i<Images.size; i++) {
        
        html += genrateGalleryImg(Images.get(i).get('img_src'))
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
