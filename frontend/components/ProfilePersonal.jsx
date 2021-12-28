import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { setToast } from '../components/ToastMsg'


import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import { DatePicker, MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns'
import CircularProgress from '@material-ui/core/CircularProgress';



export default function Profileinfo() {
  const [first, setFirst] = useState('')
  const [last, setLast] = useState('')
  const [about, setAbout] = useState('')
  const [address, setAddress] = useState('')
  const [gender, setGender] = useState('')
  const [city, setCity] = useState('')
  const [birth, setBirth] = useState()
  const [state, setState] = useState('')
  const [country, setCountry] = useState('')
  const [zip, setZip] = useState('')

  const [load, setload] = useState(false)

  let dispatch = useDispatch()
  let { profile } = useSelector(state => state.auth)

  useEffect(() => {
    setFirst(profile.first)
    setLast(profile.last)
    setAbout(profile.about)
    setAddress(profile.address)
    setGender(profile.gender)
    setCity(profile.city)
    setBirth(profile.dateofbirth)
    setState(profile.state)
    setCountry(profile.country)
    setZip(profile.zipcode)
  }, [profile])

  let saveChange = () => {
    setload(true)
    let newdata = {
      first, last, about, address, gender, city, state, zipcode: zip, country, dateofbirth: birth
    }
    axios.put('/user/update', newdata)
      .then(res => {
        dispatch({
          type: 'SET_PROFILE',
          payload: res.data.user

        })
        setToast('Data updated successfully', 'success')
        setload(false)
      })
  }

  const handleDateChange = (date) => {
    setBirth(date);
  };
  return (
    <div style={{ width: '60vw' }}>
      <Typography variant="h6" gutterBottom>
        Personal information
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            value={first}
            onChange={(e) => setFirst(e.target.value)}
            required
            id="firstName"
            name="firstName"
            label="First name"
            fullWidth
            autoComplete="given-name"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            value={last}
            onChange={(e) => setLast(e.target.value)}
            required
            id="lastName"
            name="lastName"
            label="Last name"
            fullWidth
            autoComplete="family-name"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            id="about"
            name="about"
            label="About you"
            fullWidth

          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            id="address"
            name="address"
            label="Address"
            fullWidth

          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputLabel id="demo-simple-select-label">Gender</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={gender}
            onChange={(e) => setGender(e.target.value)}

          >
            <MenuItem value={'male'}>Male</MenuItem>
            <MenuItem value={'female'}>Female</MenuItem>
            <MenuItem value={'other'}>Other</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={12} sm={6}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="MM/dd/yyyy"
              margin="normal"
              id="date-picker-inline"
              label="Date picker inline"
              value={birth}
              onChange={handleDateChange}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
          </MuiPickersUtilsProvider>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            value={city}
            onChange={(e) => setCity(e.target.value)}
            id="city"
            name="city"
            label="City"
            fullWidth

          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField value={state} onChange={(e) => setState(e.target.value)} id="state" name="state" label="State/Province/Region" fullWidth />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            id="zip"
            name="zip"
            label="Zip / Postal code"
            fullWidth
            autoComplete="shipping postal-code"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            value={country}
            onChange={(e) => setCountry(e.target.value)}

            id="country"
            name="country"
            label="Country"
            fullWidth
            autoComplete="country"
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={saveChange}
          >
            {
              load ? <CircularProgress color="white" size={30} /> : 'Save'
            }
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}