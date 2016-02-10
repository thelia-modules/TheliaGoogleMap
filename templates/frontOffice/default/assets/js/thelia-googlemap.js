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
        clusterGridWidth: 10,
        clusterGridHeight: 10,
        pincluster: null,
        geoCodeErrorCallBack:function(status){
            console.log("Geocode was not successful for the following reason: " + status);
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
        this.pin = options.pin;
        this.showInfo = options.showInfo;
        this.mousecontrol = options.mousecontrol;
        this.clustered = options.clustered;
        this.clusterGridWidth = options.clusterGridWidth;
        this.clusterGridHeight = options.clusterGridHeight;
        this.pincluster = options.pincluster;
        this.geoCodeErrorCallBack = options.geoCodeErrorCallBack;
        if (this.marker) {
            this.markersrc = options.markersrc;
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
        object.generateOptionMap();
        object.map = new google.maps.Map(document.getElementById(object.$element.attr("id")),
            object.mapOptions);

        if (object.template !== "base") {
            object.setTemplate();
        }

        if (object.marker) {
            if (object.markersrc) {
                object.setupMarker();
            } else {
                var marker = {
                    title: "center",
                    loc: object.center
                };

                object.addMarkerFromLatLn(marker);
            }

            if (object.clustered) {
                var that = object;
                google.maps.event.addListener(object.map, 'zoom_changed', function () {
                    that.placeClusteredMarker();
                });
                google.maps.event.addListener(object.map, 'bounds_changed', function () {
                    that.placeClusteredMarker();
                });
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

        if (this.clustered) {
            this.placeClusteredMarker();
        } else {
            if (this.markers) {
                this.removeMarkers();
            }
            this.markers = [];
            this.windowsContent = [];

            for (var i in this.markerData) {
                var marker = this.addMarker(this.markerData[i]);

                if (this.showInfo) {
                    this.addInfoWindow(marker, i);
                }
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

        var marker = new google.maps.Marker(markerOpts);

        this.markers.push(marker);

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
    }


    TheliaGoogleMap.prototype.placeClusteredMarker = function () {
        if (this.markers) {
            this.removeMarkers();
        }
        this.markers = [];
        this.markersClustered = [];
        this.windowsContent = [];

        // Délimitation de la map
        var mapBounds = this.map.getBounds();
        // coordonnées SW de la map (sur la taille du div id = "map")
        var sw = mapBounds.getSouthWest();
        // coordonnées NE de la map (sur la taille du div id = "map")
        var ne = mapBounds.getNorthEast();
        // Size est une aire représentant les dimensions du rectangle de la map en degrés
        var size = mapBounds.toSpan(); //retourne un objet GLatLng

        // créé une cellule de 10x10 pour constituer notre "grille"
        // les cellules de cette grille sont ici affichées en bleu
        var gridWidth = this.clusterGridWidth;
        var gridHeight = this.clusterGridHeight;

        var gridCellSizeLat = size.lat() / gridWidth;
        var gridCellSizeLng = size.lng() / gridHeight;
        // cellGrid représente un tableau qui contiendra l'ensemble
        // des cellules dans lesquelles se trouveront des points
        // - dans notre exemple, nous aurons 19 cellules (rectangles bleus)
        this.cellGrid = [];

        //Parcourt l'ensemble des points et les assigne à la cellule concernée
        for (var k in this.markerData) {
            var latlng = new google.maps.LatLng(this.markerData[k]["loc"][0], this.markerData[k]["loc"][1]);

            // on vérifie si le point appartient à notre zone
            // la zone correspond à la map totale affichée
            // si le point n'appartient pas la map en cours on passe au point siuvant
            if (!mapBounds.contains(latlng)) continue;

            // On créé un rectangle temporaire en fonction des coordonnées
            // du point et de celles de la map afin d'obtenir notre cellule (cell)
            var testBounds = new google.maps.LatLngBounds(sw, latlng);
            var testSize = testBounds.toSpan();
            var i = Math.ceil(testSize.lat() / gridCellSizeLat);
            var j = Math.ceil(testSize.lng() / gridCellSizeLng);
            // cell peut être comparée à une case d'échiquier
            var cell = [i, j];

            // Si cette case (cellule) n'a pas encore été créée (undefined)
            // on l'ajoute à notre grille ( = tableau de cellules = échiquier)
            if (typeof this.cellGrid[cell] == 'undefined') {

                var lat_cellSW = sw.lat() + ((i - 1) * gridCellSizeLat);
                var lng_cellSW = sw.lng() + ((j - 1) * gridCellSizeLng);
                // coordonnées sud-ouest de notre cellule
                var cellSW = new google.maps.LatLng(lat_cellSW, lng_cellSW);

                var lat_cellNE = cellSW.lat() + gridCellSizeLat
                var lng_cellNE = cellSW.lng() + gridCellSizeLng;
                // coordonnées nord-est de notre cellule
                var cellNE = new google.maps.LatLng(lat_cellNE, lng_cellNE);

                // Déclaration de la cellule et de ses propriétés (cluster ou non, points ...)
                this.cellGrid[cell] = {
                    GLatLngBounds: new google.maps.LatLngBounds(cellSW, cellNE),
                    cluster: false,
                    markers: [], lt: [], lg: [], titre: [], adresse: [], image: [], data: [],
                    length: 0
                };
            }

            // augmentation du nombre de cellules sur la grille ( = 1 cellule en plus)
            this.cellGrid[cell].length++;

            // augmentation du nombre de cellules sur la grille ( = 1 cellule en plus)
            this.cellGrid[cell].length++;

            // Si la cellule contient au moins 2 points, nous décidons ici
            // que les markers seront clustérisés pour cette cellule
            if (this.cellGrid[cell].markers.length > 1)
            // On passe alors à true la propriété cluster de la cellule
                this.cellGrid[cell].cluster = true;

            // On lui renseigne ensuite les propriétés du point concerné
            this.cellGrid[cell].lt.push(this.markerData[k].lat);
            this.cellGrid[cell].lg.push(this.markerData[k].lng);
            this.cellGrid[cell].markers.push(latlng);
            this.cellGrid[cell].titre.push(this.markerData[k].title);
            this.cellGrid[cell].data.push(this.markerData[k]);
        }

        // On parcourt l'ensemble des cellules de notre grille (cases de l'échiquier)
        for (var k in this.cellGrid) {
            // Si les markers de la cellule doivent apparaître sous forme de cluster
            if (this.cellGrid[k].cluster == true) {
                // création d'un marker au centre de la cellule
                var span = this.cellGrid[k].GLatLngBounds.toSpan();
                var sw = this.cellGrid[k].GLatLngBounds.getSouthWest();
                var swLAT_span = 0;
                var swLNG_span = 0;

                for (var i in this.cellGrid[k].markers) {
                    swLAT_span += this.cellGrid[k].markers[i].lat();
                    swLNG_span += this.cellGrid[k].markers[i].lng();
                }

                swLAT_span = swLAT_span / this.cellGrid[k].markers.length;
                swLNG_span = swLNG_span / this.cellGrid[k].markers.length;

                var markerOpts = {
                    position: new google.maps.LatLng(swLAT_span, swLNG_span),
                    map: this.map,
                    title: this.cellGrid[k].titre[0]
                };

                if (this.pincluster) {
                    var image = {
                        url: this.pincluster
                    };
                    markerOpts.icon = image;
                }

                var marker = new google.maps.Marker(markerOpts);
                google.maps.event.addListener(marker, 'click', (function (marker, i) {
                    var thismap = this.getMap();
                    thismap.setZoom(thismap.getZoom() + 2);
                    thismap.panTo(marker.latLng);
                }));
                this.markersClustered.push(marker);
            } else {
                // Sinon, création d'un marker simple
                for (var i in this.cellGrid[k].markers) {
                    var markerOpts = {
                        position: this.cellGrid[k].markers[i],
                        map: this.map,
                        title: this.cellGrid[k].titre[i]
                    };

                    if (this.pin) {
                        var image = {
                            url: this.pin
                        };
                        markerOpts.icon = image;
                    }

                    var marker = new google.maps.Marker(markerOpts);

                    this.markers.push(marker);
                    if (this.showInfo) {
                        this.addClusteredInfoWindow(marker, k, this.cellGrid[k].data[i]);
                    }
                }

            }
        }

    };

    TheliaGoogleMap.prototype.addClusteredInfoWindow = function (marker, i, data) {
        if (!this.infoWindow) {
            this.infowindow = new google.maps.InfoWindow();
        }
        this.windowsContent[i] = (generateInfoWindowString(data));
        var that = this;
        google.maps.event.addListener(marker, 'click', (function (marker, i) {
            return function () {
                that.$element.trigger("click-marker",[that.markerData[i],that.windowsContent[i]]);
                that.infowindow.setContent(that.windowsContent[i]);
                that.infowindow.open(this.getMap(), marker);
            }
        })(marker, i));

    };

    TheliaGoogleMap.prototype.removeMarkers = function () {
        for (var i in this.markers) {
            this.markers[i].setMap(null);
        }

        for (var i in this.markersClustered) {
            this.markersClustered[i].setMap(null);
        }
    };


    TheliaGoogleMap.prototype.addInfoWindow = function (marker, i) {

        if (!this.infoWindow) {
            this.infowindow = new google.maps.InfoWindow();
        }
        this.windowsContent[i] = (generateInfoWindowString(this.markerData[i]));
        var that = this;
        google.maps.event.addListener(marker, 'click', (function (marker, i) {
            return function () {
                that.$element.trigger("click-marker",[that.markerData[i],that.windowsContent[i]]);
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
                    if ($map.attr("data-cluster-grid-width")) {
                        opts.clusterGridWidth = parseInt($map.attr("data-cluster-grid-width"));
                    }
                    if ($map.attr("data-cluster-grid-height")) {
                        opts.clusterGridHeight = parseInt($map.attr("data-cluster-grid-height"));
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

            if ($map.attr("data-cluster-pin")) {
                opts.pincluster = $map.attr("data-cluster-pin");
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
            }


            $map.theliagooglemap(opts);
        });
    });

})(jQuery);
