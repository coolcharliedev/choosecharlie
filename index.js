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

cancelend = false

async function getEndorsements(){
    if(cancelend) return [{name:"Sorry,",lvl:1,positions:[{name:"The endorsements page is currently under maintenance"}]}]
    return await (await fetch(`./${await getRelativeIndentation()}endorsements.json`)).json()
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

async function getRelativeIndentation(){
    r=r
    console.log(r)
    ha = 0
    prd = ""
    while(ha<r){
        prd+="../"
        ha++
    }

    return prd
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
            element.style.backgroundImage = `url('./${await getRelativeIndentation()}media/endorsementimages/${build[i].img}.png')`
        }else{
            element.style.backgroundImage = `url('./${await getRelativeIndentation()}media/cardtilebackground.png')`
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
    it = 0
    nv = document.getElementsByClassName("navbarelement")

    try{
        document.getElementById('cchomebutton').setAttribute('href', `./${await getRelativeIndentation()}`)
    }catch(err){
        console.error("CCH Navhomequickicon Exception: page has an invalid id")
    }

    while(it<nv.length){
        jb = 0
        while(jb<pages.length){
            console.log("g"+jb)
            bn = document.createElement('span')
            bn.innerHTML = pages[jb].n
            bn.classList.add('navBarOption')
            bn.setAttribute("onclick", `location = "./${await getRelativeIndentation()}${pages[jb].l}"`)
            nv[it].appendChild(bn)

            if(pages[jb].n.toLowerCase() == currentpage.toLowerCase()){
                bn.style.color = "white"
            }
            jb++
        }
        it++
    }
}

addEventListener("resize", e =>{
    try{
        document.getElementById('spacer').style.display = 'block'
        document.getElementById('spacer').style.height = document.getElementsByClassName('classnavcont')[0].offsetHeight+"px"
    }catch(err){
        console.error("CCH Exception: page has an invalid head spacer")
    }
    
})

addEventListener("load", e =>{
    try{
        document.getElementById('spacer').style.display = 'block'
        document.getElementById('spacer').style.height = document.getElementsByClassName('classnavcont')[0].offsetHeight+"px"
    }catch(err){
        console.error("CCH Exception: page has an invalid head spacer")
    }
    
})

async function sheetsToStreets(thing){
    rows = thing["rows"]
    qs = []

    ie= 0
    while(ie<rows.length){
        qs.push({
            q:{
                author: rows[ie]["c"][4].v,
                time:rows[ie]["c"][3].v,
                content: rows[ie]["c"][2].v
            },
            a:{
                content:rows[ie]["c"][6].v
            }
        })
        ie++
    }

    window.localStorage.setItem("questionCache",JSON.stringify(qs))

    await loadQuestions()
}

async function getOffsiteQuestions(){
    function reqListener () {
        var jsonString = this.responseText.match(/(?<="table":).*(?=}\);)/g)[0];
        var json = JSON.parse(jsonString);
        
        sheetsToStreets(json)
      }
      
      var id = '1tCigEjy5WbyMG0lQI6VgT0VNGZvjkBxyWNCSTPrz_xA';
      var gid = '1601666407';
      var url = 'https://docs.google.com/spreadsheets/d/'+id+'/gviz/tq?tqx=out:json&tq&gid='+gid;
      var oReq = new XMLHttpRequest();
      oReq.onload = reqListener;
      oReq.open("get", url, true);
      oReq.send();

      

    

    /*return [
        {
            q:{
                author:"Rory L",
                time:(new Date()).getTime()-(1000*60*60*48),
                content: "Test Question 1"
            },
            a:{
                author:"Charlie L",
                time:(new Date()).getTime(),
                content: "Test Answer 1"
            }
        },
        {
            q:{
                author:"Aaron Z",
                time:(new Date()).getTime()-(1000*60*60*48),
                content: "Test Question 2"
            },
            a:{
                author:"Charlie L",
                time:(new Date()).getTime(),
                content: "Test Answer 2"
            }
        },
    ]*/
   return []
}

async function getQuestions(loadOffsite){
    if(loadOffsite){
        qs = await getOffsiteQuestions()

        window.localStorage.setItem('questionCache', JSON.stringify(qs))

        return qs
    }else{
        qs = window.localStorage.getItem('questionCache')

        qs = JSON.parse(qs)

        return qs
    }
}

async function initialQuestionLoad(){
    await getQuestions(true)

    await loadQuestions()
}

async function buildQuestions(whichonestho){
    t = document.getElementById('questionZone')
    t.innerHTML = ""
    i = 0
    while(i<whichonestho.length){
        main = document.createElement('div')
        t.appendChild(main)

        main.innerHTML = `<div style="border:3px white solid;border-radius:10px;padding:20px 30px 20px 30px;">
                <ht2 class="subtitle" style="font-size:28px;">${whichonestho[i].q.content}</ht2>
                <p style="margin-bottom:10px;">Asked by <span style="color:rgb(0, 89, 255);">${whichonestho[i].q.author}</span> on <span style="color:rgb(0, 89, 255);">${(new Date(whichonestho[i].q.time)).toDateString()}</p>
                <p style="font-size:20px;display:none;">${whichonestho[i].a.content}</p>
                <p style="font-size:20px;text-decoration:underline;cursor:pointer;" onclick="this.parentElement.children[2].style.display='block';this.remove()">Click here to read answer</p>
            </div>`
        i++
    }
}


async function loadQuestions(query){
    questions = await getQuestions()
    if(!query){
        buildQuestions(questions)
    }else{
        i = 0
        range = []

        while(i<questions.length){
            add = false
            if(questions[i].q.content.toLowerCase().includes(query.toLowerCase())){
                add = true
            }

            if(questions[i].a.content.toLowerCase().includes(query.toLowerCase())){
                add = true
            }

            if(add){
                range.push(questions[i])
            }
            i++
        }

        buildQuestions(range)
    }
}