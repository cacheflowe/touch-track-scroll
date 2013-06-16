function ButtonTouchCallback( element, callback, highlightClass ) {
  // store/set parameters/state
  this.element = element;
  this.callback = callback;
  this.highlight_class = highlightClass || null;
  this.started_touching = false;
  this.CANCEL_THRESHOLD = 3;
  this.canceled = false;
  // create touch tracker
  var self = this;
  this.touch_tracker = new MouseAndTouchTracker( this.element, function( touchState, touchEvent ) {
    self.touchUpdated( touchState, touchEvent );
  }, false, '' );
}

ButtonTouchCallback.prototype.touchUpdated = function ( touchState, touchEvent ) {
  if( touchState == MouseAndTouchTracker.state_start ) {
    if( this.highlight_class ) this.element.className = [this.element.className, this.highlight_class].join(' ');
    this.started_touching = true;
    this.canceled = false;
  }
  // cancel click if mouse/touch moves past threshold
  if( touchState == MouseAndTouchTracker.state_move ) {
    if( Math.abs( this.touch_tracker.touchmoved.x ) + Math.abs( this.touch_tracker.touchmoved.y ) >= this.CANCEL_THRESHOLD ) this.canceled = true;
    if( Math.abs( this.touch_tracker.touchspeed.x ) + Math.abs( this.touch_tracker.touchspeed.y ) >= this.CANCEL_THRESHOLD ) this.canceled = true;
    if( this.canceled && this.highlight_class ) this.element.className = this.element.className.replace(this.highlight_class, '');
  }
  if( touchState == MouseAndTouchTracker.state_end ) {
    if( this.highlight_class ) this.element.className = this.element.className.replace(this.highlight_class, '');
    // call callback method if touch didn't move past threshold
    var moveTotal = Math.abs( this.touch_tracker.touchmoved.x ) + Math.abs( this.touch_tracker.touchmoved.y );
    if( this.touch_tracker && moveTotal > this.CANCEL_THRESHOLD && this.started_touching ) this.canceled = true;
    if( this.canceled == false && this.callback ) this.callback( this.element, touchEvent );
    if( touchEvent && touchEvent.preventDefault ) touchEvent.preventDefault();
    this.started_touching = false;
  }
};

ButtonTouchCallback.prototype.deactivateHighlight = function() {
  this.highlight_class = null;
};

ButtonTouchCallback.prototype.dispose = function() {
  if( this.touch_tracker ) {
    this.touch_tracker.dispose();
  }
  delete this.touch_tracker;
  delete this.callback;
  delete this.element;
  delete this.highlight_class;
};
