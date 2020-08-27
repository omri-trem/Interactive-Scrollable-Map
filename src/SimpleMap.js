import React, { useRef } from 'react';
import GoogleMapReact from 'google-map-react';
import pin from './pin.svg';
import { useEffect } from 'react';
import { useState } from 'react';
import smoothscroll from 'smoothscroll-polyfill';

smoothscroll.polyfill();


const handleClick =(id)=>{
    document.getElementById(id).scrollIntoView({ 
    behavior: 'smooth',
    alignToTop:true
  });
}


function isElementInViewport (el) {
    var rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /* or $(window).height() */
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /* or $(window).width() */
    );
}

const Pin = ({ text,id,vis }) => <div onClick={e=>handleClick(id)}  style={{cursor:'pointer',opacity:vis?1:0.5,width:60,fontWeight:'700',position:'absolute',transform:'translate(-50%, -60%)'}}><img src={pin} width='50px' height='50px'/><p>{text}</p></div>;

let initialCenter ={
    lat: 25.757017,
    lng: -80.2058386
  }
export default function SimpleMap(){
    const [locations,setLocations] = useState([]);
    const [visEl,setVisEl] = useState({});

    useEffect(()=>{
        const handleScroll=()=>{
            locations.forEach(l=>{
                let el = window.document.getElementById(l.id);
                if(isElementInViewport(el)){
                    setVisEl(l);
                }
            })
        }
        window.addEventListener('scroll',handleScroll);
    },[locations]);


    const convertAddressToLocation = (property,geocoder)=>{
        const handleResult = (result)=>{
            let location = result[0].geometry.location;
            property = {...property,lat:location.lat(),lng:location.lng()}
            addProperty(property);
        }
        geocoder.geocode({address:property.address},handleResult);        
    }

    

    const addProperty = (property)=>{
        setLocations(s=>[...s,property]);
    }


      
    const initGeocoder = ({ maps }) => {
        const Geocoder = new maps.Geocoder();
        let elements = window.document.getElementById('properties_container').children;
        Object.keys(elements).forEach(el=>{
            let id = elements[el].id;
            const {address,text} = elements[el].dataset;
            convertAddressToLocation({address: address,text,id},Geocoder);
        })
    };

    return(
        <div style={{ height: '100vh',position:'fixed',right:0,width:'50%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: 'AIzaSyBdlczEuxYRH-xlD_EZH4jv0naeVT1JaA4' ,language: 'es',region:'us'}}
          defaultCenter={initialCenter}
          center={visEl.id?{lat:visEl.lat,lng:visEl.lng}:initialCenter}
          defaultZoom={11}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={initGeocoder}
        >
            {locations.map(loc=>{
                return (<Pin
                            key={loc.id}
                            lat={loc.lat}
                            lng={loc.lng}
                            text={loc.text}
                            id={loc.id}
                            vis={visEl.id===loc.id}
                        />)
            })}
        </GoogleMapReact>
      </div>
    )

}

