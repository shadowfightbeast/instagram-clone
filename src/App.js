import React, { useState, useEffect } from "react";
import "./App.css";
import Post from "./Post";
import { db, auth } from "./firebase";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { Button, Input } from "@material-ui/core";
import ImageUpload from "./ImageUpload";

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
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([
    //  {
    //    username:"its mk ",
    //    caption:"its awesome baby ",
    //    imageurl:"https://source.unsplash.com/420x550/?nature,water"
    //  },{
    //   username:"aadi singh ",
    //    caption:"its really works " ,
    //   imageurl:"https://cdn.pixabay.com/photo/2016/11/19/22/52/coding-1841550_1280.jpg"
    //  },
  ]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //user has logged in
        console.log(authUser);
        setUser(authUser);
      } else {
        //user has logged out
        setUser(null);
      }
    });
    return () => {
      //perfome some cleanup actions
      unsubscribe();
    };
  }, [user, username]);

  useEffect(() => {
    db.collection("users").orderBy('timestamp','desc').onSnapshot((snapshot) => {
      setPosts(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          post: doc.data(),
        }))
      );
    });
  }, []);

  const signUp = (event) => {
    event.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));
    setOpen(false);
  };
  const signIn = (event) => {
    event.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));

    setOpenSignIn(false);
  };

  return (
    <div className="app">
   
     
      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                className="app__headerImage"
                src=" http://minitrainingcenter.com/wp-content/uploads/2019/04/Instagram-f-300x77.jpg"
                alt="img error"
                height="30px"
                width="100px"
              />
            </center>

            <Input
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <Input
              placeholder="email"
              value={email}
              type="text"
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              placeholder="password"
              value={password}
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button onClick={signUp}>signup</Button>
          </form>
        </div>
      </Modal>
      <Modal open={openSignIn} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                className="app__headerImage"
                src="http://minitrainingcenter.com/wp-content/uploads/2019/04/Instagram-f-300x77.jpg"
                alt="img error"
                height="30px"
                width="100px"
              />
            </center>
            <Input
              placeholder="email"
              value={email}
              type="text"
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              value={password}
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button onClick={signIn}>signIn</Button>
          </form>
        </div>
      </Modal>

      <div className="app__header">
        <img
          className="app__headerImage"
          src=""
          alt="img error "
          height="30px"
          width="100px"
        />
         {user ? (
        <Button onClick={() => auth.signOut()}>log Out</Button>
      ) : (
        <div className="app__loginConatiner">
          <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
          <Button onClick={() => setOpen(true)}>sign Up</Button>
        </div>
      )}
      </div>
     
      <h2>welcome to our instagram clone !</h2>
  <div className="app__posts">
    
  {posts.map(({ id, post}) => (
        <Post
          key={id} 
          postId={id}
          user={user}
          username={post.username}
          caption={post.caption}
          imageurl={post.imageurl}
        />
      ))}
  </div>
      {user?.displayName ? (
      <ImageUpload username={user.displayName} />
     ):
      (
       <h3> sorry you need to log in  To Upload </h3>
      )
     }
    </div>
  );
}

export default App;
