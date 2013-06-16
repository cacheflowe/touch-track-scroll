var tts = tts || {};

/*
 * Requires: cursor-grab.css and jQuery if using an old browser that doesn't support element.classList
 * Adds grabby-hand cursor functionality on-demand, and handles cases for different browsers
 * Absolute paths to .cur files are needed for IE. 
 * TODO: IE might only want the .cur style def, and not want the plain css class
 */
tts.CursorHand = function( element ){
  this.element = element || document.body;
  this.is_msie = !!navigator.userAgent.toLowerCase().match(/msie/i);
  this.is_modern = (typeof this.element.classList !== "undefined") ? true : false;
}

tts.CursorHand.prototype.setDefault = function() {
  this.removeClass( 'hand' );
  this.removeClass( 'handGrab' );
};

tts.CursorHand.prototype.setHand = function() {
  this.setDefault();
  this.addClass( 'hand' );
};

tts.CursorHand.prototype.setGrabHand = function() {
  this.setDefault();
  this.addClass( 'handGrab' );
};

tts.CursorHand.prototype.addClass = function( className ) {
  if( this.is_modern )
    this.element.classList.add( className );
  else
    if($) $(this.element).addClass( className );
};

tts.CursorHand.prototype.removeClass = function( className ) {
  if( this.is_modern )
    this.element.classList.remove( className );
  else
    if($) $(this.element).removeClass( className );
};

tts.CursorHand.prototype.dispose = function(){
  this.setDefault();
  delete this.element;
  delete this.is_modern;
};

// static helper for raw MouseAndTouchTracker usage
tts.CursorHand.setCursorFromTouchTrackerState = function( touchTracker, cursor, state ) {
  switch( state ) {
    case tts.MouseAndTouchTracker.state_start :
      cursor.setGrabHand();
      break;
    case tts.MouseAndTouchTracker.state_move :
      if(touchTracker.is_touching) cursor.setGrabHand();
      break;
    case tts.MouseAndTouchTracker.state_end :
      if( touchTracker.touch_is_inside ) cursor.setHand();
      else cursor.setDefault();
      break;
    case tts.MouseAndTouchTracker.state_enter :
      if( !touchTracker.is_touching ) cursor.setHand();
      break;
    case tts.MouseAndTouchTracker.state_leave :
      if(touchTracker.is_touching) cursor.setGrabHand();
      else cursor.setDefault();
      break;
  }
};
