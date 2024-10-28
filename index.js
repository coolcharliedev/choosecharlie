async function setupEndorsementsImages(){
    cutoffpercent = 50
    picture = document.getElementById('charliesignsimage')

    img = new Image();
    img.onload = function() {

        if((((this.height*window.innerWidth)/this.width)/window.innerHeight)*100 >= cutoffpercent){
            picture.style.height = (window.innerHeight/(100/cutoffpercent))+"px"
        }else{
            picture.style.height = ((this.height*window.innerWidth)/this.width)+"px"
        }
    }
    img.src = './../media/studentswithsigns-mockup.png';

    picture.style.backgroundImage = 'url(./../media/studentswithsigns-mockup.png)'

    document.getElementById('cardtilebackground').style.height = document.getElementById('why').innerHeight+"px"
}

async function animateUnderlineDecoration(){
    element = document.getElementById('animated-text-decoration')
        element.style.transition = "width 0s"
    element.style.width = "0%"

    setTimeout(function(){
        element.style.transition = "width 1s"
        setTimeout(function(){
            element.style.width = "100%"
        },10)
    },10)
}

const endorsements = [
    {
        name: "Rory Laing-Gatehouse",
        positions:[
            {
                name:"SAC Vice President",
                time:"2023-2024"
            },
            {
                name:"SAC Co-President",
                time:"2024-2025"
            },
        ],
        grade:"11",
    },
    {
        name: "Cole Macleod",
        positions:[
            {
                name:"SAC President",
                time:"2023-2024"
            },
            {
                name:"SAC Grade 12 Rep",
                time:"2024-2025"
            },
        ],
        grade:"12",
    },
    {
        name: "Zackary Prior",
        positions:[
            {
                name:"SAC Co-President",
                time:"2024-2025"
            },
        ],
        grade:"11",
    },
    {
        name: "Jaden Segal-Braves",
        positions:[
            {
                name:"SAC Chair",
                time:"2023-2024"
            },
        ],
        grade:"11",
    }
]

async function loadEndorsementTiles(range){
    if(range){
        buildEndorsementTiles(range)
    }else{
        buildEndorsementTiles(endorsements)
    }
}

async function buildEndorsementTiles(build){
    i = 0;
    while(i<build.length){
        i++
    }
}