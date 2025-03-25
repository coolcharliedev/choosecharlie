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

async function getEndorsements(){
    return await (await fetch("./../endorsements.json")).json()
}

async function loadEndorsementTiles(range){
    if(range){
        buildEndorsementTiles(range)
    }else{
        buildEndorsementTiles(await getEndorsements())
    }
}

async function sortAdjusted(query){
    if(!query){
        return buildEndorsementTiles(endorsements)
    }

    endorsements = await getEndorsements()

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

async function populateQuestionField(){
    var url_string = window.location.href
    var url = new URL(url_string);
    var c = url.searchParams.get("question");


    document.getElementById('question').value = c
}

async function submitQuestion(){
    info = {
        question:document.getElementById('question').value,
        first:document.getElementById('fn').value,
        last:document.getElementById('ln').value,
        email:document.getElementById('email').value
    }
    if(!info.question){
        return document.getElementById('errorMsg').innerHTML = "Question cannot be blank."
    }

    if((info.first && !info.last) || (!info.first && info.last)){
        return document.getElementById('errorMsg').innerHTML = "If you submit one part of the name you must submit the whole thing."
    }

    if(!hcaptcha.getResponse()){
        return document.getElementById('errorMsg').innerHTML = "Complete the captcha to continue."
    }

    if(!info.first && !info.last){
        namea = "Anonymous"
    }else{
        namea = info.first+" "+info.last.substring(0,1)
    }

    final = {
        question:info.question,
        name:namea,
        email:info.email,
    }

    l = window.localStorage.getItem("qSubmitted")
    if(parseInt(l)){
        if(((new Date()).getTime()) - parseInt(l) < 1000*60*5){
            document.getElementById('errorMsg').innerHTML = "Please wait longer before asking another question."
            return
        }
    }

    document.getElementById('errorMsg').innerHTML = "<span style='color:yellow;'>Sending request to server...</span>"

    res = await sendQuestion(final)

    if(res == 200){
        document.getElementById('questionform').remove()
        document.getElementById('successNotification').style.display = "block"

        window.localStorage.setItem('qSubmitted', (new Date()).getTime())
    }else{
        document.getElementById('errorMsg').innerHTML = "An unexpected error occurred while submitting your question. Contact Charlie for more details."
    }
}
    
async function sendQuestion(a){
    console.log(a)

    return 200
}

async function addEndorsementTiles(build){
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

async function buildEndorsementTiles(buildr){
    console.log(buildr)
    document.getElementById('endorsementTiles').innerHTML = ""
    priorities = {}

    i = 0
    while(i<buildr.length){
        if(priorities[buildr[i].lvl]){
            priorities[buildr[i].lvl].push(buildr[i])
        }else{
            priorities[buildr[i].lvl] = []
            priorities[buildr[i].lvl].push(buildr[i])
        }
        i++
    }
    v=1
    while(v<6){
        await addEndorsementTiles(priorities[v] || [])
        v++
    }
    console.log(priorities)
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

addEventListener("resize", e =>{
    console.log('as')
    document.getElementById('spacer').style.display = 'block'
    document.getElementById('spacer').style.height = document.getElementsByClassName('classnavcont')[0].offsetHeight+"px"
})

addEventListener("load", e =>{
    console.log('as')
    document.getElementById('spacer').style.display = 'block'
    document.getElementById('spacer').style.height = document.getElementsByClassName('classnavcont')[0].offsetHeight+"px"
})