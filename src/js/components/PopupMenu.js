/*
*   Bugo PopupMenu - (link in the menubar)
*   This is a modified version of the demo at:
*   https://www.w3.org/TR/wai-aria-practices/examples/menubar/menubar-1/menubar-1.html
*   This content is licensed according to the W3C Software License at
*   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
*/
module.exprots = PopupMenu = function (domNode, controllerObj) {

  function findAncestor (el, sel) {
    while ((el = el.parentElement) && !((el.matches || el.matchesSelector).call(el,sel)));
    return el;
  }

  var elementChildren,
    msgPrefix = 'PopupMenu constructor argument domNode ';

  // Check whether domNode is a DOM element
  if (!domNode instanceof Element) {
    throw new TypeError(msgPrefix + 'is not a DOM Element.');
  }
  // Check whether domNode has child elements
  if (domNode.childElementCount === 0) {
    throw new Error(msgPrefix + 'has no element children.');
  }
  // Check whether domNode descendant elements have A elements
  var childElement = domNode.firstElementChild;
  while (childElement) {
    var menuitem = childElement.firstElementChild;
    if (menuitem && menuitem === 'A') {
      throw new Error(msgPrefix + 'has descendant elements that are not A elements.');
    }
    childElement = childElement.nextElementSibling;
  }

  this.isMenubar = false;

  this.domNode    = domNode;
  this.parentList  = findAncestor(domNode,'ul');
  this.controller = controllerObj;

  this.menuitems = []; // See PopupMenu init method
  this.firstChars = []; // See PopupMenu init method

  this.firstItem = null; // See PopupMenu init method
  this.lastItem = null; // See PopupMenu init method
  this.default = true;
  this.hasFocus = false; // See MenuItem handleFocus, handleBlur
  this.hasHover = false; // See PopupMenu handleMouseover, handleMouseout
};

/*
*   @method PopupMenu.prototype.init
*
*   @desc
*       Add domNode event listeners for mouseover and mouseout. Traverse
*       domNode children to configure each menuitem and populate menuitems
*       array. Initialize firstItem and lastItem properties.
*/
PopupMenu.prototype.init = function () {
  var childElement, menuElement, menuItem, textContent, numItems, label;

  // Configure the domNode itself
  this.controller.domNode.addEventListener('mouseup', this.handleMouseover.bind(this));
  this.controller.domNode.addEventListener('mouseover', this.handleMouseover.bind(this));
  this.domNode.addEventListener('mouseleave', this.handleMouseout.bind(this));

  // Traverse the element children of domNode: configure each with
  // menuitem role behavior and store reference in menuitems array.
  childElement = this.domNode.querySelector('li');
  while (childElement) {
    // //console.log("childElement",childElement);

    menuElement = childElement.firstElementChild;

    if (menuElement && menuElement.tagName === 'A') {
      menuItem = new MenuItem(menuElement, this);
      menuItem.init();
      this.menuitems.push(menuItem);
      textContent = menuElement.textContent.trim();
      this.firstChars.push(textContent.substring(0, 1).toLowerCase());
    }
    else if (menuElement && menuElement.tagName === 'LI') {
      menuElement.addEventListener('mouseout',function(event){
        event.stopPropagation();
      });
    }

    childElement = childElement.nextElementSibling;
  }

  // Use populated menuitems array to initialize firstItem and lastItem.
numItems = this.menuitems.length;
  if (numItems > 0) {
    this.firstItem = this.menuitems[ 0 ];
    this.lastItem = this.menuitems[ numItems - 1 ];
  }
};

/* EVENT HANDLERS */

PopupMenu.prototype.handleMouseover = function (event) {
  //////console.log('PopupMenu.handleMouseover');
  this.hasHover = true;
};

PopupMenu.prototype.handleMouseout = function (event) {
    if(event.target.getAttribute('data-mouseout') !== 'false') {
      //this.hasHover = false;
      setTimeout(this.close.bind(this, true), 300);  
    }
};

PopupMenu.prototype.handleTransitionStart = function(event) {
  event.stopPropagation();
  ////console.log("PopupMenu.handleTransitionStart",this.hasHover);
  if(this.hasHover){
    this.domNode.style.visibility = "visible";
  }
}

PopupMenu.prototype.handleTransitionEnd = function(event) {
  event.stopPropagation();
  ////console.log("PopupMenu.handleTransitionEnd",this.hasHover);
  if(!this.hasHover){
    this.domNode.style.visibility = "visible";
  }
}

/* FOCUS MANAGEMENT METHODS */

PopupMenu.prototype.setFocusToController = function (command, flag) {
  ////console.log('setFocusToController',command,flag);

  if (typeof command !== 'string') {
    command = '';
  }

  function setFocusToMenubarItem (controller, close) {
    //console.log('controller',controller);
    while (controller) {
      if (controller.isMenubarItem) {
        controller.domNode.focus();
        return controller;
      }
      else {
        if (close) {
          this.close();
          controller.menu.close(true);
        }
        controller.hasFocus = false;
      }
      controller = controller.menu.controller;
    }
    return false;
  }

  if (command === '') {
    if (this.controller && this.controller.domNode) {
      this.controller.domNode.focus();
    }
    return;
  }

  if (!this.controller.isMenubarItem) {
    this.controller.domNode.focus();
    this.close();

    if (command === 'next') {
      //console.log('focusing next controller');
      var menubarItem = setFocusToMenubarItem(this.controller, true);
      if (menubarItem) {
        menubarItem.menu.setFocusToNextItem(menubarItem, flag);
      }
    }
  }
  else {
    if (command === 'previous') {
      //console.log('focusing previous');
      this.close();
      this.controller.menu.setFocusToPreviousItem(this.controller, flag);
    }
    else if (command === 'next') {
      this.controller.menu.setFocusToNextItem(this.controller, flag);
    }
  }

};

PopupMenu.prototype.setFocusToFirstItem = function () {
  //console.log('setFocusToFirstItem',this.firstItem.domNode);
  this.firstItem.domNode.focus();
};

PopupMenu.prototype.setFocusToLastItem = function () {
  //console.log('lastItem',this.lastItem);
  this.lastItem.domNode.focus();
};

PopupMenu.prototype.setFocusToPreviousItem = function (currentItem,flag) {
  var index;
  //console.log('setFocusToPreviousItem',currentItem,flag);
  if (currentItem === this.firstItem) {
    this.lastItem.domNode.focus();
  }
  else {
    index = this.menuitems.indexOf(currentItem);
    this.menuitems[ index - 1 ].domNode.focus();
  }
};

PopupMenu.prototype.setFocusToNextItem = function (currentItem) {
  var index;
  //console.log('setFocusToNextItem',currentItem);
  if (currentItem === this.lastItem) {
    this.firstItem.domNode.focus();
  }
  else {
    index = this.menuitems.indexOf(currentItem);
    //console.log(this.menuitems,index+1);
    this.menuitems[ index + 1 ].domNode.focus();
  }
};

PopupMenu.prototype.setFocusByFirstCharacter = function (currentItem, char) {
  var start, index, char = char.toLowerCase();

  // Get start index for search based on position of currentItem
  start = this.menuitems.indexOf(currentItem) + 1;
  if (start === this.menuitems.length) {
    start = 0;
  }

  // Check remaining slots in the menu
  index = this.getIndexFirstChars(start, char);

  // If not found in remaining slots, check from beginning
  if (index === -1) {
    index = this.getIndexFirstChars(0, char);
  }

  // If match was found...
  if (index > -1) {
    this.menuitems[ index ].domNode.focus();
  }
};

PopupMenu.prototype.getIndexFirstChars = function (startIndex, char) {
  for (var i = startIndex; i < this.firstChars.length; i++) {
    if (char === this.firstChars[ i ]) {
      return i;
    }
  }
  return -1;
};

/* MENU DISPLAY METHODS */

PopupMenu.prototype.open = function () {
  this.parentList.classList.add('child-open');
  this.hasHover = true;
  this.default = false;
  this.controller.setExpanded(true);
};

PopupMenu.prototype.close = function (force) {
  this.parentList.classList.remove('child-open');
  this.controller.setExpanded(false);
  for (var i = 0, len = this.menuitems.length; i < len; i++) {
    if(this.menuitems[i].popupMenu){
      this.menuitems[i].popupMenu.close();
    }
  }
};

PopupMenu.prototype.focusController = function () {
  this.controller.focus();
}
