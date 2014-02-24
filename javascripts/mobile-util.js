var MobileUtil = MobileUtil || {};

MobileUtil.isPortrait = false;
MobileUtil.isLandscape = false;

MobileUtil.orientation = 0;
MobileUtil.isTracking = false;
MobileUtil.orientationCallbacks = [];

MobileUtil.watchOrientation = function( callback ) {
  MobileUtil.trackOrientation();
  if( typeof callback !== 'undefined' ) MobileUtil.orientationCallbacks.push( callback );
};

MobileUtil.unwatchOrientation = function( callback ) {
  var callbackIndex = MobileUtil.orientationCallbacks.indexOf( callback );
  if( callbackIndex != -1) MobileUtil.orientationCallbacks.splice( callbackIndex, 1 );
};

MobileUtil.trackOrientation = function() {
  if (window.orientation !== undefined && !MobileUtil.isTracking) {
    MobileUtil.isTracking = true;
    // window.addEventListener('orientationchange', MobileUtil.orientationUpdated, false);
    window.addEventListener('resize', MobileUtil.orientationUpdated, false);
    MobileUtil.orientationUpdated();
  }
};

MobileUtil.orientationUpdated = function() {
  if( window.orientation !== undefined ) {
    MobileUtil.orientation = window.orientation;
    if( window.innerWidth > window.innerHeight ) {  // Math.abs( window.orientation ) % 180 === 90 || -- doesn't work for all platforms (http://www.matthewgifford.com/blog/2011/12/22/a-misconception-about-window-orientation/)
      MobileUtil.isPortrait = false;
      MobileUtil.isLandscape = true;
    } else {
      MobileUtil.isPortrait = true;
      MobileUtil.isLandscape = false;
    }
  }
  for( var i=0; i < MobileUtil.orientationCallbacks.length; i++ ) {
    MobileUtil.orientationCallbacks[i]();
  }
};

MobileUtil.lockTouchScreen = function( isLocked ) {
  if( isLocked == false ) {
    document.ontouchmove = null;
  } else {
    document.ontouchmove = function( event ) {
      event.preventDefault();
    };
  }
};

MobileUtil.hideSoftKeyboard = function() {
  document.activeElement.blur()
  $('input').blur()
};

MobileUtil.enableActivePseudoStyles = function() {
  // activates :active css on touch
  document.addEventListener("touchstart", function() {},false);
}

MobileUtil.addTouchClassToBody = function() {
  // add touch class to body on first actual touch
  var addTouchClassHandler = function() {
    document.documentElement.classList.add('touch');
    document.removeEventListener("touchstart", addTouchClassHandler);
  }
  document.addEventListener("touchstart", addTouchClassHandler,false);
}

MobileUtil.addAndroidClasses = function() {
  // adds classes for android, android 4.0+ and not-android
  var isAndroid = ( navigator.userAgent.toLowerCase().match(/android/i) ) ? true : false;
  var elem = document.documentElement;
  if( isAndroid == true ) {
    elem.className = [elem.className, 'android'].join(' ');
    // check for android 4+ so we can hardware accelerate
    var androidVersion = parseFloat( navigator.userAgent.match(/Android (\d+(?:\.\d+)+)/gi)[0].replace('Android ','') )
    if( androidVersion >= 4 ) {
      elem.className = [elem.className, 'android4plus'].join(' ');
    }
  } else {
    elem.className = [elem.className, 'not-android'].join(' ');
  }
};

MobileUtil.openNewWindow = function( href ) {
  // gets around native mobile popup blockers
  var link = document.createElement('a');
  link.setAttribute('href', href);
  link.setAttribute('target','_blank');
  var clickevent = document.createEvent('Event');
  clickevent.initEvent('click', true, false);
  link.dispatchEvent(clickevent);
  return false;
};

MobileUtil.isMobileBrowser = function() {
  var userAgent = navigator.userAgent.toLowerCase()
  if(userAgent.match(/android/i)) return true;
  if(userAgent.match(/iphone/i)) return true;
  if(userAgent.match(/ipad/i)) return true;
  if(userAgent.match(/ipod/i)) return true;
  return false;
};

MobileUtil.isIOS = function() {
  var userAgent = navigator.userAgent.toLowerCase()
  if(userAgent.match(/iphone/i)) return true;
  if(userAgent.match(/ipad/i)) return true;
  if(userAgent.match(/ipod/i)) return true;
  if(userAgent.match(/crios/i)) return true;
  return false;
};

MobileUtil.isIPhone = function() {
  var userAgent = navigator.userAgent.toLowerCase()
  if(userAgent.match(/iphone/i)) return true;
  if(userAgent.match(/ipod/i)) return true;
  return false;
};

MobileUtil.hideUrlBar = function( extraOuterElement ) {
  var userAgent = navigator.userAgent.toLowerCase()
  document.body.style.height = 'auto'; // clear previous style is re-running
  if( extraOuterElement ) extraOuterElement.style.height = 'auto';
  setTimeout(function() {
    if( MobileUtil.isIPhone() == true ) {
      document.body.style.height = (window.innerHeight + 60)+'px';
      if( extraOuterElement ) {
        extraOuterElement.style.height = (window.innerHeight + 60)+'px';
      }
      window.scroll(0,1);
    }
  }, 10);
};

MobileUtil.alertErrors = function() {
  if( !window.addEventListener ) return;
  window.addEventListener('error',function(e){
    var fileComponents = e.filename.split('/');
    var file = fileComponents[fileComponents.length-1];
    var line = e.lineno;
    var message = e.message;
    alert('ERROR\n'+'Line '+line+' in '+file+'\n'+message);
  });
};

MobileUtil.unlockWebAudioOnTouch = function() {
  window.addEventListener('touchstart', MobileUtil.playEmptyWebAudioSound, false);
};

MobileUtil.playEmptyWebAudioSound = function() {
  // originally from: http://paulbakaus.com/tutorials/html5/web-audio-on-ios/
  // create empty buffer
  var myContext = new webkitAudioContext();
  var buffer = myContext.createBuffer(1, 1, 22050);
  var source = myContext.createBufferSource();
  source.buffer = buffer;
  // connect to output (your speakers)
  source.connect(myContext.destination);
  // play the file
  source.noteOn(0);
  // clean up the event listener
  window.removeEventListener('touchstart', MobileUtil.playEmptyWebAudioSound);
};



