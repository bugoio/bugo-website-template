import ready from "./utilities/ready"
/* Add custom modules to this site */
import {RandomPosts} from './components/RandomPosts';
import LazyLoad from "vanilla-lazyload"

const lazyLoadInstance = new LazyLoad({
  elements_selector: ".lazy"
});

ready(() => {
})