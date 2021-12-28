import React,{useState,useEffect} from 'react';
import axios from 'axios'
import './dashboard.scss'

const Main = () => {
  const [data, setData] = useState(null)
  useEffect(() => {
    axios.get('/admin/total')
      .then(res => {
        setData(res.data)
      })
      .catch(err => {
        console.log(err);
      })
  }, [])

  return (
    <div className='dashboard'>

      <div className="row">

        <div className="col-sm-6 col-lg-3 mb-3">
          <div className="card text-white bg-gradient-primary">
            <div className="card-body pb-0 d-flex justify-content-between"><div>
              <div className="text-value-lg">{data?data.users:0}</div>
              <div>Total Users</div>
            </div>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3 mb-3">
          <div className="card text-white bg-gradient-info" >
            <div className="card-body pb-0 d-flex justify-content-between"><div>
              <div className="text-value-lg">{data?data.posts:0}</div>
              <div>Total Posts</div>
            </div>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3 mb-3">
          <div className="card text-white bg-gradient-warning">
            <div className="card-body pb-0 d-flex justify-content-between"><div>
              <div className="text-value-lg">{data?data.blogs:0}</div>
              <div>Total Blogs</div>
            </div>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3 mb-3">
          <div className="card text-white bg-gradient-danger" >
            <div className="card-body pb-0 d-flex justify-content-between"><div>
              <div className="text-value-lg">{data?data.articles:0}</div>
              <div>Total Articles</div>
            </div>
            </div>
          </div>
        </div>

      </div>


    </div>
  );
};

export default Main;
