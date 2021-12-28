import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setToast } from "../ToastMsg";
import moment from "moment";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Select from "@material-ui/core/Select";

import CustomBackdrop from "../CustomBackdrop";
import { lightGreen } from "@material-ui/core/colors";

function General() {
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [gender, setGender] = useState("");
  const [city, setCity] = useState("");
  //const [birth, setBirth] = useState()
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");

  const [dateandmonth, setDateAndMonth] = useState({
    date: "1",
    month: "january",
    privacy: "public",
  });
  const [yearofbirth, setYearOfBirth] = useState({
    year: "2020",
    privacy: "public",
  });
  const [YearList, setYearList] = useState([]);

  // let testing=()=>{
  //     let dateofbirth={
  //         dateandmonth:{date:dateandmonth.date,month:dateandmonth.month,privacy:dateandmonth.privacy},
  //         birthyear:{year:yearofbirth.year,privacy:yearofbirth.privacy}
  //     }
  //     console.log(testdate);
  // }

  const [error, setError] = useState(null);

  const [load, setload] = useState(false);

  let dispatch = useDispatch();
  let { profile } = useSelector((state) => state.auth);

  useEffect(() => {
    setload(true);
    setFirst(profile.first);
    setLast(profile.last);
    setEmail(profile.email);
    if (profile.username !== "") {
      setUsername(profile.username);
    } else {
      setUsername(profile._id);
    }
    setBio(profile.bio);
    setGender(profile.gender);
    setCity(profile.city);
    if (profile.dateofbirth && profile.dateofbirth.dateandmonth) {
      setDateAndMonth({ ...profile.dateofbirth.dateandmonth });
      setYearOfBirth({ ...profile.dateofbirth.birthyear });
    }
    //setDateAndMonth(profile.dateofbirth && profile.dateofbirth.dateandmonth)
    //setYearOfBirth(profile.dateofbirth && profile.dateofbirth.birthyear)

    setState(profile.state);
    setCountry(profile.country);
    setload(false);
  }, [profile]);

  let saveChange = () => {
    setload(true);
    let newdata = {
      first,
      last,
      bio,
      email,
      gender,
      city,
      state,
      country,
      username,
      dateofbirth: {
        dateandmonth: {
          date: dateandmonth.date,
          month: dateandmonth.month,
          privacy: dateandmonth.privacy,
        },
        birthyear: { year: yearofbirth.year, privacy: yearofbirth.privacy },
      },
    };

    axios
      .put("/user/update", newdata)
      .then((res) => {
        dispatch({
          type: "SET_PROFILE",
          payload: res.data.user,
        });
        setToast("Data updated successfully", "success");
        setload(false);
        setError(null);
      })
      .catch((err) => {
        err.response && setError(err.response.data);
        setload(false);
      });
  };

  useEffect(() => {
    let yeararray = [];
    let date = new Date();

    for (let i = 1950; i <= date.getFullYear(); i++) {
      yeararray.push(i);
    }
    setYearList([...yeararray]);
  }, []);

  return (
    <>
      <CustomBackdrop backdrop={load} />
      <div className="col-md-7 col-sm-9">
        <div className="manu_bar_header">
          <h1>General Settings</h1>
        </div>
        <div className="main_bar shadow-sm rounded">
          <div className="row general_from  ">
            <div className="col-md-2 col-sm-3 p-0">
              <h6>First Name :</h6>
            </div>
            <div className="col-md-10 col-sm-9 general_from_input">
              <input
                value={first}
                onChange={(e) => setFirst(e.target.value)}
                type="text"
                name=""
                placeholder=""
              />
            </div>
          </div>
          <div className="row general_from  ">
            <div className="col-md-2 col-sm-3 p-0">
              <h6>Last Name :</h6>
            </div>
            <div className="col-md-10 col-sm-9 general_from_input">
              <input
                value={last}
                onChange={(e) => setLast(e.target.value)}
                type="text"
                name=""
                placeholder=""
              />
            </div>
          </div>
          <div className="row general_from  ">
            <div className="col-md-2 col-sm-3 p-0">
              <h6>Email :</h6>
            </div>
            <div className="col-md-10 col-sm-9 general_from_input">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                name=""
                placeholder=""
              />
            </div>
          </div>
          <div className="row general_from  ">
            <div className="col-md-2 col-sm-3 p-0">
              <h6>Username :</h6>
            </div>
            <div className="col-md-10 col-sm-9 general_from_input">
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                type="text"
                name=""
                placeholder=""
              />
            </div>
          </div>
          <div className="row general_from mb-3">
            <div className="col-md-2 col-sm-3 p-0">
              <h6>Gender :</h6>
            </div>
            <div className="col-md-10 col-sm-9 general_from_input">
              <RadioGroup
                aria-label="gender"
                name="gender1"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <FormControlLabel
                  value="male"
                  control={<Radio size="small" />}
                  label="Male"
                />
                <FormControlLabel
                  value="female"
                  control={<Radio size="small" />}
                  label="Female"
                />
              </RadioGroup>
              {/* <p><input className="radio" type="radio" name="radio1" /> Male </p>
                                 <p><input className="radio" type="radio" name="radio1" /> Female </p> */}
            </div>
          </div>
          <div className="row general_from  ">
            <div className="col-md-2 col-sm-3 p-0">
              <h6>Bio :</h6>
            </div>
            <div className="col-md-10 col-sm-9 general_from_input">
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                name="textarea"
                placeholder=""
              ></textarea>
            </div>
          </div>
          <div className="row general_from  ">
            <div className="col-md-2 col-sm-3 p-0">
              <h6>City :</h6>
            </div>
            <div className="col-md-10 col-sm-9 general_from_input">
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                type="text"
                name=""
                placeholder=""
              />
            </div>
          </div>
          <div className="row general_from  ">
            <div className="col-md-2 col-sm-3 p-0">
              <h6>State :</h6>
            </div>
            <div className="col-md-10 col-sm-9 general_from_input">
              <input
                value={state}
                onChange={(e) => setState(e.target.value)}
                type="text"
                name=""
                placeholder=""
              />
            </div>
          </div>
          <div className="row general_from  ">
            <div className="col-md-2 col-sm-3 p-0">
              <h6>Country :</h6>
            </div>
            <div className="col-md-10 col-sm-9 ">
              <Select
                native
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                <option aria-label="None" value="">
                  Select
                </option>
                <option value="Afghanistan">Afghanistan</option>
                <option value="Åland Islands">Åland Islands</option>
                <option value="Albania">Albania</option>
                <option value="Algeria">Algeria</option>
                <option value="American Samoa">American Samoa</option>
                <option value="Andorra">Andorra</option>
                <option value="Angola">Angola</option>
                <option value="Anguilla">Anguilla</option>
                <option value="Antarctica">Antarctica</option>
                <option value="Antigua and Barbuda">Antigua and Barbuda</option>
                <option value="Argentina">Argentina</option>
                <option value="Armenia">Armenia</option>
                <option value="Aruba">Aruba</option>
                <option value="Australia">Australia</option>
                <option value="Austria">Austria</option>
                <option value="Azerbaijan">Azerbaijan</option>
                <option value="Bahamas">Bahamas</option>
                <option value="Bahrain">Bahrain</option>
                <option value="Bangladesh">Bangladesh</option>
                <option value="Barbados">Barbados</option>
                <option value="Belarus">Belarus</option>
                <option value="Belgium">Belgium</option>
                <option value="Belize">Belize</option>
                <option value="Benin">Benin</option>
                <option value="Bermuda">Bermuda</option>
                <option value="Bhutan">Bhutan</option>
                <option value="Bolivia">Bolivia</option>
                <option value="Bosnia and Herzegovina">
                  Bosnia and Herzegovina
                </option>
                <option value="Botswana">Botswana</option>
                <option value="Bouvet Island">Bouvet Island</option>
                <option value="Brazil">Brazil</option>
                <option value="British Indian Ocean Territory">
                  British Indian Ocean Territory
                </option>
                <option value="Brunei Darussalam">Brunei Darussalam</option>
                <option value="Bulgaria">Bulgaria</option>
                <option value="Burkina Faso">Burkina Faso</option>
                <option value="Burundi">Burundi</option>
                <option value="Cambodia">Cambodia</option>
                <option value="Cameroon">Cameroon</option>
                <option value="Canada">Canada</option>
                <option value="Cape Verde">Cape Verde</option>
                <option value="Cayman Islands">Cayman Islands</option>
                <option value="Central African Republic">
                  Central African Republic
                </option>
                <option value="Chad">Chad</option>
                <option value="Chile">Chile</option>
                <option value="China">China</option>
                <option value="Christmas Island">Christmas Island</option>
                <option value="Cocos (Keeling) Islands">
                  Cocos (Keeling) Islands
                </option>
                <option value="Colombia">Colombia</option>
                <option value="Comoros">Comoros</option>
                <option value="Congo">Congo</option>
                <option value="Congo, The Democratic Republic of The">
                  Congo, The Democratic Republic of The
                </option>
                <option value="Cook Islands">Cook Islands</option>
                <option value="Costa Rica">Costa Rica</option>
                <option value="Cote D'ivoire">Cote D'ivoire</option>
                <option value="Croatia">Croatia</option>
                <option value="Cuba">Cuba</option>
                <option value="Cyprus">Cyprus</option>
                <option value="Czech Republic">Czech Republic</option>
                <option value="Denmark">Denmark</option>
                <option value="Djibouti">Djibouti</option>
                <option value="Dominica">Dominica</option>
                <option value="Dominican Republic">Dominican Republic</option>
                <option value="Ecuador">Ecuador</option>
                <option value="Egypt">Egypt</option>
                <option value="El Salvador">El Salvador</option>
                <option value="Equatorial Guinea">Equatorial Guinea</option>
                <option value="Eritrea">Eritrea</option>
                <option value="Estonia">Estonia</option>
                <option value="Ethiopia">Ethiopia</option>
                <option value="Falkland Islands (Malvinas)">
                  Falkland Islands (Malvinas)
                </option>
                <option value="Faroe Islands">Faroe Islands</option>
                <option value="Fiji">Fiji</option>
                <option value="Finland">Finland</option>
                <option value="France">France</option>
                <option value="French Guiana">French Guiana</option>
                <option value="French Polynesia">French Polynesia</option>
                <option value="French Southern Territories">
                  French Southern Territories
                </option>
                <option value="Gabon">Gabon</option>
                <option value="Gambia">Gambia</option>
                <option value="Georgia">Georgia</option>
                <option value="Germany">Germany</option>
                <option value="Ghana">Ghana</option>
                <option value="Gibraltar">Gibraltar</option>
                <option value="Greece">Greece</option>
                <option value="Greenland">Greenland</option>
                <option value="Grenada">Grenada</option>
                <option value="Guadeloupe">Guadeloupe</option>
                <option value="Guam">Guam</option>
                <option value="Guatemala">Guatemala</option>
                <option value="Guernsey">Guernsey</option>
                <option value="Guinea">Guinea</option>
                <option value="Guinea-bissau">Guinea-bissau</option>
                <option value="Guyana">Guyana</option>
                <option value="Haiti">Haiti</option>
                <option value="Heard Island and Mcdonald Islands">
                  Heard Island and Mcdonald Islands
                </option>
                <option value="Holy See (Vatican City State)">
                  Holy See (Vatican City State)
                </option>
                <option value="Honduras">Honduras</option>
                <option value="Hong Kong">Hong Kong</option>
                <option value="Hungary">Hungary</option>
                <option value="Iceland">Iceland</option>
                <option value="India">India</option>
                <option value="Indonesia">Indonesia</option>
                <option value="Iran, Islamic Republic of">
                  Iran, Islamic Republic of
                </option>
                <option value="Iraq">Iraq</option>
                <option value="Ireland">Ireland</option>
                <option value="Isle of Man">Isle of Man</option>
                <option value="Israel">Israel</option>
                <option value="Italy">Italy</option>
                <option value="Jamaica">Jamaica</option>
                <option value="Japan">Japan</option>
                <option value="Jersey">Jersey</option>
                <option value="Jordan">Jordan</option>
                <option value="Kazakhstan">Kazakhstan</option>
                <option value="Kenya">Kenya</option>
                <option value="Kiribati">Kiribati</option>
                <option value="Korea, Democratic People's Republic of">
                  Korea, Democratic People's Republic of
                </option>
                <option value="Korea, Republic of">Korea, Republic of</option>
                <option value="Kuwait">Kuwait</option>
                <option value="Kyrgyzstan">Kyrgyzstan</option>
                <option value="Lao People's Democratic Republic">
                  Lao People's Democratic Republic
                </option>
                <option value="Latvia">Latvia</option>
                <option value="Lebanon">Lebanon</option>
                <option value="Lesotho">Lesotho</option>
                <option value="Liberia">Liberia</option>
                <option value="Libyan Arab Jamahiriya">
                  Libyan Arab Jamahiriya
                </option>
                <option value="Liechtenstein">Liechtenstein</option>
                <option value="Lithuania">Lithuania</option>
                <option value="Luxembourg">Luxembourg</option>
                <option value="Macao">Macao</option>
                <option value="Macedonia, The Former Yugoslav Republic of">
                  Macedonia, The Former Yugoslav Republic of
                </option>
                <option value="Madagascar">Madagascar</option>
                <option value="Malawi">Malawi</option>
                <option value="Malaysia">Malaysia</option>
                <option value="Maldives">Maldives</option>
                <option value="Mali">Mali</option>
                <option value="Malta">Malta</option>
                <option value="Marshall Islands">Marshall Islands</option>
                <option value="Martinique">Martinique</option>
                <option value="Mauritania">Mauritania</option>
                <option value="Mauritius">Mauritius</option>
                <option value="Mayotte">Mayotte</option>
                <option value="Mexico">Mexico</option>
                <option value="Micronesia, Federated States of">
                  Micronesia, Federated States of
                </option>
                <option value="Moldova, Republic of">
                  Moldova, Republic of
                </option>
                <option value="Monaco">Monaco</option>
                <option value="Mongolia">Mongolia</option>
                <option value="Montenegro">Montenegro</option>
                <option value="Montserrat">Montserrat</option>
                <option value="Morocco">Morocco</option>
                <option value="Mozambique">Mozambique</option>
                <option value="Myanmar">Myanmar</option>
                <option value="Namibia">Namibia</option>
                <option value="Nauru">Nauru</option>
                <option value="Nepal">Nepal</option>
                <option value="Netherlands">Netherlands</option>
                <option value="Netherlands Antilles">
                  Netherlands Antilles
                </option>
                <option value="New Caledonia">New Caledonia</option>
                <option value="New Zealand">New Zealand</option>
                <option value="Nicaragua">Nicaragua</option>
                <option value="Niger">Niger</option>
                <option value="Nigeria">Nigeria</option>
                <option value="Niue">Niue</option>
                <option value="Norfolk Island">Norfolk Island</option>
                <option value="Northern Mariana Islands">
                  Northern Mariana Islands
                </option>
                <option value="Norway">Norway</option>
                <option value="Oman">Oman</option>
                <option value="Pakistan">Pakistan</option>
                <option value="Palau">Palau</option>
                <option value="Palestinian Territory, Occupied">
                  Palestinian Territory, Occupied
                </option>
                <option value="Panama">Panama</option>
                <option value="Papua New Guinea">Papua New Guinea</option>
                <option value="Paraguay">Paraguay</option>
                <option value="Peru">Peru</option>
                <option value="Philippines">Philippines</option>
                <option value="Pitcairn">Pitcairn</option>
                <option value="Poland">Poland</option>
                <option value="Portugal">Portugal</option>
                <option value="Puerto Rico">Puerto Rico</option>
                <option value="Qatar">Qatar</option>
                <option value="Reunion">Reunion</option>
                <option value="Romania">Romania</option>
                <option value="Russian Federation">Russian Federation</option>
                <option value="Rwanda">Rwanda</option>
                <option value="Saint Helena">Saint Helena</option>
                <option value="Saint Kitts and Nevis">
                  Saint Kitts and Nevis
                </option>
                <option value="Saint Lucia">Saint Lucia</option>
                <option value="Saint Pierre and Miquelon">
                  Saint Pierre and Miquelon
                </option>
                <option value="Saint Vincent and The Grenadines">
                  Saint Vincent and The Grenadines
                </option>
                <option value="Samoa">Samoa</option>
                <option value="San Marino">San Marino</option>
                <option value="Sao Tome and Principe">
                  Sao Tome and Principe
                </option>
                <option value="Saudi Arabia">Saudi Arabia</option>
                <option value="Senegal">Senegal</option>
                <option value="Serbia">Serbia</option>
                <option value="Seychelles">Seychelles</option>
                <option value="Sierra Leone">Sierra Leone</option>
                <option value="Singapore">Singapore</option>
                <option value="Slovakia">Slovakia</option>
                <option value="Slovenia">Slovenia</option>
                <option value="Solomon Islands">Solomon Islands</option>
                <option value="Somalia">Somalia</option>
                <option value="South Africa">South Africa</option>
                <option value="South Georgia and The South Sandwich Islands">
                  South Georgia and The South Sandwich Islands
                </option>
                <option value="Spain">Spain</option>
                <option value="Sri Lanka">Sri Lanka</option>
                <option value="Sudan">Sudan</option>
                <option value="Suriname">Suriname</option>
                <option value="Svalbard and Jan Mayen">
                  Svalbard and Jan Mayen
                </option>
                <option value="Swaziland">Swaziland</option>
                <option value="Sweden">Sweden</option>
                <option value="Switzerland">Switzerland</option>
                <option value="Syrian Arab Republic">
                  Syrian Arab Republic
                </option>
                <option value="Taiwan, Province of China">
                  Taiwan, Province of China
                </option>
                <option value="Tajikistan">Tajikistan</option>
                <option value="Tanzania, United Republic of">
                  Tanzania, United Republic of
                </option>
                <option value="Thailand">Thailand</option>
                <option value="Timor-leste">Timor-leste</option>
                <option value="Togo">Togo</option>
                <option value="Tokelau">Tokelau</option>
                <option value="Tonga">Tonga</option>
                <option value="Trinidad and Tobago">Trinidad and Tobago</option>
                <option value="Tunisia">Tunisia</option>
                <option value="Turkey">Turkey</option>
                <option value="Turkmenistan">Turkmenistan</option>
                <option value="Turks and Caicos Islands">
                  Turks and Caicos Islands
                </option>
                <option value="Tuvalu">Tuvalu</option>
                <option value="Uganda">Uganda</option>
                <option value="Ukraine">Ukraine</option>
                <option value="United Arab Emirates">
                  United Arab Emirates
                </option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="United States">United States</option>
                <option value="United States Minor Outlying Islands">
                  United States Minor Outlying Islands
                </option>
                <option value="Uruguay">Uruguay</option>
                <option value="Uzbekistan">Uzbekistan</option>
                <option value="Vanuatu">Vanuatu</option>
                <option value="Venezuela">Venezuela</option>
                <option value="Viet Nam">Viet Nam</option>
                <option value="Virgin Islands, British">
                  Virgin Islands, British
                </option>
                <option value="Virgin Islands, U.S.">
                  Virgin Islands, U.S.
                </option>
                <option value="Wallis and Futuna">Wallis and Futuna</option>
                <option value="Western Sahara">Western Sahara</option>
                <option value="Yemen">Yemen</option>
                <option value="Zambia">Zambia</option>
                <option value="Zimbabwe">Zimbabwe</option>
              </Select>

              {/* <select name="selectoptions">
                            <option value="option1">Bangladesh</option>
                            <option value="option2">India </option>
                            <option value="option2">Pakistan </option>
                            <option value="option2">China </option>
                        </select> */}
            </div>
          </div>
          {/* <div className="row general_from  ">
                        <div className="col-md-2 col-sm-3 p-0">
                            <h6>Date Of Birth :</h6>
                        </div>
                        <div className="col-md-10 col-sm-9 general_from_input">
                            <input value={birth} onChange={(e) => setBirth(e.target.value)} style={{ width: "50%" }} type="date" />
                        </div>
                    </div> */}

          <div className="row general_from  ">
            <div className="col-md-2 col-sm-3 p-0">
              <h6>Date Of Birth :</h6>
            </div>
            <div className="col-md-10 col-sm-9 general_from_input">
              <div>
                {/* <input value={birth} onChange={(e) => setBirth(e.target.value)} style={{ width: "50%" }} type="date" /> */}
                <select
                  // native
                  style={{ width: "100px", marginRight: "10px" }}
                  value={dateandmonth.month}
                  onChange={(e) =>
                    setDateAndMonth({ ...dateandmonth, month: e.target.value })
                  }
                >
                  <option value="january">January</option>
                  <option value="february">February</option>
                  <option value="march">March</option>
                  <option value="april">April</option>
                  <option value="may">May</option>
                  <option value="june">June</option>
                  <option value="july">July</option>
                  <option value="august">August</option>
                  <option value="september">September</option>
                  <option value="octobor">Octobor</option>
                  <option value="november">November</option>
                  <option value="december">December</option>
                </select>
                <select
                  //native
                  style={{ width: "100px", marginRight: "10px" }}
                  value={dateandmonth.date}
                  onChange={(e) =>
                    setDateAndMonth({ ...dateandmonth, date: e.target.value })
                  }
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                  <option value="10">10</option>
                  <option value="11">11</option>
                  <option value="12">12</option>
                  <option value="13">13</option>
                  <option value="14">14</option>
                  <option value="15">15</option>
                  <option value="16">16</option>
                  <option value="17">17</option>
                  <option value="18">18</option>
                  <option value="19">19</option>
                  <option value="20">20</option>
                  <option value="21">21</option>
                  <option value="22">22</option>
                  <option value="23">23</option>
                  <option value="24">24</option>
                  <option value="25">25</option>
                  <option value="26">26</option>
                  <option value="27">27</option>
                  <option value="28">28</option>
                  <option value="29">29</option>
                  <option value="30">30</option>
                  <option value="31">31</option>
                </select>

                <select
                  //native
                  style={{ width: "100px" }}
                  value={dateandmonth.privacy}
                  onChange={(e) =>
                    setDateAndMonth({
                      ...dateandmonth,
                      privacy: e.target.value,
                    })
                  }
                >
                  <option key="dateonlyme" value="onlyme">
                    Only me
                  </option>
                  <option key="publiconlyme" value="public">
                    Public
                  </option>
                </select>
              </div>
              <div className="mt-4">
                <select
                  style={{ width: "100px", marginRight: "10px" }}
                  value={yearofbirth.year}
                  onChange={(e) =>
                    setYearOfBirth({ ...yearofbirth, year: e.target.value })
                  }
                >
                  {YearList &&
                    YearList.map((year, index) => {
                      return (
                        <option key={index} value={year}>
                          {year}
                        </option>
                      );
                    })}
                </select>
                <select
                  //native
                  style={{ width: "100px" }}
                  value={yearofbirth.privacy}
                  onChange={(e) =>
                    setYearOfBirth({ ...yearofbirth, privacy: e.target.value })
                  }
                >
                  <option value="onlyme">Only me</option>
                  <option value="public">Public</option>
                </select>
              </div>
            </div>
          </div>

          {error && (
            <div className="alert alert-danger m-4" role="alert">
              <strong>Error</strong> {error.error}
            </div>
          )}
          <div className="main_bar_footer">
            <button onClick={() => saveChange()} className="btn">
              Save Setting
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default General;
