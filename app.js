//нужни пакети
const express = require("express");
const fetch = require("node-fetch");
require("dotenv").config();

//създаване на express сървър
const app = express();

//сървър port number
const PORT = process.env.PORT || 3000;

//set template engine
app.set("view engive", "ejs");
app.use(express.static("public"));

//needed to parse html data for POST requests
app.use(express.urlencoded({
    extended: true
}))
app.use(express.json());

app.get("/", (req, res)=>{
    res.render("index.ejs")
})
app.post("/convert-mp3", async (req, res)=>{
     const videoID = req.body.videoID;
     if(videoID === undefined || videoID === "" || videoID === null){
         return res.render("index.ejs",{success : false, message : "Моля въведете линка на видеото."});
     }else{
         const fetchAPI = await fetch('https://youtube-mp36.p.rapidapi.com/dl?id='+videoID,{
            "method" : "GET" ,
            "headers": {
                "x-rapidapi-key": process.env.API_KEY,
                "x-rapidapi-host": process.env.API_HOST
            }
        });
         
        const fetchResponse = await fetchAPI.json();
        if(fetchResponse.status === "ok"){
            return res.render("index.ejs", {success : true, song_title: fetchResponse.title, song_link: fetchResponse.link})
        }
        else{
            return res.render("index.ejs", {success: false, message: fetchResponse.msg})
        }
        
    }

})

//стартиране на сървър
app.listen(PORT, ()=>{
    console.log("Server started on port " + PORT);
})