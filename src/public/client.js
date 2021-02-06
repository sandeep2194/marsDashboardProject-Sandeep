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

const updateStore = (store, newState) => {
    store = Object.assign(store, newState)
    render(root, store)
}

const render = async (root, state) => {
    if(store.selectedPage == 'home'){
        root.innerHTML = App()
    } else if(store.selectedPage == 'curiosity' || store.selectedPage == 'spirit' || store.selectedPage == 'opportunity'){
        root.innerHTML = appGal();
    }
    
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


// create content
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
window.addEventListener('load', () => {
    getRovers();
})

function roverClick(roverName) {
    store.selectedPage = roverName,
    getRoverImagesApiData(roverName)
}

const getRoverImagesApiData = (rover) => {
    fetch(`http://localhost:3000/${rover}`)
    .then(res => res.json())
    .then(data => {
        updateStore(store,data)
    })
}

const getRovers = () => {
    fetch(`http://localhost:3000/rovers`)
    .then(res => res.json())
    .then(data => {
        updateStore(store,data);
    })
}
let genrateRovers = (rovers,imgs) => {
    let i;
    let html = '';
    for(i=0; i<rovers.length; i++) {
     html += GenrateRoverTile(rovers[i],imgs[i])
    }   
    return html
}
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
const generateGallery = (Images)=>{
    let i;
    let html = "";
    for(i=0; i<Images.length; i++) {
        html += genrateGalleryImg(Images[i].img_src)
       }   
       return html
}
const genrateGalleryImg = (img)=>{
    return `<div class="responsive">
    <div class="gallery">
      <a target="_blank" href="${img}">
        <img src="${img}" width="600" height="400">
      </a>
    </div>
  </div>`
}
