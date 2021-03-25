/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable comma-dangle */
/* eslint-disable operator-linebreak */
import React, { useEffect, useState } from 'react';
import GoogleMapReact from 'google-map-react';
import smoothscroll from 'smoothscroll-polyfill';
import pin from './pin.svg';

smoothscroll.polyfill();

const handleClick = (id) => {
  document.getElementById(id).scrollIntoView({
    behavior: 'smooth',
    alignToTop: true,
  });
};

function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    /* or $(window).height() */ rect.right <=
      (window.innerWidth ||
        document.documentElement.clientWidth) /* or $(window).width() */
  );
}

const pinStyles = {
  roadmap: {
    color: '#333',
    backgroundColor: 'transparent',
    margin: '10px -30px',
  },
  hybrid: {
    color: 'white',
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: '10px',
    padding: '5px',

    margin: '10px -30px',
  },
  satellite: {
    color: 'white',
    backgroundColor: 'rgba(0, 0, 0,0.6)',
    padding: '5px 2px',
    borderRadius: '10px',
    margin: '10px -30px',
  },
};

const Pin = ({ text, id, vis, mapType }) => (
  <button
    type="button"
    onClick={() => handleClick(id)}
    className="ms-scrollable-map-pin"
    style={{
      cursor: 'pointer',
      opacity: vis ? 1 : 0.5,
      width: 60,
      fontWeight: '700',
      position: 'absolute',
      transform: 'translate(-50%, -60%)',
      border: 0,
      backgroundColor: 'transparent',
    }}
  >
    <img src={pin} width="50px" height="50px" alt={text} />
    <p style={pinStyles[mapType]}>{text}</p>
  </button>
);

const initialCenter = {
  lat: 25.757017,
  lng: -80.2058386,
};

const createMapOptions = (maps) => ({
  streetViewControl: true,
  mapTypeControl: true,
  zoomControlOptions: {
    position: maps.ControlPosition.TOP_RIGHT,
  },
  mapTypeControlOptions: {
    style: maps.MapTypeControlStyle.HORIZONTAL_BAR,
    position: maps.ControlPosition.TOP_LEFT,
    mapTypeIds: [
      maps.MapTypeId.ROADMAP,
      maps.MapTypeId.SATELLITE,
      maps.MapTypeId.HYBRID,
    ],
  },
});

export default function SimpleMap() {
  const [locations, setLocations] = useState([]);
  const [visEl, setVisEl] = useState({});
  const [mapType, setMapType] = useState('roadmap');
  const [settings, setSettings] = useState({ center: initialCenter, zoom: 11 });

  useEffect(() => {
    // const handleScroll = () => {
    //   locations.forEach((l) => {
    //     const el = window.document.getElementById(l.id);
    //     if (isElementInViewport(el)) {
    //       setVisEl(l);
    //     }
    //   });
    // };
    // window.addEventListener('scroll', handleScroll);

    if (locations.length > 0) {
      const options = {
        rootMargin: '150px',
        threshold: 1,
      };

      const callback = (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = locations.filter((l) => l.id === entry.target.id)[0];
            setVisEl(el);
          }
        });
      };

      const observer = new IntersectionObserver(callback, options);
      locations.forEach((l) => observer.observe(document.getElementById(l.id)));
    }
  }, [locations]);

  useEffect(() => {
    const mapel = document.getElementById('interactive_map');
    const { initZoom, initCoo } = mapel.dataset;
    const center = initCoo.split(',');

    const properties = window.document.getElementById('properties_container')
      .children;
    const locs = Object.keys(properties).map((p) => {
      const { id } = properties[p];
      const { text, coo } = properties[p].dataset;
      let [lat, lng] = coo.split(',');
      return {
        id,
        text,
        lng: Number(lng),
        lat: Number(lat),
      };
    });

    setLocations(locs);
    setVisEl(locs[0]);

    setSettings({
      zoom: Number(initZoom),
      center: { lat: Number(center[0]), lng: Number(center[1]) },
    });

    // In case of address conversion

    // const intervalId = setInterval(() => {
    //   setLocations((s) => {
    //     if (s.length > 0) {
    //       const elements = window.document.getElementById(
    //         'properties_container'
    //       ).children;
    //       const first = s.filter((el) => el.id === elements[0].id);
    //       setVisEl(first[0]);
    //       clearInterval(intervalId);
    //     }
    //     return s;
    //   });
    // }, 500);
    // setTimeout(() => {
    //   clearInterval(intervalId);
    // }, 10000);
  }, []);

  // const convertAddressToLocation = (property, geocoder) => {
  //   const addProperty = (p) => {
  //     setLocations((s) => [...s, p]);
  //   };
  //   const handleResult = (result) => {
  //     if (result[0] !== null && result[0]) {
  //       const { location } = result[0].geometry;
  //       const processedProperty = {
  //         ...property,
  //         lat: location.lat(),
  //         lng: location.lng(),
  //       };
  //       addProperty(processedProperty);
  //     } else {
  //       console.log(result);
  //     }
  //   };
  //   geocoder.geocode({ address: property.address }, handleResult);
  // };

  const initGeocoder = ({ maps, map }) => {
    maps.event.addListener(map, 'maptypeid_changed', () =>
      setMapType(map.getMapTypeId())
    );

    // const Geocoder = new maps.Geocoder();
    // const elements = window.document.getElementById('properties_container')
    //   .children;
    // Object.keys(elements).forEach((el) => {
    //   const { id } = elements[el];
    //   const { address, text } = elements[el].dataset;
    //   convertAddressToLocation({ address, text, id }, Geocoder);
    // });
  };

  return (
    // Delete the 50% width attribute before building!
    <div
      style={{
        height: '100vh',
        position: 'fixed',
        right: 0,
      }}
      className="ms-scrollable-map-wrapper"
    >
      <GoogleMapReact
        bootstrapURLKeys={{
          key: 'AIzaSyBdlczEuxYRH-xlD_EZH4jv0naeVT1JaA4',
          language: 'es',
          region: 'us',
        }}
        defaultCenter={settings.center}
        center={visEl.id ? { lat: visEl.lat, lng: visEl.lng } : settings.center}
        defaultZoom={settings.zoom}
        options={createMapOptions}
        onGoogleApiLoaded={initGeocoder}
        yesIWantToUseGoogleMapApiInternals
      >
        {locations.map((loc) => (
          <Pin
            key={loc.id}
            lat={loc.lat}
            lng={loc.lng}
            text={loc.text}
            id={loc.id}
            vis={visEl.id === loc.id}
            mapType={mapType}
          />
        ))}
      </GoogleMapReact>
    </div>
  );
}
