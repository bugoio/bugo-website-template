/*
*   This is a modified version of the demo at:
*   https://www.w3.org/TR/wai-aria-practices/examples/menubar/menubar-1/menubar-1.html
*   This content is licensed according to the W3C Software License at
*   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
*/
module.exports = MenuItem = function (domNode, menuObj) {
  // //console.log('MenuItem',domNode,menuObj);
  if (typeof popupObj !== 'object') {
    popupObj = false;
  }

  this.domNode = domNode;

  //console.log('domNode',this.domNode);



  this.menu = menuObj;
  this.popupMenu = false;
  this.isMenubarItem = false;

  this.keyCode = Object.freeze({
    'TAB': 9,
    'RETURN': 13,
    'ESC': 27,
    'SPACE': 32,
    'PAGEUP': 33,
    'PAGEDOWN': 34,
    'END': 35,
    'HOME': 36,
    'LEFT': 37,
    'UP': 38,
    'RIGHT': 39,
    'DOWN': 40
  });
};

MenuItem.prototype.init = function () {
  this.domNode.tabIndex = -1;

  this.domNode.addEventListener('keydown', this.handleKeydown.bind(this));
  this.domNode.addEventListener('focus', this.handleFocus.bind(this));
  this.domNode.addEventListener('blur', this.handleBlur.bind(this));
  this.domNode.addEventListener('mouseup', this.handleMouseover.bind(this));
  this.domNode.addEventListener('mouseover', this.handleMouseover.bind(this));
  // Initialize flyout menu

  //console.log('this.domNode.nextElementSibling',this.domNode.nextElementSibling);

  var nextElement = this.domNode.nextElementSibling;

  // if(nextElement && nextElement.tagName === 'DIV') {
  //   nextElement = nextElement.querySelector('ul');
  // }

  // //console.log('this should be <ul>',nextElement);
  if (nextElement) {

    this.popupMenu = new PopupMenu(nextElement, this);
    this.popupMenu.init();
    this.closeButton  = nextElement.querySelector('button');
    if(this.closeButton){
      this.closeButton.addEventListener('mouseup',this.handleCloseButton.bind(this));
    }
  }

};

MenuItem.prototype.isExpanded = function () {
  return this.domNode.getAttribute('aria-expanded') === 'true';
};

/* EVENT HANDLERS */

MenuItem.prototype.handleKeydown = function (event) {
  var tgt  = event.currentTarget,
    char = event.key,
    flag = false,
    clickEvent;

  function isPrintableCharacter (str) {
    return str.length === 1 && str.match(/\S/);
  }

  switch (event.keyCode) {
    case this.keyCode.SPACE:
    case this.keyCode.RETURN:
      if (this.popupMenu) {
        this.popupMenu.open();
        this.popupMenu.setFocusToFirstItem();
      }
      else {

        // Create simulated mouse event to mimic the behavior of ATs
        // and let the event handler handleClick do the housekeeping.
        try {
          clickEvent = new MouseEvent('click', {
            'view': window,
            'bubbles': true,
            'cancelable': true
          });
        }
        catch (err) {
          if (document.createEvent) {
            // DOM Level 3 for IE 9+
            clickEvent = document.createEvent('MouseEvents');
            clickEvent.initEvent('click', true, true);
          }
        }
        tgt.dispatchEvent(clickEvent);
      }

      flag = true;
      break;

    case this.keyCode.UP:
      this.menu.setFocusToPreviousItem(this);
      flag = true;
      break;

    case this.keyCode.DOWN:
      this.menu.setFocusToNextItem(this);
      flag = true;
      break;

    case this.keyCode.LEFT:
      this.menu.setFocusToController('previous', true);
      this.menu.close(true);
      flag = true;
      break;

    case this.keyCode.RIGHT:
      if (this.popupMenu) {
        this.popupMenu.open();
        this.popupMenu.setFocusToFirstItem();
      }
      else {
        this.menu.setFocusToController('next', true);
        this.menu.close(true);
      }
      flag = true;
      break;

    case this.keyCode.HOME:
    case this.keyCode.PAGEUP:
      this.menu.setFocusToFirstItem();
      flag = true;
      break;

    case this.keyCode.END:
    case this.keyCode.PAGEDOWN:
      this.menu.setFocusToLastItem();
      flag = true;
      break;

    case this.keyCode.ESC:
      this.menu.setFocusToController();
      this.menu.close(true);
      flag = true;
      break;

    case this.keyCode.TAB:
      this.menu.setFocusToController();
      break;

    default:
      if (isPrintableCharacter(char)) {
        this.menu.setFocusByFirstCharacter(this, char);
        flag = true;
      }
      break;
  }

  if (flag) {
    event.stopPropagation();
    event.preventDefault();
  }
};

MenuItem.prototype.setExpanded = function (value) {
  //console.log("menuItem.js: setExpanded",);
  if (value) {
    this.popupMenu.domNode.classList.add('expanded');
    this.popupMenu.domNode.classList.remove('default','blurred');
    this.domNode.setAttribute('aria-expanded', 'true');
  }  else {
    this.popupMenu.domNode.classList.add('blurred');
    this.popupMenu.domNode.classList.remove('expanded');
    this.domNode.setAttribute('aria-expanded', 'false');
  }
};

MenuItem.prototype.handleClick = function (event) {
  //console.log('clicked',event);
  event.stopPropagation();
  this.menu.setFocusToController(null,true);
  this.menu.close(true);
};

MenuItem.prototype.handleFocus = function (event) {
  this.menu.hasFocus = true;
};

MenuItem.prototype.handleBlur = function (event) {
  this.menu.hasFocus = false;
};

MenuItem.prototype.handleMouseover = function (event) {
  if(event.type === 'mouseup'){
    event.stopPropagation();
    // this.menu.hasHover = true;
    this.menu.open();
    if (this.popupMenu) {
      // this.popupMenu.hasHover = true;
      this.popupMenu.open();
    }
  } else {
    event.stopPropagation();
  }
};

MenuItem.prototype.handleCloseButton = function (event) {
  event.stopPropagation();
  console.log(this);
  this.popupMenu.close();
}