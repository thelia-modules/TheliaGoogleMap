# Thelia Google Map V0.1


author : Penalver Antony <apenalver@openstudio.fr>

This module allow to integrate a google map with somes options.

## 1. Installation

### Manually
* Copy the module into ```<thelia_root>/local/modules/``` directory and be sure that the name of the module is TheliaGoogleMap.
* Activate it in your thelia administration panel

Warning : You need to configure your google api keys for google maps in configuration form before to use it.<br>
To get api key follow these instructions : https://developers.google.com/maps/documentation/javascript/tutorial

## 2. Usage


Use smarty function to integrate it in you template :
{google_map id="YOUR_ID"}{/google_map}

Somes options are availables :<br>

|Options        |Type           | Description                                                               | Default
|---            |---            |---                                                                        |---
|class          | String        | Allow to change css class                                                 | theliagooglemap
|zoom           | Integer       | Allow to change base map zoom                                             | 0
|centerlat      | Float         | Used to set the latitude for base center map ( need centerLon to be set ) | 0
|centerlon      | Float         | Used to set the longitude for base center map ( need centerLat to be set )| 0
|control        | Boolean       | Used to disable default control UI                                        | false
|zoom-ctrl      | Boolean       | Used to enable zoom control UI                                            | true
|pan-ctrl       | Boolean       | Used to enable pan control UI                                             | true
|scale-ctrl     | Boolean       | Used to enable scale control UI                                           | true
|mouse-ctrl     | Boolean       | Used to enable mouse control                                              | false
|show-marker    | Boolean       | Used to enable showing markers                                            | true
|marker-src     | URL           | Used to set an url source to show mutiples markers                        | null
|template-name  | String        | Used to set a template on map                                             | base

## 3. Marker Source


To use marker source you need to respect a format.<br>
 
Json format :<br> 
```
   {
    title : "TITLE MARKER"
    loc : [ "LATITUDE" ,"LONGITUDE" ]
   }
```   

## 4. Templating

### Template list

Some template are integrate by default :

| Name | Description | Key
|---    |---    |---
|Red | Demo template describe in google map documentation : https://developers.google.com/maps/documentation/javascript/examples/maptype-styled-simple | red
|Black | Template black and white for classy map | black

### Create your own template

* 1. Create a js file 
* 2. Get theliaGoogleMapTemplate variable
* 3. Insert your template like this:
```
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
```
* 4. Insert your js file in ```main.after-javascript-include``` hook


