import React from 'react';
import { useEffect, useState } from 'react';
import './App.css';
import Post from './Post';
import { db, auth } from './Firebase';
import { Button, Input } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Imageupload from './Imageupload';



function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));






function App() {


  const Signup = (event) => {
    event.preventDefault();
    auth.createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username
        })
      })
      .catch((error) => alert(error.message));
  }

  const Signin = (event) => {
    event.preventDefault();
    auth.signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));
  }

  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  const [OpenSignin, setOpenSignin] = useState(false);


  const [posts, setposts] = useState([]);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);


  useEffect(() => {
    db.collection("posts").orderBy("timestamp", "desc").onSnapshot((snapshot) => {
      setposts(snapshot.docs.map(doc => ({ id: doc.id, post: doc.data() })));
    });
  }, []);


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //user is logged in
        console.log(authUser);
        setUser(authUser);
      } else {
        //user is logged out
        setUser(null);
      }
    })

    return () => {
      //perform clean up action
      unsubscribe();
    }
  }, [user, username]);

  return (
    <div className="App">
      <Modal
        open={open}
        onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <div>
            <form className="form">
              <center>
                <img src="https://1000logos.net/wp-content/uploads/2017/02/ig-logo.png" height="100px" width="300px" alt="" />
              </center>
              <Input value={username} onChange={(event) => setUsername(event.target.value)} type="text" placeholder="Enter username" />
              <Input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="Enter your e-mail" />
              <Input value={password} onChange={(event) => setPassword(event.target.value)} type="password" placeholder="Enter password" />
              <Button onClick={Signup}>Sign up</Button>

            </form>
          </div>
        </div>
      </Modal>


      <Modal
        open={OpenSignin}
        onClose={() => setOpenSignin(false)}>
        <div style={modalStyle} className={classes.paper}>
          <div>
            <form className="form">
              <center>
                <img src="https://1000logos.net/wp-content/uploads/2017/02/ig-logo.png" height="100px" width="300px" alt="" />
              </center>
              <Input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="Enter your e-mail" />
              <Input value={password} onChange={(event) => setPassword(event.target.value)} type="password" placeholder="Enter password" />
              <Button onClick={Signin}>Sign In</Button>
            </form>
          </div>
        </div>
      </Modal>



      <div className="app_header">
        <img src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="" />
        {user ? (<Button onClick={() => auth.signOut()}>Logout</Button>) :
          <div className="logincontainer">
            <Button onClick={() => setOpenSignin(true)}>Sign In</Button>
            <Button onClick={() => setOpen(true)}>Sign Up</Button>
          </div>}
      </div>

      <div className="body">
        <div className="apppost">
          {
            posts.map(({ id, post }) => (
              <Post key={id} postid={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
            ))
          }
        </div>
      </div>




      {user?.displayName? (<Imageupload username={user.displayName} />) : (<h3>Login to Upload</h3>)}

    </div>
  );
}

export default App;
