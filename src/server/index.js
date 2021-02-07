require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const path = require('path')

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, '../public')))



 async function fetchRoverJSON(rover) {
  try {
     let response = await fetch('https://api.nasa.gov/mars-photos/api/v1/rovers/'+rover+'?api_key='+process.env.API_KEY);
  let roverdata = await response.json();
  return roverdata;
  }
  catch(e) {
    console.log('Catch an error: ', e)
  }
}

async function buildRoverinfoObject(){
  const rovers = ['curiosity','spirit','opportunity'];
  let rovers_info = [];
  
  for(const rover of rovers){ 
	 const Arover = await fetchRoverJSON(rover);
  	 rovers_info.push({
      		name: Arover.rover.name,
        	landing_date: Arover.rover.landing_date,
        	launch_date: Arover.rover.launch_date,
        	status: Arover.rover.status,
      });
  }
  
  return rovers_info;
}


app.get('/rovers', async (req, res) => {

		const rovers_info = await buildRoverinfoObject();
    res.send({rover_details: rovers_info});

}); 

const rovers = ['curiosity','spirit','opportunity']
const roversData = ()=>{rovers.forEach((rover)=> {
    app.get(`/${rover}`, async (req,res) => {
        try {
            const roverApi = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/latest_photos?api_key=${process.env.API_KEY}`
            const rover_images = await fetch(roverApi)
            .then(res => res.json())
            res.send({rover_images: rover_images.latest_photos})
        } catch (error) {
            console.log('Error!',error)
        }   
    })
})}

roversData();
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})



