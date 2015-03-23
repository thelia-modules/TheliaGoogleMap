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
|show-marker    | Boolean       | Used to enable showing markers                                            | true
|marker-src     | URL           | Used to set an url source to show mutiples markers                        | null

## 3. Marker Source


To use marker source you need to respect a format.<br>
 
Json format :<br> 
```
   {
    title : "TITLE MARKER"
    loc : [ "LATITUDE" ,"LONGITUDE" ]
   }
```   
