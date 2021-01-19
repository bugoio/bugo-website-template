import "./utilities/ready"
import LazyLoad from "vanilla-lazyload"
import "./components/Menubar"
import "./components/MenubarItem"
import "./components/MenuItem"
import "./components/PopupMenu"
import {TreeLinks} from "./components/TreeLinks"
import { MobileMenu } from "./components/MobileMenu"

const lazyLoadInstance = new LazyLoad({
  elements_selector: ".lazy"
});

ready(function () {
  // Activate Menu Bars WCAG functionalty
  const menus = document.querySelectorAll("[role='menubar']")
  if(menus.length > 0){
    menus.forEach((i) => {
      new Menubar(i).init();      
    })
  }

  // Activate Tree WCAG functionalty
  var trees = document.querySelectorAll('[role="tree"]');
  for (var i = 0; i < trees.length; i++) {
    var t = new TreeLinks(trees[i]);
    t.init();
  }

  MobileMenu()

  

});