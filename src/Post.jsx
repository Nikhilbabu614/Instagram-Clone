import { Avatar } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { db } from './Firebase';
import './Post.css';
import firebase from 'firebase';
import { IconButton } from '@material-ui/core';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';

function Post({postid,username,user , imageUrl , caption}) {

    const [comment ,setcomment] = useState([]);
    const [count,setcount] = useState([]);
    const [like ,setlike] = useState(0);
    const [input,setinput] = useState("");

    const postcomment = (event)=>{
        event.preventDefault();
        db.collection("posts").doc(postid).collection("comments").add({
            text:input,
            username: user.displayName,
            timestamp:firebase.firestore.FieldValue.serverTimestamp()
        })
        setinput("");
    }

    const likebutton = (event) =>{
        event.preventDefault();
            setlike(like+1);
            db.collection("posts").doc(postid).collection("likes").add({
                likes:like,
                use:user.displayName
            });
    }



    useEffect(()=>{
        let unsub;
        if(postid){
            unsub = db.collection("posts").doc(postid).collection("likes")
            .orderBy("likes","desc").onSnapshot((snapshot)=>{
                setcount(snapshot.docs.map((doc)=>doc.data()))
            });
        }

        return ()=>{
            unsub();
        }
    },[postid]);





    useEffect(()=>{
        let unsubscribe;
        if(postid){
            unsubscribe = db.collection("posts").doc(postid).collection("comments")
            .orderBy("timestamp","desc").onSnapshot((snapshot)=>{
                setcomment(snapshot.docs.map((doc)=>doc.data()))
            });
        }

        return ()=>{
            unsubscribe();
        }
    },[postid]);



    return(
        <div className="post">
            <div className="post_header">
                <Avatar className="post_username"  alt=""/>
                <h3 className="post_avtar">{username}</h3>
            </div>
            <img className="post_image" src={imageUrl} alt="" />
            <h4 className="post_caption"><strong>{username}</strong> {caption} </h4>

            <div className="likebutton">
                </div>
            <div className="like">
            
            {user && (<IconButton><FavoriteBorderIcon onClick={likebutton}/></IconButton>)}

                {
                    count.slice(0,1).map((item)=>(
                        <p>Liked by <strong>{item.use}</strong> and {item.likes} others</p>
                    ))
                }
            </div>

            <div className="comments">
                {
                    comment.map((comment)=>(
                        <p> <strong>{comment.username}</strong> {comment.text} </p>
                    ))

                }
            </div>

            {user &&( <div>
                <form className="post_comment" >
                <input class="post_input" type="text" placeholder="A comment .... " value={input} onChange={(e) => setinput(e.target.value)} />
                <button className="post_button" disabled={!input} onClick={postcomment}>Post</button>
            </form>
            </div>
            )}
            
        </div>
    );
}

export default Post;