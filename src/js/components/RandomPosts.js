import ShuffleArray from './ShuffleArray'

const RandomPosts = (url,qty,callback = false) => {
  fetch(url)
  .then(response => response.json())
  .then(data => {
    if(callback){
      callback(ShuffleArray(data.data).slice(0,qty))
    }
  });
}

export {RandomPosts}