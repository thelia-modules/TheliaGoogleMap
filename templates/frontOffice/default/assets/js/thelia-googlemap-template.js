/**
 * Created by apenalver on 23/03/15.
 */

var theliaGoogleMapTemplate = {
    "red": {
        "featureOpts": [
            {
                stylers: [
                    {hue: '#890000'},
                    {visibility: 'simplified'},
                    {gamma: 0.5},
                    {weight: 0.5}
                ]
            },
            {
                elementType: 'labels',
                stylers: [
                    {visibility: 'off'}
                ]
            },
            {
                featureType: 'water',
                stylers: [
                    {color: '#890000'}
                ]
            }
        ],
        "styledMapOptions": {
            name: "Red Template"
        }
    },
    "blackSimple" : {
        "featureOpts": [
            {
                stylers: [
                    { "saturation": -100 },
                    { "lightness": -8 },
                    { "gamma": 1.18 }
                ]
            },
            {
                featureType: "road",
                elementType: "geometry",
                stylers: [
                    { lightness: 100 },
                    { visibility: "simplified" }
                ]
            },
            {
                featureType: "road",
                elementType: "labels",
                stylers: [
                    { visibility: "off" }
                ]
            }
        ],
        "styleMapOptions" : {
            name: "Black Template"
        }
    },
    "black" : {
        "featureOpts": [
            {
                stylers: [
                    { "saturation": -100 },
                    { "lightness": -8 },
                    { "gamma": 1.18 }
                ]
            },
            {
                featureType: "road",
                elementType: "geometry",
                stylers: [
                    { lightness: 100 },
                    { visibility: "on" }
                ]
            },
            {
                featureType: "road",
                elementType: "labels",
                stylers: [
                    { visibility: "on" }
                ]
            }
        ],
        "styleMapOptions" : {
            name: "Black Template"
        }
    }
};
