
var map;
var markers=[];
var infowindow;
function initMap() {
    var LosAngeles={
        lat:-26.270760,
        lng:28.112268
    }
  map = new google.maps.Map(document.getElementById('map'), {
    center: LosAngeles,
    zoom: 8,
    //style map
    styles: [
      {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
      {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
      {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
      {
        featureType: 'administrative.locality',
        elementType: 'labels.text.fill',
        stylers: [{color: '#d59563'}]
      },
      {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [{color: '#d59563'}]
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [{color: '#263c3f'}]
      },
      {
        featureType: 'poi.park',
        elementType: 'labels.text.fill',
        stylers: [{color: '#6b9a76'}]
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{color: '#38414e'}]
      },
      {
        featureType: 'road',
        elementType: 'geometry.stroke',
        stylers: [{color: '#212a37'}]
      },
      {
        featureType: 'road',
        elementType: 'labels.text.fill',
        stylers: [{color: '#9ca5b3'}]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{color: '#746855'}]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{color: '#1f2835'}]
      },
      {
        featureType: 'road.highway',
        elementType: 'labels.text.fill',
        stylers: [{color: '#f3d19c'}]
      },
      {
        featureType: 'transit',
        elementType: 'geometry',
        stylers: [{color: '#2f3948'}]
      },
      {
        featureType: 'transit.station',
        elementType: 'labels.text.fill',
        stylers: [{color: '#d59563'}]
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{color: '#17263c'}]
      },
      {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{color: '#515c6d'}]
      },
      {
        featureType: 'water',
        elementType: 'labels.text.stroke',
        stylers: [{color: '#17263c'}]
      }
    ]
  });
  //creating info window object
  infowindow=new google.maps.InfoWindow();
  searchstores();
  
  
}

function searchstores(){
  var foundStore=[];
var zipCode=document.getElementById('zip-code-input').value;
if(zipCode){
stores.forEach(function(store){
  var postal = store.address.postalCode.substring(0,5);
  if(postal==zipCode){
    foundStore.push(store);

  }

});
}else{
  foundStore=stores;
}

clearLocation();
displayStores(foundStore);
showStoreMarker(foundStore);
setOnClick();
}

function clearLocation(){
  infowindow.close();
  for(var i=0 ;i < markers.length;i++){
    markers[i].setMap(null);
  }
  markers.length=0;
}
// trigger marker when clicking store list
function setOnClick(){

  var storeElement=document.querySelectorAll('.store-container');
 storeElement.forEach(function(elem,index){
  elem.addEventListener('click',function(){
    google.maps.event.trigger(markers[index],'click');
  })
 });
}

function displayStores(stores){
var storesHtml="";
    stores.forEach(function(store,index){
         var address=store.addressLines;
         var phone=store.phoneNumber;
         storesHtml+=`
         <div class="store-container">
         <div class="store-container-background">
         <div class="store-info-container">
         <div class="store-address">
           <span>${address[0]}</span>
         <span> ${address[1]}</span>
         </div>
         <div class="phone-number">${phone}</div>
       </div>
       <div class="store-number-container">
         <div class="store-number">
           ${index+1}
         </div>
       </div>
       </div>
     </div>
         `
     });
     document.querySelector('.stores-list').innerHTML=storesHtml
}

//creating google map markers
function showStoreMarker(stores){
  var bounds=new google.maps.LatLngBounds();
stores.forEach(function(store,index){
  var latlog=new google.maps.LatLng(
    store.coordinates.latitude,
    store.coordinates.longitude);
    var name=store.name;
    var address=store.addressLines[0];
    var statustext=store.openStatusText;
    var phone=store.phoneNumber;
    bounds.extend(latlog);
    creatMarker(latlog, name,address,statustext,phone,index);
  
})
map.fitBounds(bounds);
}

//creating info window for google map markers
function creatMarker(latlog, name,address,statustext,phone,index){
var html=`
<div class="store-info-name">

${name}
</div>
<div class="store-info-status">
${statustext}
</div>
<div class="store-info-address">
<div class="circle">
<i class="fas fa-location-arrow"></i>
</div>
${address}
</div>

<div class="store-info-phone">
<div class="circle">
<i class="fas fa-phone-alt"></i>
</div>
${phone}
</div>
`
  //Creating actual marker
  var marker=new google.maps.Marker({
    map:map,
    position:latlog,
    label:`${index+1}`
   
  });

  google.maps.event.addListener(marker,'click',function(){
    infowindow.setContent(html);
    infowindow.open(map,marker);

  });
  markers.push(marker);
}