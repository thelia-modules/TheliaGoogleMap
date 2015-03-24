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
        zoom: 0,
        controls: true,
        pancontrol: true,
        zoomcontrol: true,
        scalecontrol: true,
        mousecontrol: false,
        template: "base",
        pin: null,
        showInfo: true
    };

    /**
     * Object Init
     */

    TheliaGoogleMap.prototype.optionsInit = function (options) {
        this.center = options.center;
        this.zoom = options.zoom;
        this.controls = options.controls;
        this.pancontrol = options.pancontrol;
        this.zoomcontrol = options.zoomcontrol;
        this.scalecontrol = options.scalecontrol;
        this.template = options.template;
        this.marker = options.marker;
        this.pin = options.pin;
        this.showInfo = options.showInfo;
        this.mousecontrol = options.mousecontrol;
        if (this.marker) {
            this.markersrc = options.markersrc;
        }
    };


    /**
     *  Map Init
     */

    TheliaGoogleMap.prototype.setup = function () {
        this.generateOptionMap();
        this.map = new google.maps.Map(document.getElementById(this.$element.attr("id")),
            this.mapOptions);

        if (this.template !== "base") {
            this.setTemplate();
        }

        if (this.marker) {
            if (this.markersrc) {
                this.setupMarker();
            } else {
                var marker = {
                    title: "center",
                    loc: [this.center[0], this.center[1]]
                };

                this.addMarker(marker);
            }
        }
    };

    TheliaGoogleMap.prototype.generateOptionMap = function () {
        this.mapOptions = {
            center: {lat: this.center[0], lng: this.center[1]},
            zoom: this.zoom,
            disableDefaultUI: this.controls,
            scrollwheel: this.mousecontrol
        };

        if (this.controls == false) {
            this.mapOptions.panControl = this.pancontrol;
            this.mapOptions.zoomControl = this.zoomcontrol;
            this.mapOptions.scaleControl = this.scalecontrol;
        }

        if (this.template !== "base") {
            this.mapOptions.mapTypeControlOptions = {
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

    TheliaGoogleMap.prototype.getMarkers = function () {
        var that = this;
        $.ajax({
            url: this.markersrc,
            method: "GET"
        })
            .success(function (data) {
                that.markerData = data;
                that.placeMarker();
            })
            .error(function () {
                that.handleError();
            });
    };

    TheliaGoogleMap.prototype.placeMarker = function () {
        for (var i in this.markerData) {
            var marker = this.addMarker(this.markerData[i]);

            if (this.showInfo) {
                if (!this.windowsContent) {
                    this.windowsContent = [];
                }

                if (!this.infoWindow) {
                    this.infowindow = new google.maps.InfoWindow();
                }
                this.windowsContent.push(generateInfoWindowString(this.markerData[i]));
                var that = this;
                google.maps.event.addListener(marker, 'click', (function (marker, i) {
                    return function () {

                        that.infowindow.setContent(that.windowsContent[i]);
                        that.infowindow.open(this.getMap(), marker);
                    }
                })(marker, i));

            }
        }
    };

    TheliaGoogleMap.prototype.addMarker = function (markerTab) {
        var myLatlng = new google.maps.LatLng(markerTab["loc"][0], markerTab["loc"][1]);
        var markerOpts = {
            position: myLatlng,
            map: this.map,
            title: markerTab.title
        };

        if (this.pin) {
            var image = {
                url: this.pin
            };
            markerOpts.icon = image;
        }

        return new google.maps.Marker(markerOpts);

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


    // Thelia Google Map PLUGIN DEFINITION
    // ==========================
    /**
     *
     * @param option
     * @returns {*}
     * @constructor
     */
    function Plugin(option) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('bs.theliagooglemap');
            var options = $.extend({}, TheliaGoogleMap.DEFAULTS, $this.data(), typeof option == 'object' && option);

            if (!data && options.toggle && option == 'show') option = !option;
            if (!data) $this.data('bs.theliagooglemap', (data = new TheliaGoogleMap(this, options)));
            if (typeof option == 'string') data[option]();
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

            if ($map.attr("data-mousecontrol")) {
                opts.mousecontrol = formalizeReturn($map.attr("data-mousecontrol"));
            }

            if ($map.attr("data-template")) {
                opts.template = $map.attr("data-template");
            }

            if ($map.attr("data-pin")) {
                opts.pin = $map.attr("data-pin");
            }

            if ($map.attr("data-show-info")) {
                opts.showInfo = formalizeReturn($map.attr("data-show-info"));
            }

            if ($map.attr("data-marker")) {
                opts.marker = formalizeReturn($map.attr("data-marker"));

                if ($map.attr("data-src") && opts.marker === true) {
                    opts.markersrc = $map.attr("data-src");
                }
            }


            $map.theliagooglemap(opts);
        });
    });

})(jQuery);
