import React, { useState, useEffect } from "react";
import "./Post.css";
import Avatar from "@material-ui/core/Avatar";
import { db } from "./firebase";
import firebase from 'firebase';

function Post({ postId, username, user, caption, imageurl }) {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
      .collection("users")
        .doc(postId)
        .collection("comments")
        .orderBy('timestamp','desc')
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }
    return () => {
      unsubscribe();
    };
  }, [postId]);
  const postComment = (event) => {
    event.preventDefault();
    db.collection("users").doc(postId).collection("comments").add({
      text:comment,
      username:user.displayName ,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),

    });
    setComment('');
  };

  return (
    <div className="post">
      <div className="post_header">
        <Avatar
          className="post_avatar"
          alt="mksingh"
          src="/static/images/avatar/1.jpg"
        />
        <h3>{username}</h3>
      </div>
      <img src={imageurl} alt="img error" className="post__image" />

      <h4 className="post_text">
        <strong>{username} </strong> :{caption}
      </h4>
      <div className="post__comments">
        {comments.map((comment) => (
          <p>
            <strong> {comment.username} </strong> {comment.text}
          </p>
        ))}
      </div>
      {user && (
        <form className="post__commentBox">
        <input
          type="text"
          className="post__input"
          placeholder="Add a comment "
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button
          disabled={!comment}
          className="post__button"
          type="submit"
          onClick={postComment}
        >
          Post
        </button>
      </form>
      )}
      
    </div>
  );
}

export default Post;
