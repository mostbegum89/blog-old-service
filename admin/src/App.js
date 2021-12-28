import React, { useEffect } from 'react';

import Layout from './Layout';
import messages from './messages';
import './styles/App.scss';
import './styles/doctordetails.scss';
import 'react-quill/dist/quill.snow.css'
import 'antd/dist/antd.css'
import Dashboard from './pages/dashboard/Dashboard';
import {
  Route, Switch
} from "react-router-dom";
import withAuth from './withAuth/withAuth'



import Login from './pages/auth/Login';


import CaterogyList from './pages/category/Category';
import Register from './pages/auth/Register';
import Articles from './pages/aticles/AllArticles';
import BlogList from './pages/blogs/BlogList';
import Users from './pages/users';
import Reports from './pages/reports/Reports';
import PendingArticles from './pages/aticles/PendingArticles';
import ApprovedArticles from './pages/aticles/ApprovedArticles';
import AdminModerator from './pages/users/AdminModerator';
import CreateUser from './pages/users/Create';
import CountryList from './pages/doctor/Countrylist';
import Department from './pages/doctor/Department';
import PendingDoctor from './pages/doctor/PendingDoctor';
import Details from './pages/doctor/DoctorDetails';
import ApprovedDoctor from './pages/doctor/ApprovedDoctor';
import AllReviews from './pages/doctor/AllReviews';
import DoctorArticles from './pages/doctor/AllArticles';
import NewArticle from './pages/doctor/NewArticle';






function App() {
 


  return (
    

      <Switch>
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
        <Layout>
          <Route exact path="/" component={Dashboard} />
          <Route  path="/categories" component={CaterogyList} />
          <Route  path="/articles/approved" component={ApprovedArticles} />
          <Route  path="/articles/pending" component={PendingArticles} />
          <Route  path="/blogs" component={BlogList} />
          <Route  path="/users" component={Users} />
          <Route  path="/admin-moderator/all" component={AdminModerator} />
          <Route  path="/add-new" component={CreateUser} />
          <Route  path="/reports" component={Reports} />

          <Route  path="/doctor/country-city" component={CountryList} />
          <Route  path="/doctor/departments" component={Department} />
          <Route  path="/doctor/pending" component={PendingDoctor} />
          <Route  path="/doctor/approved" component={ApprovedDoctor} />
          <Route  path="/doctor/details/:id" component={Details} />
          <Route  path="/doctor/reviews" component={AllReviews} />
          <Route  path="/doctor/articles" component={DoctorArticles} />
          <Route  path="/doctor/new-article" component={NewArticle} />
          
        </Layout>
      </Switch>


  );
}

export default withAuth(App);
