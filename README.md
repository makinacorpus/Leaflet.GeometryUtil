Leaflet.GeometryUtil
====================

[![Build Status](https://travis-ci.org/makinacorpus/Leaflet.GeometryUtil.png?branch=master)](https://travis-ci.org/makinacorpus/Leaflet.GeometryUtil)

* Tested with stable Leaflet 0.7.0

Usage
-----

Check out [online documentation](http://makinacorpus.github.io/Leaflet.GeometryUtil/).


Development
-----------

### Running tests in command-line

* Install [nodejs](http://nodejs.org) and [phantomjs](http://phantomjs.org)

```
    sudo apt-get install nodejs phantomjs
```

* Ready !

```
    make test
```

Changelog
---------
### master ###

* Nothing changed yet.

### 0.3.2 ###

* Use a soft dependency for Leaflet (thanks Erik Escoffier)

### 0.3.1 ###

* Make sure interpolateOnLine() always returns a L.LatLng object (thanks Justin Manley)

### 0.3.0 ###

* Added UMD style initialization (thanks @PerLiedman)
* Added readable distance (thanks @Mylen)
* Fix side effects on latlngs with `closest()` (thanks @AndrewIngram)

### 0.2.0 ###

* Locate point on line
* Rotate point around center
* Fixed bug if closest point was on last segment

### 0.1.0 ###

* Line subpart extraction
* Line lengths
* Angle and slope computation
* Line reverse
* Line interpolation

### 0.0.1 ###

* Initial working version


License
-------

* BSD New


Authors
-------

* [Benjamin Becquet](https://github.com/bbecquet)
* [Mathieu Leplatre](https://github.com/leplatrem)
* [Simon Thépot](https://github.com/djcoin)
* [Nhinze](https://github.com/nhinze)
* [Frédéric Bonifas](https://github.com/fredericbonifas)
* [Alexander Melard](https://github.com/mylen)

[![Makina Corpus](http://depot.makina-corpus.org/public/logo.gif)](http://makinacorpus.com)
