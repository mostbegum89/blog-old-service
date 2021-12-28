import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import axios from 'axios'


import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';




const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));



export default function CreateUser() {
    const [first, setFirst] = useState("")
    const [last, setLast] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirm, setConfirm] = useState("")
    const [role, setRole] = useState('user')
    const [error, setError] = useState(null)


    const classes = useStyles();

    let handleSignup = (e) => {
        e.preventDefault()
        let newUser = {
            first,
            last,
            email,
            password,
            confirm,
            role
        }
        
        axios.post('/admin/signup', newUser)
            .then(res => {
                if (res.status === 201) {
                    alert("Registration successful!")
                    setFirst('')
                    setLast('')
                    setEmail('')
                    setPassword('')
                    setConfirm('')
                }
            })
            .catch(err => {
                setError(err && err.response && err.response.data)
                //console.log(err);
            })
    }
    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Create User
                </Typography>
                {error && error.error ? <p style={{ color: "red" }}>{error.error}</p> : null}
                {error && error.message ? <p style={{ color: "red" }}>{error.message}</p> : null}

                <form onSubmit={handleSignup} className={classes.form} noValidate>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                error={error && error.first ? true : false}
                                helperText={error && error.first ? error.first : false}
                                autoComplete="fname"
                                name="firstName"
                                variant="outlined"
                                required
                                fullWidth
                                id="firstName"
                                label="First Name"
                                autoFocus
                                onChange={(e) => setFirst(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                error={error && error.last ? true : false}
                                helperText={error && error.last ? error.last : false}
                                variant="outlined"
                                required
                                fullWidth
                                id="lastName"
                                label="Last Name"
                                name="lastName"
                                autoComplete="lname"
                                onChange={(e) => setLast(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                error={error && error.email ? true : false}
                                variant="outlined"
                                required
                                fullWidth
                                id="email"
                                helperText={error && error.email ? error.email : false}
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                error={error && error.password ? true : false}
                                helperText={error && error.password ? error.password : false}
                                variant="outlined"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                error={error && error.confirm ? true : false}
                                helperText={error && error.confirm ? error.confirm : false}
                                variant="outlined"
                                required
                                fullWidth
                                name="password"
                                label="Confirm Password"
                                type="password"
                                id="cpassword"
                                autoComplete="current-password"
                                onChange={(e) => setConfirm(e.target.value)}
                            />
                        </Grid>


                        <Grid item xs={12}>
                            <InputLabel id="demo-simple-select-outlined-label">Role</InputLabel>
                            <Select
                                labelId="demo-simple-select-outlined-label"
                                id="demo-simple-select-outlined"
                                value={role}
                                onChange={e=>setRole(e.target.value)}
                                label="Role"
                                style={{width:"100%"}}
                            >
                                <MenuItem value="user">User</MenuItem>
                                <MenuItem value="moderator">Moderator</MenuItem>
                            </Select>
                        </Grid>

                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Create
                    </Button>

                </form>
            </div>

        </Container>
    );
}