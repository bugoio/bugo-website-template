/*
*   Bugo Menubar Item - (link in the menubar)
*   This is a modified version of the demo at:
*   https://www.w3.org/TR/wai-aria-practices/examples/menubar/menubar-1/menubar-1.html
*   This content is licensed according to the W3C Software License at
*   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
*/
module.exports = MenubarItem = function (domNode, menuObj) {

  this.menu = menuObj;
  this.domNode = domNode;
  this.popupMenu = false;

  this.hasFocus = false;
  this.hasHover = false;

  this.isMenubarItem = true;

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

MenubarItem.prototype.init = function () {
  this.domNode.tabIndex = -1;

  this.domNode.addEventListener('keydown', this.handleKeydown.bind(this));
  this.domNode.addEventListener('focus', this.handleFocus.bind(this));
  this.domNode.addEventListener('blur', this.handleBlur.bind(this));
  this.domNode.addEventListener('mouseup', this.handleClick.bind(this));

  // Initialize pop up menus

  var nextElement = this.domNode.nextElementSibling;
  var list;
  ////console.log(nextElement)
  if (nextElement && nextElement.getAttribute('role') === 'menu') {
    this.popupMenu = new PopupMenu(nextElement, this);
    this.popupMenu.init();
  }
};

MenubarItem.prototype.handleKeydown = function (event) {
  var tgt = event.currentTarget,
    char = event.key,
    flag = false,
    clickEvent;

  function isPrintableCharacter (str) {
    return str.length === 1 && str.match(/\S/);
  }

  switch (event.keyCode) {
    case this.keyCode.SPACE:
    case this.keyCode.RETURN:
    case this.keyCode.DOWN:
      if (this.popupMenu) {
        this.popupMenu.open();
        this.popupMenu.setFocusToFirstItem();
        flag = true;
      }
      break;

    case this.keyCode.LEFT:
      if(this.popupMenu){
        this.popupMenu.close();
      }
      this.menu.setFocusToPreviousItem(this);
      flag = true;
      break;

    case this.keyCode.RIGHT:
      if(this.popupMenu){
        this.popupMenu.close();
      }
      this.menu.setFocusToNextItem(this);
      flag = true;
      break;

    case this.keyCode.UP:
      if (this.popupMenu) {
        this.popupMenu.open();
        this.popupMenu.setFocusToLastItem();
        flag = true;
      }
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

    case this.keyCode.TAB:
      if(this.popupMenu){
        this.popupMenu.close(true);
      }
      break;

    case this.keyCode.ESC:
      if(this.popupMenu){
        this.popupMenu.close(true);
      }
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

MenubarItem.prototype.setExpanded = function (value) {
  //console.log("menubarItem.setExpanded",value);
  if (value) {
    this.menu.closeAll();
    this.popupMenu.domNode.classList.add('expanded');
    this.popupMenu.domNode.classList.remove('default','blurred');
    this.domNode.setAttribute('aria-expanded', 'true');
  }  else {
    this.popupMenu.domNode.classList.add('blurred');
    this.popupMenu.domNode.classList.remove('expanded');
    this.domNode.setAttribute('aria-expanded', 'false');
  }
};

MenubarItem.prototype.handleFocus = function (event) {
  this.menu.hasFocus = true;
};

MenubarItem.prototype.handleBlur = function (event) {
  this.menu.hasFocus = false;
};

MenubarItem.prototype.handleClick = function (event) {
  if(this.popupMenu){
    this.menu.hasFocus = true;
    this.popupMenu.open();  
  }
};
