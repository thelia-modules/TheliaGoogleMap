/**
 * Created by apenalver on 19/03/15.
 */

(function ($) {
    "use strict";

    var TheliaGoogleMap = function (element, options) {
        this.$element = $(element);
        this.optionsInit(options);
        this.setup();
    };

    TheliaGoogleMap.DEFAULTS = {
        center: [0, 0],
        address: null,
        zoom: 0,
        controls: true,
        pancontrol: true,
        zoomcontrol: true,
        scalecontrol: true,
        mousecontrol: false,
        overviewmapcontrol:false,
        streetviewcontrol: true,
        maptypecontrol: true,
        template: "base",
        pin: null,
        showInfo: true,
        clustered: false,
        markersrcrefresh: false,
        markersrcrefreshttl: 300,
        refreshtimer: null,
        geoCodeErrorCallBack: function(status) {
            console.log("Geocode was not successful for the following reason: " + status);
        },
        clusterOptionsCallback: function() {
            return {};
        }
    };

    /**
     * Object Init
     */

    TheliaGoogleMap.prototype.optionsInit = function (options) {
        this.center = options.center;
        this.address = options.address;
        this.zoom = options.zoom;
        this.controls = options.controls;
        this.pancontrol = options.pancontrol;
        this.zoomcontrol = options.zoomcontrol;
        this.scalecontrol = options.scalecontrol;
        this.maptypecontrol = options.maptypecontrol;
        this.streetviewcontrol = options.streetviewcontrol;
        this.overviewmapcontrol = options.overviewmapcontrol;
        this.template = options.template;
        this.marker = options.marker;
        this.markers = [];
        this.markersData = [];
        this.windowsContent = [];
        this.pin = options.pin;
        this.showInfo = options.showInfo;
        this.mousecontrol = options.mousecontrol;
        this.clustered = options.clustered;
        this.clusterOptionsCallback = options.clusterOptionsCallback;
        this.geoCodeErrorCallBack = options.geoCodeErrorCallBack;
        if (this.marker) {
            this.markersrc = options.markersrc;
            this.markersrcrefresh = options.markersrcrefresh;
            this.markersrcrefreshttl = options.markersrcrefreshttl;
        }
    };


    /**
     *  Map Init
     */
    TheliaGoogleMap.prototype.setup = function () {
        var that = this;
        if (this.address) {
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({address: this.address}, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {

                    that.center = results[0].geometry.location;
                    generateMap(that);

                } else {
                    that.geoCodeErrorCallBack(status);
                }
            });
        } else {
            this.center = {lat: this.center[0], lng: this.center[1]};
            generateMap(this);
        }
    };

    var generateMap = function (object) {

        var that = object;

        object.generateOptionMap();

        object.map = new google.maps.Map(document.getElementById(object.$element.attr("id")),
            object.mapOptions);

        if (object.template !== "base") {
            object.setTemplate();
        }

        if (object.marker) {
            if (object.markersrc) {
                if (object.markersrcrefresh) {
                    google.maps.event.addListener(object.map, 'zoom_changed', function () {
                        that.refreshMarkers();
                    });
                    google.maps.event.addListener(object.map, 'bounds_changed', function () {
                        that.refreshMarkers();
                    });
                } else {
                    google.maps.event.addListenerOnce(object.map, 'idle', function () {
                        that.setupMarker();
                    });
                }
            } else {
                var marker = {
                    title: "center",
                    loc: object.center
                };

                object.addMarkerFromLatLn(marker);
            }

            if (object.clustered) {
                var clusterOptions = that.clusterOptionsCallback();
                object.cluster = new MarkerClusterer(object.map, [], clusterOptions);
            }
        }
    };


    TheliaGoogleMap.prototype.generateOptionMap = function () {
        this.mapOptions = {
            center: this.center,
            zoom: this.zoom,
            disableDefaultUI: this.controls,
            scrollwheel: this.mousecontrol
        };

        if (this.controls == false) {
            this.mapOptions.panControl = this.pancontrol;
            this.mapOptions.zoomControl = this.zoomcontrol;
            this.mapOptions.scaleControl = this.scalecontrol;
            this.mapOptions.streetViewControl = this.streetviewcontrol;
            this.mapOptions.mapTypeControl = this.maptypecontrol;
            this.mapOptions.overviewMapControl = this.overviewmapcontrol;
        }

        if (this.template !== "base") {
            this.mapOptions.maptypecontrolOptions = {
                mapTypeIds: [google.maps.MapTypeId.ROADMAP, this.template + this.$element.attr("id")]
            };
            this.mapOptions.mapTypeId = this.template + this.$element.attr("id");
        }

    };

    TheliaGoogleMap.prototype.setTemplate = function () {
        var featureOpts = theliaGoogleMapTemplate[this.template]["featureOpts"];
        var styledMapOptions = theliaGoogleMapTemplate[this.template]["styledMapOptions"];

        var customMapType = new google.maps.StyledMapType(featureOpts, styledMapOptions);

        this.map.mapTypes.set(this.template + this.$element.attr("id"), customMapType);
    };

    /**
     * Marker
     */

    TheliaGoogleMap.prototype.setupMarker = function () {
        this.getMarkers();
    };

    TheliaGoogleMap.prototype.refreshMarkers = function () {
        var that = this;

        if (that.refreshtimer != null) {
            clearTimeout(that.refreshtimer);
        }

        that.refreshtimer = setTimeout(function(){ that.setupMarker(); }, that.markersrcrefreshttl);
    };

    TheliaGoogleMap.prototype.getMarkerData = function (id) {

        for (var i in this.markersData) {
            if (this.markersData[i].id == id) {
                return this.markersData[i];
            }
        }

        return null;
    };

    TheliaGoogleMap.prototype.getMarkers = function () {
        var that = this;
        var bounds = that.map.getBounds();
        var data = {
            'north': bounds.getNorthEast().lat(),
            'east': bounds.getNorthEast().lng(),
            'south': bounds.getSouthWest().lat(),
            'west': bounds.getSouthWest().lng()
        };

        $.ajax({
            url: this.markersrc,
            method: "GET",
            data: data
        })
            .success(function (data) {
                that.placeMarker(data);
            })
            .error(function () {
                that.handleError();
            });
    };

    TheliaGoogleMap.prototype.placeMarker = function (markersData) {

        var markerData = null;

        for (var i in markersData) {

            markerData = this.getMarkerData(markersData[i].id);

            if (markerData == null) {
                this.markersData.push(markersData[i]);

                var marker = this.addMarker(markersData[i]);

                this.markers.push(marker);

                if (this.showInfo) {
                    this.addInfoWindow(marker, this.markersData.length - 1);
                }
            }
        }

    };


    TheliaGoogleMap.prototype.addMarker = function (markerTab) {
        var myLatlng = new google.maps.LatLng(markerTab["loc"][0], markerTab["loc"][1]);

        var markerOpts = {
            position: myLatlng,
            title: markerTab.title
        };

        if (this.pin) {
            var image = { url: this.pin };
            markerOpts.icon = image;
        }

        var marker = new google.maps.Marker(markerOpts);

        if ( ! this.clustered) {
            marker.setMap(this.map);
        } else {
            this.cluster.addMarker(marker);
        }

        return marker;
    };


    TheliaGoogleMap.prototype.addMarkerFromLatLn = function (markerTab) {
        var markerOpts = {
            position: markerTab["loc"],
            map: this.map,
            title: markerTab.title
        };

        if (this.pin) {
            var image = {
                url: this.pin
            };
            markerOpts.icon = image;
        }

        var marker = new google.maps.Marker(markerOpts);

        this.markers.push(marker);

        return marker;
    };

    TheliaGoogleMap.prototype.removeMarkers = function () {
        if ( ! this.clustered) {
            for (var i in this.markers) {
                this.markers[i].setMap(null);
            }
        } else {
            this.cluster.clearMarkers();
        }
    };

    TheliaGoogleMap.prototype.addInfoWindow = function (marker, i) {

        if (!this.infoWindow) {
            this.infowindow = new google.maps.InfoWindow();
        }
        this.windowsContent.push(generateInfoWindowString(this.markersData[i]));
        var that = this;
        google.maps.event.addListener(marker, 'click', (function (marker, i) {
            return function () {
                that.$element.trigger("click-marker",[that.markersData[i],that.windowsContent[i]]);
                that.infowindow.setContent(that.windowsContent[i]);
                that.infowindow.open(this.getMap(), marker);
            }
        })(marker, i));
    };

    function generateInfoWindowString(marker) {
        var infoWindow = '<div class="thelia-google-map-info-window">' +

            '<div class="thelia-google-map-title">' + marker.title + '</div>';
        if (marker.info) {
            infoWindow += '<div class="thelia-google-map-info">' + marker.info + '</div>';
        }

        if (marker.description) {
            infoWindow += '<div class="thelia-google-map-descp">' + marker.description + '</div>';
        }

        if (marker.link) {
            infoWindow += '<a class="thelia-google-map-link" href="' + marker.link + '">' + marker["link-label"] + '</a>';
        }

        infoWindow += "</div>";

        return infoWindow;
    }

    /**
     * ERROR HANDLER
     */

    TheliaGoogleMap.prototype.handleError = function () {

    };

    /**
     *  Actions
     */

    TheliaGoogleMap.prototype.reload = function(){
        this.setup();
    };

    TheliaGoogleMap.prototype.search = function(address){
        var geocoder = new google.maps.Geocoder();
        var that = this;
        geocoder.geocode({address: address}, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                var center = results[0].geometry.location;
                that.map.setCenter(center);
            } else {
                that.geoCodeErrorCallBack(status);
            }
        });
    };


    // Thelia Google Map PLUGIN DEFINITION
    // ==========================
    /**
     *
     * @param option
     * @returns {*}
     * @constructor
     */
    function Plugin(option,action) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('bs.theliagooglemap');
            var options = $.extend({}, TheliaGoogleMap.DEFAULTS, $this.data(), typeof option == 'object' && option);

            if (!data && options.toggle && option == 'show') option = !option;
            if (!data) $this.data('bs.theliagooglemap', (data = new TheliaGoogleMap(this, options)));
            if (typeof option == 'string') data[option](action);
        });
    }

    var old = $.fn.collapse;

    $.fn.theliagooglemap = Plugin;
    $.fn.theliagooglemap.Constructor = TheliaGoogleMap;


    // Thelia Google Map NO CONFLICT
    // ====================

    $.fn.theliagooglemap.noConflict = function () {
        $.fn.theliagooglemap = old;
        return this;
    };


    // Thelia Google Map PLUGIN INIT
    // ==========================

    function formalizeReturn(string) {
        if (string === 0 || string === "false" || string === "0" || string === false) {
            return false;
        } else {
            return true;
        }
    }

    $(window).on("load", function () {
        $('[data-element="thelia-google-map"]').each(function () {
            var $map = $(this);

            var opts = [];

            if ($map.attr("data-zoom")) {
                opts.zoom = parseInt($map.attr("data-zoom"));
            }

            if ($map.attr("data-center")) {
                var str = $map.attr("data-center");
                var center = str.split(",");
                if (center.length > 1) {
                    center[0] = parseFloat(center[0]);
                    center[1] = parseFloat(center[1]);
                    opts.center = center;
                }
            }

            if ($map.attr("data-control")) {
                opts.controls = formalizeReturn($map.attr("data-control"));

            }

            if ($map.attr("data-pancontrol")) {
                opts.pancontrol = formalizeReturn($map.attr("data-pancontrol"));
            }

            if ($map.attr("data-zoomcontrol")) {
                opts.zoomcontrol = formalizeReturn($map.attr("data-zoomcontrol"));
            }

            if ($map.attr("data-scalecontrol")) {
                opts.scalecontrol = formalizeReturn($map.attr("data-scalecontrol"));
            }

            if ($map.attr("data-maptypecontrol")) {
                opts.scalecontrol = formalizeReturn($map.attr("data-maptypecontrol"));
            }

            if ($map.attr("data-streetviewcontrol")) {
                opts.streetviewcontrol = formalizeReturn($map.attr("data-streetviewcontrol"));
            }

            if ($map.attr("data-overviewmapcontrol")) {
                opts.overviewmapcontrol = formalizeReturn($map.attr("data-overviewmapcontrol"));
            }

            if ($map.attr("data-mousecontrol")) {
                opts.mousecontrol = formalizeReturn($map.attr("data-mousecontrol"));
            }

            if ($map.attr("data-cluster")) {
                opts.clustered = formalizeReturn($map.attr("data-cluster"));
                if (opts.clustered) {
                    if ($map.attr("data-cluster-options-callback") && $.isFunction(window[$map.attr("data-cluster-options-callback")])) {
                        opts.clusterOptionsCallback = window[$map.attr("data-cluster-options-callback")];
                    }
                }
            }

            if ($map.attr("data-template")) {
                opts.template = $map.attr("data-template");
            }

            if ($map.attr("data-address")) {
                opts.address = $map.attr("data-address");
            }

            if ($map.attr("data-pin")) {
                opts.pin = $map.attr("data-pin");
            }

            if ($map.attr("data-show-info")) {
                opts.showInfo = formalizeReturn($map.attr("data-show-info"));
            }

            if ($map.attr("data-geocoder-error-callback") && $.isFunction(window[$map.attr("data-geocoder-error-callback")])) {
                opts.geoCodeErrorCallBack = window[$map.attr("data-geocoder-error-callback")];
            }

            if ($map.attr("data-marker")) {
                opts.marker = formalizeReturn($map.attr("data-marker"));

                if ($map.attr("data-src") && opts.marker === true) {
                    opts.markersrc = $map.attr("data-src");
                }

                if ($map.attr("data-src-refresh") && opts.marker === true) {
                    opts.markersrcrefresh = formalizeReturn($map.attr("data-src-refresh"));
                }

                if ($map.attr("data-src-refresh-ttl") && opts.marker === true) {
                    opts.markersrcrefreshttl = formalizeReturn($map.attr("data-src-refresh-ttl"));
                }
            }

            $map.theliagooglemap(opts);
        });
    });

})(jQuery);
