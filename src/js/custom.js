import ready from "./utilities/ready"
/* Add custom modules to this site */
import {RandomPosts} from './components/RandomPosts'
import LazyLoad from "vanilla-lazyload"
import accordion from 'aria-accordion'

// Required element to turn into an accordion
var elm = document.querySelector('.js-accordion')
if(elm){
  new accordion.Accordion(elm,null,{
    collapseOthers: true,
    reflectStatic: false,
    customHiding: true
  });
}


const lazyLoadInstance = new LazyLoad({
  elements_selector: ".lazy"
});

function htmlDecode(input){
  var e = document.createElement('textarea');
  e.innerHTML = input;
  // handle case of empty input
  return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
}

function populateAttorneys(result){
  const target = document.querySelector("#random-attorneys .container > .flex")
  result.forEach( function (attorney, key) {
    let frag = document.getElementById('random-post-template').content.cloneNode(true);
    frag.querySelector(".post-title a").setAttribute("href", attorney.permalink);
    frag.querySelector(".post-thumbnail").setAttribute("href", attorney.permalink);
    frag.querySelector(".post-title .name").textContent = attorney.name;
    frag.querySelector(".post-title .position").textContent = attorney.params.position;
    frag.querySelector(".post-thumbnail").innerHTML = htmlDecode(attorney.thumbnail);
    target.appendChild(frag);
    lazyLoadInstance.update()
  });
}

ready(() => {
  const rPostEls = document.querySelectorAll('.random-post-block');
  console.log(rPostEls);
  rPostEls.forEach((el)=>{
    console.log(el.dataset.api)
    const target = document.querySelector(`#${el.id} .container > .flex`)
    console.log(`#${el.id}.container > .flex`, target)
    RandomPosts(el.dataset.api,el.dataset.qty,(data) => {
      console.log(data)
      data.forEach((post)=>{
        let frag = document.getElementById('random-post-template').content.cloneNode(true);
        frag.querySelector(".post-thumbnail").setAttribute("href", post.permalink);
        frag.querySelector(".post-thumbnail").innerHTML = htmlDecode(post.thumbnail);
        frag.querySelector(".post-title a").setAttribute("href", post.permalink);
        frag.querySelector(".post-title .name").textContent =  post.title;
        frag.querySelector(".summary").textContent = post.summary
        target.appendChild(frag);
        lazyLoadInstance.update()  
      })
    })
  })
  // RandomPosts('./attorneys/index.json',3,(data) => {
  //   populateAttorneys(data)
  // })
  // document.querySelector('.location-filter').addEventListener('change', (e) => { 
  //   const els = document.querySelectorAll(`[data-location]`)
  //   if(e.target.value !== 'All'){
  //     els.forEach((el)=>{
  //       console.log(el)
  //       if(el.dataset.location !== e.target.value){
  //         el.classList.add('hide')
  //       }else{
  //         el.classList.remove('hide')
  //       }
  //     })
  //   }else{
  //     els.forEach((el)=>{
  //       el.classList.remove('hide')
  //     })
  //   } 
  // })
})