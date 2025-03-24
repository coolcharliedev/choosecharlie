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

    //document.getElementById('cardtilebackground').style.height = document.getElementById('why').innerHeight+"px"
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

async function sortAdjusted(query){
    if(!query){
        return buildEndorsementTiles(endorsements)
    }

    range = []

    i = 0
    while(i<endorsements.length){
        if(endorsements[i].name.toLowerCase().includes(query.toLowerCase())){
            range.push(endorsements[i])
        }
        i++
    }

    buildEndorsementTiles(range)
}

async function buildEndorsementTiles(build){
    document.getElementById('endorsementTiles').innerHTML = ""
    function compare( a, b ) {
        if ( a.name < b.name ){
          return -1;
        }
        if ( a.name > b.name ){
          return 1;
        }
        return 0;
      }
      
      build.sort( compare );
    i = 0;
    while(i<build.length){
        console.log(build[i])
        element = document.createElement("div")
        element.classList.add("coverimage")
        element.classList.add("end")
        if(build[i]["img"]){
            element.style.backgroundImage = `url('./../media/endorsementimages/${build[i].img}.png')`
        }else{
            element.style.backgroundImage = `url('./../media/cardtilebackground.png')`
        }
        textbox = document.createElement("div")
        textbox.classList.add('endtxb')

        ename = document.createElement("span")
        ename.classList.add('ename')
        ename.innerHTML = build[i].name

        textbox.appendChild(ename)
        j = 0
        while(j<build[i].positions.length){
            epos = document.createElement("span")
            epos.classList.add('epos')
            textbox.appendChild(epos)

            if(build[i].positions[j].time){
                epos.innerHTML = `<span style="opacity:0.6">${build[i].positions[j].time}</span> ${build[i].positions[j].name}`
            }else{
                epos.innerHTML = build[i].positions[j].name
            }
            j++
        }
        element.appendChild(textbox)

        document.getElementById('endorsementTiles').appendChild(element)
        i++
    }

   
}

const pages = [
    {
        n:"home",
        l:"../"
    },
    {
        n:"endorsements",
        l:"endorsements"
    },
    {
        n:"questions",
        l:"questions"
    },
    {
        n:"promises",
        l:"promises"
    },
]

async function toggleNavContVisibility(e){
    if(e.parentElement.parentElement.children[1].classList.contains("expanded")){
        e.parentElement.parentElement.children[1].classList.remove("expanded")
    }else{
        e.parentElement.parentElement.children[1].classList.add("expanded")
    }
}

async function buildNavBar(currentpage){
    i = 0
    nv = document.getElementsByClassName("navbarelement")

    while(i<nv.length){
        j = 0
        while(j<pages.length){
            bn = document.createElement('span')
            bn.innerHTML = pages[j].n
            bn.classList.add('navBarOption')
            bn.setAttribute("onclick", `location = "./../${pages[j].l}"`)
            nv[i].appendChild(bn)

            if(pages[j].n.toLowerCase() == currentpage.toLowerCase()){
                bn.style.color = "white"
            }
            j++
        }
        i++
    }
}