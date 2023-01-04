import "./App.css";
// ---------------------------------------------------------------
import {REACT_APP_API_KEY} from './environtment.ts'
import arrow from "../src/assets/images/icon-arrow.svg";
import MarkerPosition from "./Components/MarkerPosition";
// ------------------------------------------------------------
import { MapContainer, TileLayer } from "react-leaflet";
import { useEffect, useState } from "react";

function App() {
/**
 * UseState Hook for address and IPAddress
 */
  const [address, setAddress] = useState(null);
  const [ipAddress, setIpAddress] = useState("");

  const checkIpAddress =
    /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gi;
  const checkDomain =
    /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+/;
/**
 * UseEffect Hook 
 */
  useEffect(() => {
    try {
      const getInitialData = async () => {
        const res = await fetch(
          `https://geo.ipify.org/api/v2/country,city?apiKey=${REACT_APP_API_KEY}&ipAddress=${ipAddress}`
        );
        const data = await res.json();
        setAddress(data);
      };

      getInitialData();
    } catch (error) {
      console.trace(error);
    }
  }, [ipAddress]);

  /**
   * @name getEnteredData
   * @description get input IP Address.
   */
  const getEnteredData = async () => {
    const res = await fetch(
      `https://geo.ipify.org/api/v2/country,city?apiKey=${
        REACT_APP_API_KEY
      }&${
        checkIpAddress.test(ipAddress)
          ? `ipAddress=${ipAddress}`
          : checkDomain.test(ipAddress)
          ? `domain=${ipAddress}`
          : ""
      }`
      // https://geo.ipify.org/api/v2/country,city?apiKey=${API_KEY}&ipAddress=8.8.8.8&domain=google.com
    );
    const data = await res.json();
    setAddress(data);
  };

  /**
   * @name handleSubmit
   * @param {*} e
   * @description handler for get API call and setIPAddress value. 
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    getEnteredData();
    setIpAddress("");
  };

  return (
    // Section Start
    <section className="d-flex h-100 flex-column">
      <main className="flex-grow-1 d-flex flex-column overflow-hidden">
        <div className="background-img-container position-relative ">
          {/* Start: Input And Title HEADER section */}
          <div className="header-title-conatiner">
            <h4 className="header-text">IP Address Tracker</h4>

         <form
          onSubmit={handleSubmit}
          autoComplete="off"
         >
          {/* Input for IP Address */}
              <div className="d-flex align-items-center justify-content-center overflow-hidden">
                <label htmlFor="headerInput"></label>
                <input
                  value={ipAddress}
                  onChange={(e) => setIpAddress(e.target.value)}
                  id="headerInput"
                  type="text"
                  className="text-truncate overflow-hidden header-input shadow w-25 border-0 p-3 text-align-center "
                  placeholder="Search for any IP address or domain"
                />
                {/* Button for Submit Input IP Address value */}
                <button type="submit" className="arrow-icon-container text-align-center">
                  <img className="arrow-icon fs-6" src={arrow} alt="arrow" />
                </button>
              </div>
         </form>
            </div>
          {/* End: Input And Title HEADER section */}
          
        {/* Start:Ip Details Container */}
        {address && ( 
          <div className="ip-container rounded-5 p-5 shadow border border-blue bg-white d-lg-flex text-center justify-content-around overflow-hidden">
            <div className="info-card overflow-hidden">
              <p className="info-text text-truncate">IP ADDRESS</p>
              <p className="fs-5 fw-bold text-truncate">{address.ip}</p>
            </div>
            <div className="info-card overflow-hidden">
              <p className="info-text text-truncate">LOCATION</p>
              <p className="fs-5 fw-bold text-truncate">{address.location.city}, {address.location.region}</p>
            </div>
            <div className="info-card overflow-hidden">
              <p className="info-text text-truncate">TIME ZONE</p>
              <p className="fs-5 fw-bold text-truncate">UTC{address.location.timezone}</p>
            </div>
            <div className="p-2 overflow-hidden">
              <p className="info-text text-truncate">ISP</p>
              <p className="fw-bold fs-5 text-truncate">{address.isp}</p>
            </div>
          </div>
          )}
        </div>
        {/* End:Ip Details Container */}
        {/* Start: Map Container */}
        {address && ( 
          <div className="flex-grow-1 position-relative overflow-hidden">
          <MapContainer
            className="h-100"
            center={[address.location.lat, address.location.lng]}
            zoom={13}
            scrollWheelZoom={false}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {/* Child component MarkerPosition */}
            <MarkerPosition address={address} />
          </MapContainer>
        </div>
        )}
        {/* End: Map Container */}
      </main>
    </section>
    // Section End
  );
}

export default App;
