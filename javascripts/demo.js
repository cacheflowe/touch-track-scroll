// for a locked mobile screen
MobileUtil.lockTouchScreen(true);
MobileUtil.alertErrors();

// grab pages and container elements for layout changes
var scrollInner = document.body.querySelectorAll(".scroll-inner")[0];
var scrollOuter = document.body.querySelectorAll(".scroll-outer")[0];
var mainPages = scrollInner.querySelectorAll(".main-page");
var numPages = mainPages.length;

// grab pages and container elements for layout changes
var scrollInnerSecondary = document.body.querySelectorAll(".scroll-inner-secondary")[0];
var scrollOuterSecondary = document.body.querySelectorAll(".scroll-outer-secondary")[0];
var pagesSecondary = scrollInnerSecondary.querySelectorAll(".page");
var numPagesSecondary = pagesSecondary.length;

// set width of pages and scroll-inner to let pages float horizontally
var setHorizontalLayoutResponsive = function(scrollInner, pages) {
  scrollInner.style.width = pages.length*100+'%';
  scrollInner.style.height = '';
  for(var i=0; i < pages.length; i++) {
    pages[i].style.width = (1/pages.length)*100+'%';
    pages[i].style.height = '';
  };
};
var setHorizontalLayoutPixel = function(scrollInner, scrollOuter, pages) {
  scrollInner.style.width = (scrollOuter.offsetWidth * pages.length)+'px';
  scrollInner.style.height = scrollOuter.offsetHeight+'px';
  for(var i=0; i < pages.length; i++) {
    pages[i].style.width = scrollOuter.offsetWidth+'px';
    pages[i].style.height = scrollOuter.offsetHeight+'px';
  };
};

// set width of pages and scroll-inner to let pages float vertically
var setVerticalLayoutResponsive = function(scrollInner, pages) {
  scrollInner.style.width = '';
  scrollInner.style.height = pages.length*100+'%';
  for(var i=0; i < pages.length; i++) {
    pages[i].style.width = '';
    pages[i].style.height = (1/pages.length)*100+'%';
  };
};
var setVerticalLayoutPixel = function(scrollInner, scrollOuter, pages) {
  scrollInner.style.width = scrollOuter.offsetWidth+'px';
  scrollInner.style.height = (scrollOuter.offsetHeight * pages.length)+'px';
  for(var i=0; i < pages.length; i++) {
    pages[i].style.width = scrollOuter.offsetWidth+'px';
    pages[i].style.height = scrollOuter.offsetHeight+'px';
  };
};

// 
var setGridLayout = function() {
  var rows = Math.ceil(mainPages.length/3);
  scrollInner.style.width = '300%';
  scrollInner.style.height = rows*100+'%';         // inner-scroll element is set to 100% * pages.length
  for(var i=0; i < mainPages.length; i++) {
    mainPages[i].style.width = (1/3)*100+'%';
    mainPages[i].style.height = (1/rows)*100+'%';      // each page is set to 100% / numPages to fill scroll-inner
  };
};


// respond to window size changes
window.addEventListener('resize',function(e){
  if( scroller.getOrientation() == tts.TouchScroller.HORIZONTAL ) {
    setHorizontalLayoutPixel(scrollInner, scrollOuter, mainPages);
  } else if( scroller.getOrientation() == tts.TouchScroller.VERTICAL ) {
    setVerticalLayoutPixel(scrollInner, scrollOuter, mainPages);
  } else {
    setGridLayout();
  }
  // make sure scroller updates to window size
  scroller.calculateDimensions();
});


// set class on selected button
var setActiveButton = function(button, buttons) {
  for(var i=0; i < buttons.length; i++) {
    if(button == buttons[i]) {
      buttons[i].classList.add('active');
    } else {
      buttons[i].classList.remove('active');
    }
  }
};

// setup scroll direction change handlers ------------------------------
var directionButtons = document.getElementsByClassName("direction");

var buttonDirectionH = document.getElementById('direction-h');
buttonDirectionH.addEventListener('click',function(){
  setHorizontalLayoutPixel(scrollInner, scrollOuter, mainPages);
  scroller.setOrientation(tts.TouchScroller.HORIZONTAL);
  setActiveButton(buttonDirectionH, directionButtons);
},false);

var buttonDirectionV = document.getElementById('direction-v');
buttonDirectionV.addEventListener('click',function(){
  setVerticalLayoutPixel(scrollInner, scrollOuter, mainPages);
  scroller.setOrientation(tts.TouchScroller.VERTICAL);
  setActiveButton(buttonDirectionV, directionButtons);
},false);

var buttonDirectionG = document.getElementById('direction-g');
buttonDirectionG.addEventListener('click',function(){
  setGridLayout();
  scroller.setOrientation(tts.TouchScroller.UNLOCKED);
  setActiveButton(buttonDirectionG, directionButtons);
},false);

// setup (non-)paged toggle --------------------------------------------
var pagedButtons = document.getElementsByClassName("paged");

var pagedTrueButton = document.getElementById('paged-true');
pagedTrueButton.addEventListener('click',function(){
  scroller.setIsPaged(true);
  setActiveButton(pagedTrueButton, pagedButtons);
},false);

var pagedFalseButton = document.getElementById('paged-false');
pagedFalseButton.addEventListener('click',function(){
  scroller.setIsPaged(false);
  setActiveButton(pagedFalseButton, pagedButtons);
},false);

// basic scroller setup ------------------------------------------------
var scrollerDelegate = {
  updatePosition: function(positionX, positionY, isTouching) {
    debugPosition.innerHTML = 'Position: '+( Math.round(scroller.getCurScrollPosition() * 100) / 100 );
    debugWidth.innerHTML = 'Width: '+scrollOuter.offsetWidth+' / '+scrollInner.offsetWidth;
    debugHeight.innerHTML = 'Height: '+scrollInner.offsetHeight;
  },
  touchEnd: function() {
    
  },
  handleDestination: function() {
    // console.log( scroller.getCurScrollPosition() );
    // console.log('handleDestination');
  },
  pageChanged: function() {
    debugPage.innerHTML = 'Page: '+scroller.getPage();
  }
};

// set basic options object - lots more can be overridden in touch-scroller.js
var scrollOptions = {
  isPaged: true,
  defaultOrientation: tts.TouchScroller.HORIZONTAL,
  scrollerDelegate: scrollerDelegate,
  disabledElements: "div",
  pagedEasingFactor: 6,
  nonPagedFriction: 0.9,
  disablesRightClick: true
};

// initialize the scroller with or main containers and options
setHorizontalLayoutPixel(scrollInner, scrollOuter, mainPages);
var scroller = new tts.TouchScroller(
  scrollOuter, 
  scrollInner, 
  scrollOptions
);

setVerticalLayoutResponsive(scrollInnerSecondary, pagesSecondary);
var scrollerSecondary = new tts.TouchScroller(
  scrollOuterSecondary, 
  scrollInnerSecondary, 
  {
    isPaged: true,
    defaultOrientation: tts.TouchScroller.VERTICAL,
    disabledElements: "div",
    pagedEasingFactor: 6,
    nonPagedFriction: 0.9
  }
);


// debugging -----------------------------------------------------------
var debug = true;
// create debug element
var debugDisplay = document.createElement('div');
debugDisplay.id = 'debug';
debugDisplay.style = 'position:fixed;top:0;right:0;background:#fff';
debugDisplay.innerHTML = '\
  <div id="debug-width"></div>  \
  <div id="debug-height"></div> \
  <div id="debug-page"></div>  \
  <div id="debug-position"></div>  \
  <div id="debug-state"></div>  \
  <div id="debug-time"></div>  \
';
document.body.appendChild( debugDisplay );
// grab debug elements
var debugWidth = document.getElementById('debug-width');
var debugHeight = document.getElementById('debug-height');
var debugPage = document.getElementById('debug-page');
var debugPosition = document.getElementById('debug-position');
