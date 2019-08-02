// function setMapOnAll(map) {
//     for (var i = 0; i < markers.length; i++) {
//         markers[i].setMap(map);
//     }
// }

// // Removes the markers from the map, but keeps them in the array.
// function clearMarkers() {
//     setMapOnAll(null);
// }

// // Shows any markers currently in the array.
// function showMarkers() {
//     setMapOnAll(map);
// }

// // Deletes all markers in the array by removing references to them.
// function deleteMarkers() {
//     clearMarkers();
//     markers = [];
// }

// function drawPath(start, end, csvData){
//     var startpoint = parseInt(start);
//     var endpoint = parseInt(end);
//     var wheelchairPath = [];
//     for(i=startpoint; i<endpoint; i++){
//         // console.log(startpoint, endpoint)
//         var point = csvData[i];
//         latlng = new google.maps.LatLng(point.latitude, point.longitude);
//         wheelchairPath.push(latlng);
//     }
//     drawPolyLine(wheelchairPath);
// }

// //Draw path function Google Maps
// function drawPolyLine(wheelchairPath) {
//     path = new google.maps.Polyline({
//         path: wheelchairPath,
//         geodesic: true,
//         strokeColor: "#000000",
//         strokeOpacity: 1.0,
//         strokeWeight: 10
//     })
//     path.setMap(map);

//     // on mouse over activates a function

//     path.addListener('mouseover', function (args) {

//         //returns the lat and lng of the current position of the polygon
//         console.log('latlng', args.latLng.lat());
//         addMarker(args.latLng,"points");
        
//         //need to compare the latlng to the database and generate which position the marker is currently at???

//     });

//     path.addListener('mouseout', function (args) {

//         //returns the lat and lng of the current position of the polygon
//         marker.setMap(null);
//         //need to compare the latlng to the database and generate which position the marker is currently at???

//     });
    
// }

// function drawMarkers(start, end, csvData){
//     for(i=parseInt(start); i<parseInt(end); i++){
//         var point = csvData[i];
//         latlng = new google.maps.LatLng(point.latitude, point.longitude);
//         // console.log(latlng)
//         name = point.Name;
//         addMarker(latlng, name);
//     }
// }


//Google Maps Init, centered at Swinburne hawthorn
var map; 
var markers = [];
var paths = [];

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -37.819344, lng: 145.040506 },
        zoom: 16,
        mapTypeControl: false
    });
}

//Add marker function Google Maps
function addMarker(myLatLng, name) {
    marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        title: name
    });
    markers.push(marker);
}

function removeSpeedPaths(){
    for(i=0;i<paths.length;i++){
        paths[i].setVisible(false)
    }
}



function drawSpeedPath_2(start, end, csvData){
    var startpoint = parseInt(start);
    var endpoint = parseInt(end);

    for(i=startpoint;i<endpoint;i++){
        var point = new google.maps.LatLng(csvData[i].latitude, csvData[i].longitude);
        var point2 = new google.maps.LatLng(csvData[i+1].latitude, csvData[i+1].longitude);

        var speed = distance(point.lat(), point.lng(), point2.lat(), point.lng(), "K")/(1/600);
        // console.log(speed)
        
        path = new google.maps.Polyline({
            path: [point, point2],
            geodesic: true,
            strokeColor: 'black',
            strokeOpacity: 1,
            strokeWeight: 0,
            map:map
        })
        paths.push(path);
    }
}

function max_min(startpoint, endpoint,csvData)
{
    let speed_array = [];
    for(i=startpoint;i<endpoint;i++)
    {
        var point = new google.maps.LatLng(csvData[i].latitude, csvData[i].longitude);
        var point2 = new google.maps.LatLng(csvData[i+1].latitude, csvData[i+1].longitude);
        var speed = distance(point.lat(), point.lng(), point2.lat(), point.lng(), "K")/(1/600);
        speed_array.push(speed);
    }
    return Math.max(...speed_array);
    
}


//might be useful to denote something else 
//super impose on top of something
var lineSymbol = {
    path: 'M 1,0 0,0',
    strokeOpacity: 1,
    scale: 4
  };


function drawSpeedPath(start, end, csvData){
    var startpoint = parseInt(start)
    var endpoint = parseInt(end)
    
    //get max_speed
    let max = max_min(startpoint, endpoint,csvData);
    


    for(i=startpoint;i<endpoint;i++){
        var point = new google.maps.LatLng(csvData[i].latitude, csvData[i].longitude);
        var point2 = new google.maps.LatLng(csvData[i+1].latitude, csvData[i+1].longitude);

        var speed = distance(point.lat(), point.lng(), point2.lat(), point.lng(), "K")/(1/600);
      //  speed_array.push(speed);
             
        
        path = new google.maps.Polyline({
            path: [point, point2],
            geodesic: true,
            strokeColor:getColorForSpeed(speed,max),
            strokeOpacity: 1.0,
            icons: [{
                icon: lineSymbol,
                offset: '0',
                repeat: '10px'
              }],
    
            map:map
        })
        paths.push(path);
    }
   // console.log("Max "+Math.max(...speed_array));
   // console.log("Min "+Math.min(...speed_array));
}


function getColorForSpeed(speed,max){
    /*if(speed<10)
        return "purple";
    else if(speed<20)
        return "blue";
    else if(speed<30)
        return "green";
    else if(speed<40)
        return "yellow"
    else if(speed<50)
        return "orange"
    else
        return "red"*/
    
    let firs = 32/max;
    let sec = 179/max;
    let thir=  172/max;

    let val1 = 222+firs*speed;
    let val2 = 45+sec*speed;
    let val3 = 38+thir*speed;
    let return_val = "rgb("+val1+","+val2+","+val3+")";
    return return_val;
}

function distance(lat1, lon1, lat2, lon2, unit) {
    if ((lat1 == lat2) && (lon1 == lon2)) {
        return 0;
    }
    else {
        var radlat1 = Math.PI * lat1/180;
        var radlat2 = Math.PI * lat2/180;
        var theta = lon1-lon2;
        var radtheta = Math.PI * theta/180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180/Math.PI;
        dist = dist * 60 * 1.1515;
        if (unit=="K") { dist = dist * 1.609344 }
        if (unit=="N") { dist = dist * 0.8684 }
        // console.log(dist)
        return dist;
    }
}

window.onload = function(){
    var csvData;
    $.get("dataprototype/GPSData.csv", function (data) {
        csvData = $.csv.toObjects(data);
        console.log(csvData);
        var min = 0;
        var max = 50;

        //50 Markers from data
        // drawMarkers(min, max, csvData);
        // console.log(markers)

        drawSpeedPath(min, max, csvData)
       
   
        //slider function
        $("#slider-range").slider({
            range: true,
            min: min,
            max: max-1,
            values: [min, max],
            slide: function( event, ui ) {
                // $("#datapoint").val( "Point: " + (ui.values[0]+1) + " - Point: " + (ui.values[1]+1) );
                document.getElementById("datapoint").innerHTML = "Point: " + (ui.values[0]+1) + " - Point: " + (ui.values[1]+1)

                //delete speed paths
                removeSpeedPaths();
                //draw speed paths
                drawSpeedPath(ui.values[0], ui.values[1], csvData);

            }
        });

        //Default values
        $("#datapoint").val("Point: " + ($("#slider-range").slider("values", 0)+1) + " - Point: " + ($("#slider-range").slider("values", 1)+1));
      
    })

}

//navigation functions
var sidenav_button = false;
function sidenav() {
    if (sidenav_button == true) {
        document.getElementById("header").style.width = "100%";
        document.getElementById("sidebar").style.width = "0";
        document.getElementById("homepage").style.display = "none";
        
        //should change css of the side nav, display 0 and add transition
        sidenav_button = false;
    }
    else {
        document.getElementById("header").style.width = "80%";
        document.getElementById("sidebar").style.width = "300px";
        document.getElementById("homepage").style.display = "block";
        sidenav_button = true;
    }
}

function homepage() {
    if (sidenav_button == true) {
        document.getElementById("homepage").style.display = "block";
        document.getElementById("data").style.display = "none";
    }

}

function data() {
    if (sidenav_button == true) {
        document.getElementById("homepage").style.display = "none";
        document.getElementById("data").style.display = "block";
    }
}

function About() {
    document.getElementById("About").style.display = "block";
}

function Help() {
    document.getElementById("Help").style.display = "block";
}

function Import()
{
    document.getElementById("Import").style.display ="block";
}

//function for login form 
var login_modal = () =>{document.getElementById("Login").style.display ="block"};



function tryout()
{
    fetch('newfile.txt')
    .then(
    function(response) {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' +
          response.status);
        return;
      }
      return response.text();
    })
    .then(function(text){
        console.log(text)
    })
  .catch(function(err) {
    console.log('Fetch Error :-S', err);
  });

}


//global variable for a list of file
file =[]
jsonfile =[]

/*
create a global file array to hold the list of files
on submit post these files
*/
function dropHandler(ev){
    
    console.log("File Dropped");
    ev.preventDefault();
    ev.dataTransfer.dropEffect ="move";

    if (ev.dataTransfer.items) {
        
        for (var i = 0; i < ev.dataTransfer.items.length; i++) 
        {
          if (ev.dataTransfer.items[i].kind === 'file') {
            file.push(ev.dataTransfer.items[i].getAsFile());
            //validation
            //send it to some file process
                    //file side 
                        //validate
                        //upload to database
                        //send response 
            //get response
            // show user
            
        
          }
        }
      } else {
        
        for (var i = 0; i < ev.dataTransfer.files.length; i++) {
          console.log('... file[' + i + '].name = ' + ev.dataTransfer.files[i].name);
        }
      }
}



let submit_file =(ev)=> {
    ev.preventDefault();
    const formData = new FormData();

    //create a form data to send the array of files
    for(let val=0;val<file.length;val++)
    {
        formData.append('file'+val,file[val]);
    }
    
    var reader = new FileReader();
    reader.onload =(evt) =>{
        console.log(evt.target.result);     
    }
   let logfile =reader.readAsText(file[0]);
   //validation required


    //post into the server
    $.ajax(
        {
            url : "test.php",
            type: "POST",
            data : formData,
            processData:false,
            contentType:false,
            success:function(data, textStatus, response)
            {
                alert("success in function call");
                console.log(response)
            },
            error: function(jqXHR, textStatus, errorThrown)
            {
                alert("unsuccessful");
            }
        });
}


var dragOverHandler=(ev) => { 
    ev.preventDefault();
    
};

function close_modal() {
    document.getElementById("About").style.display = "none";
    document.getElementById("Help").style.display = "none";
    document.getElementById("Import").style.display = "none";
    document.getElementById("Login").style.display ="none";
}


