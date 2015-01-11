### Touch Track Scroll
A cross-platform, cross-input (mouse & touch), hardware-accelerated, responsive scrolling HTML5 container.

Check out the [demo](http://cacheflowe.github.io/touch-track-scroll/).

#### TODO
* Handle window resize - make sure scroller resets page & size
* Unbind when possible for fewer listeners
* Write some documentation
* Add arrows to demo
* Add more demos showing off the other features
* Merge recurseDisableElements and add statically to TouchTracker, with ability to reset disabled elements
* Re-test on IEs
* Re-test Android 2.x
* Remove unused code from TouchScroller

   @$wn.on('touchmove', (e) =>
     if @$wn.pageYOffset isnt 0
       return false
   )