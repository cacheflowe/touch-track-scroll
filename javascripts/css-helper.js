var tts = tts || {};

tts.CSSHelper = function() {

  var _curVendor = tts.CSSHelper.getVendorPrefix( 'Transform' );
  var _transformsEnabled = ( _curVendor != null );
  var _transformString = _curVendor + 'Transform';
  tts.CSSHelper.transformString = _curVendor + 'Transform';
  var _transitionString = _curVendor + 'Transition';
  var _isPreAndroid4 = ( navigator.userAgent.toLowerCase().match(/android 2/i) || navigator.userAgent.toLowerCase().match(/android 3/i) ) ? true : false;
  
  var getVendor = function() {
    return _curVendor;
  };

  var getCssTransformsEnabled = function() {
    return _transformsEnabled;
  };

  var clearNativePositioning = function( element ) {
    element.style.left = '';
    element.style.top = '';
  };

  var clearTransformPositioning = function( element ) {
    element.style[ _transformString ] = '';
  };

  var clearCssTransition = function( element ) {
    element.style[ _transitionString ] = '';
  };

  var setBackfaceVisbility = function( element, hidden ) {
    hidden = hidden || 'hidden';
    element.style.backfaceVisibility = 'hidden';
    element.style[ _curVendor + 'BackfaceVisibility' ] = 'hidden';
  };

  // update css based on webkit positioning, or standard top/left css
  var update2DPosition = function ( element, x, y, scale, rot, keepTransition ) {
    if( !element ) return;
    if( keepTransition != true ) keepTransition = false;
    scale = scale || 1;
    rot = rot || 0;

    // since we're manually setting position, generally we're doing this in a frame loop, and should disable css transitions if true
    if( keepTransition == false ) clearCssTransition( element );

    if( !_transformsEnabled  || _isPreAndroid4 == true ) {
      // move element by top/left if transitions aren't supported
      element.style.left = tts.CSSHelper.roundForCSS( x ) + 'px';
      element.style.top = tts.CSSHelper.roundForCSS( y ) + 'px';
      element.style.zoom = scale;
    } else {
      // check for non-hardware-acceleration-capable androids - hardware acceleration has been fixed at 4.0+
      if( _isPreAndroid4 == true ) {
        clearTransformPositioning( element );
        // add data attr with x/y positioning since we'll be overriding what would otherwise be additive positioning between top/left and translate3d
        if(!element.getAttribute('data-pos') ) {
          element.setAttribute('data-pos',element.offsetLeft+','+element.offsetTop);
        }
        // pull original placement off stored data attr and add to current position
        pos = element.getAttribute('data-pos').split(',');
        x += parseInt(pos[0]);
        y += parseInt(pos[1]);
        element.style.left = tts.CSSHelper.roundForCSS( x ) + 'px';
        element.style.top = tts.CSSHelper.roundForCSS( y ) + 'px';

        // apply scale to inner element if we need scaling - this requires a nested element for scaling
        if( scale != 1 && element.children && element.children[0] && element.children[0].style ) {
          element.children[0].style[ _transformString ] = buildScaleTranslateString( scale );
        }
      } else {
        element.style[ _transformString ] = buildPositionTranslateString( x, y ) + buildScaleTranslateString( scale ) + buildRotationTranslateString( rot );   // element[ _transformString ] &&
      }
    }
  };

  var buildPositionTranslateString = function( x, y ) {
    return " translate3d( " + tts.CSSHelper.roundForCSS( x ) + "px, " + tts.CSSHelper.roundForCSS( y ) + "px, 0px )";
  };

  var buildScaleTranslateString = function( deg ) {
    return " scale( " + tts.CSSHelper.roundForCSS( deg ) + " )";
  };

  var buildRotationTranslateString = function( deg ) {
    return " rotate( " + tts.CSSHelper.roundForCSS( deg ) + "deg )";
  };

  return {
    update2DPosition : update2DPosition,
    getVendor: getVendor,
    getCssTransformsEnabled : getCssTransformsEnabled,
    setBackfaceVisbility : setBackfaceVisbility
  };
};

// this should really only be called once
tts.CSSHelper.getVendorPrefix = function( styleSuffix ) {

  // see if the major browser vendor prefixes are detected for css transforms
  var checkVendor = function() {
    if(!navigator.userAgent.toLowerCase().match(/msie 9/i)){
      var vendors = ['Moz', 'Webkit', 'ms'];  // should have 'ms' also, but IE9 transform doesn't work, even though it claims to exist. so, we leave it out
      var element = findElementWithStyle();
      for( var vendor in vendors ) {
        if( element.style[ vendors[vendor] + styleSuffix ] !== undefined ) {
          return vendors[vendor];
        }
      }
      return null;
    }
  };

  // find & return a legit element with style
  var findElementWithStyle = function () {
    var bodyChildren = document.body.childNodes;
    for( var child in bodyChildren ) {
      if( typeof bodyChildren[child].style !== 'undefined' ) {
        return bodyChildren[child];
      }
    }
  }

  return checkVendor();
};

// round down to 2 decimel places for smaller css strings
tts.CSSHelper.roundForCSS = function( number ) {
  var multiplier = Math.pow( 10, 2 );
  return Math.round( number * multiplier ) / multiplier;
};

