import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { hospitalAPI, emergencyLinkAPI } from "../utils/api";
import {
  Search,
  MapPin,
  Phone,
  Star,
  Bed,
  Link as LinkIcon,
  Filter,
  X,
} from "lucide-react";
import { toast } from "react-toastify";
import LoadingSpinner from "../components/LoadingSpinner";
import { DEPARTMENTS } from "../utils/constants";
import "./Hospitals.css";

const hospitalNames = [
  "All India Institute of Medical Sciences (AIIMS) - New Delhi",
  "Medanta The Medicity - Gurugram",
  "Sir Ganga Ram Hospital - New Delhi",
  "Max Super Speciality Hospital, Saket - New Delhi",
  "Indraprastha Apollo Hospital - New Delhi",
  "Fortis Memorial Research Institute - Gurugram",
  "Fortis Flt. Lt. Rajan Dhall Hospital - New Delhi",
  "Safdarjung Hospital - New Delhi",
  "Dr. Ram Manohar Lohia Hospital - New Delhi",
  "Lok Nayak Hospital - New Delhi",
  "BLK-Max Super Specialty Hospital - New Delhi",
  "Artemis Hospital - Gurugram",
  "Fortis Escorts Heart Institute - New Delhi",
  "Kokilaben Dhirubhai Ambani Hospital - Mumbai",
  "Breach Candy Hospital - Mumbai",
  "P.D. Hinduja National Hospital - Mumbai",
  "Jaslok Hospital and Research Centre - Mumbai",
  "King Edward Memorial Hospital - Mumbai",
  "Lilavati Hospital and Research Centre - Mumbai",
  "Apollo Hospital - Navi Mumbai",
  "Fortis Hiranandani Hospital - Navi Mumbai",
  "Bombay Hospital & Medical Research Centre - Mumbai",
  "Nanavati Max Super Speciality Hospital - Mumbai",
  "Fortis Hospital Mulund - Mumbai",
  "Saifee Hospital - Mumbai",
  "Dr. L H Hiranandani Hospital - Mumbai",
  "Sir H.N. Reliance Foundation Hospital - Mumbai",
  "Gleneagles Hospital Parel - Mumbai",
  "Tata Memorial Hospital - Mumbai",
  "Apollo Hospitals - Chennai",
  "Kauvery Hospital - Chennai",
  "Apollo Specialty Hospitals - Vanagaram",
  "Madras Medical Mission Hospital - Chennai",
  "Gleneagles HealthCity Chennai - Perumbakkam",
  "Fortis Malar Hospital - Chennai",
  "Aster CMI Hospital - Bengaluru",
  "Manipal Hospital Old Airport Road - Bengaluru",
  "Apollo Hospitals - Bannerghatta Road",
  "Gleneagles BGS Hospital Kengeri - Bengaluru",
  "Fortis Hospital Nagarbhavi - Bengaluru",
  "Narayana Institute of Cardiac Sciences (Narayana Health) - Bengaluru",
  "Apollo Hospitals - Secunderabad",
  "Apollo Hospitals - Jubilee Hills",
  "Yashoda Hospitals - Somajiguda",
  "Gleneagles Hospital Lakdi-Ka-Pul - Hyderabad",
  "Rainbow Children's Hospital - Hyderabad",
  "Basavatarakam Indo-American Cancer Hospital - Hyderabad",
  "Manipal Hospital Salt Lake - Kolkata",
  "Ruby General Hospital - Kolkata",
  "Fortis Hospitals, Anandapur - Kolkata",
  "Marengo CIMS Hospital - Ahmedabad",
  "Apollo Hospitals - Ahmedabad",
  "Ruby Hall Clinic - Pune",
];

const Hospitals = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useState({
    city: "",
    name: "",
    department: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [cities, setCities] = useState([]);
  const [hospitalNames, setHospitalNames] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    searchHospitals();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [citiesRes, namesRes] = await Promise.all([
          hospitalAPI.getCities(),
          hospitalAPI.getNames(),
        ]);
        setCities(citiesRes.data);
        setHospitalNames(namesRes.data);
      } catch (error) {
        console.error("Failed to fetch cities or hospital names:", error);
        toast.error("Failed to load suggestions");
      }
    };
    fetchData();
  }, []);

  const searchHospitals = async () => {
    setLoading(true);
    try {
      const response = await hospitalAPI.search(searchParams);
      setHospitals(response.data);
    } catch (error) {
      console.error("Search hospitals error:", error);
      toast.error("Failed to load hospitals");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchHospitals();
  };

  const handleClearFilters = () => {
    setSearchParams({
      city: "",
      name: "",
      department: "",
    });
    setTimeout(() => searchHospitals(), 100);
  };

  const handleCreateLink = async (hospitalId) => {
    navigate(`/hospitals/${hospitalId}`);
  };

  const activeFiltersCount = [
    searchParams.city,
    searchParams.name,
    searchParams.department,
  ].filter(Boolean).length;

  return (
    <div className="hospitals-container">
      <div className="container">
        <div className="page-header">
          <h1>Find Hospitals</h1>
          <p>Search and connect with hospitals for emergency services</p>
        </div>

        <div className="search-section">
          <div className="search-header">
            <button
              className="btn btn-outline filter-toggle"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={20} />
              Filters
              {activeFiltersCount > 0 && (
                <span className="filter-badge">{activeFiltersCount}</span>
              )}
            </button>
            {activeFiltersCount > 0 && (
              <button className="btn btn-text" onClick={handleClearFilters}>
                <X size={18} />
                Clear Filters
              </button>
            )}
          </div>

          <form
            onSubmit={handleSearch}
            className={`search-form card ${showFilters ? "expanded" : ""}`}
          >
            <div className="search-inputs">
              <div className="form-group">
                <label>City</label>
                <select
                  value={searchParams.city}
                  onChange={(e) =>
                    setSearchParams({
                      ...searchParams,
                      city: e.target.value,
                    })
                  }
                >
                  <option value="">All Cities</option>
                  {cities.sort().map((city, index) => (
                    <option key={index} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Hospital Name</label>
                <select
                  value={searchParams.name}
                  onChange={(e) =>
                    setSearchParams({
                      ...searchParams,
                      name: e.target.value,
                    })
                  }
                >
                  <option value="">All Hospitals</option>
                  {hospitalNames.sort().map((name, index) => (
                    <option key={index} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Department</label>
                <select
                  value={searchParams.department}
                  onChange={(e) =>
                    setSearchParams({
                      ...searchParams,
                      department: e.target.value,
                    })
                  }
                >
                  <option value="">All Departments</option>
                  {DEPARTMENTS.map((dept, index) => (
                    <option key={index} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button type="submit" className="btn btn-primary search-btn">
              <Search size={20} />
              Search Hospitals
            </button>
          </form>
        </div>

        {loading ? (
          <LoadingSpinner message="Searching hospitals..." />
        ) : (
          <>
            <div className="results-header">
              <h2>
                {hospitals.length} Hospital{hospitals.length !== 1 ? "s" : ""}{" "}
                Found
              </h2>
            </div>

            <div className="hospitals-grid">
              {hospitals.length === 0 ? (
                <div className="no-results card">
                  <div className="no-results-content">
                    <Search size={48} />
                    <h3>No hospitals found</h3>
                    <p>Try adjusting your search criteria or clear filters</p>
                    {activeFiltersCount > 0 && (
                      <button
                        className="btn btn-primary"
                        onClick={handleClearFilters}
                      >
                        Clear All Filters
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                hospitals.map((hospital) => (
                  <div key={hospital.id} className="hospital-card card">
                    <div className="hospital-header">
                      <div>
                        <h3>{hospital.name}</h3>
                        {hospital.is_verified && (
                          <span className="verified-badge">✓ Verified</span>
                        )}
                      </div>
                      {hospital.rating > 0 && (
                        <div className="rating-badge">
                          <Star size={16} fill="#f59e0b" color="#f59e0b" />
                          <span>{hospital.rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>

                    <div className="hospital-info">
                      <div className="info-item">
                        <MapPin size={18} />
                        <span>
                          {hospital.city}, {hospital.state}
                        </span>
                      </div>

                      <div className="info-item">
                        <Phone size={18} />
                        <span>{hospital.contact_number}</span>
                      </div>

                      <div className="info-item">
                        <Bed size={18} />
                        <span>{hospital.available_beds} beds available</span>
                      </div>

                      {hospital.rating > 0 && (
                        <div className="info-item reviews">
                          <span>({hospital.total_reviews} reviews)</span>
                        </div>
                      )}
                    </div>

                    <div className="hospital-features">
                      {hospital.has_emergency && (
                        <span className="feature-tag emergency">Emergency</span>
                      )}
                      {hospital.has_icu && (
                        <span className="feature-tag icu">ICU</span>
                      )}
                      {hospital.has_trauma_center && (
                        <span className="feature-tag trauma">
                          Trauma Center
                        </span>
                      )}
                    </div>

                    <div className="hospital-stats">
                      <div className="stat">
                        <strong>{hospital.department_count || 0}</strong>
                        <span>Departments</span>
                      </div>
                      <div className="stat">
                        <strong>{hospital.doctor_count || 0}</strong>
                        <span>Doctors</span>
                      </div>
                      <div className="stat">
                        <strong>{hospital.available_ambulances || 0}</strong>
                        <span>Ambulances</span>
                      </div>
                    </div>

                    <div className="hospital-actions">
                      <button
                        onClick={() => navigate(`/hospitals/${hospital.id}`)}
                        className="btn btn-outline"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleCreateLink(hospital.id)}
                        className="btn btn-primary"
                      >
                        <LinkIcon size={18} />
                        Create Link
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Hospitals;
