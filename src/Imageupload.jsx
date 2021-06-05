import { Button } from "@material-ui/core";
import { useState } from "react";
import {db,storage} from './Firebase';
import firebase from 'firebase';
import './imageupload.css';

function Imageupload({username}) {

    const [caption ,setcaption] = useState("");
    const [image,setimage] = useState(null);
    const [progress,setprogress] =useState(0);


    const handleChange = (event)=>{
    if(event.target.files[0]){
        setimage(event.target.files[0]);
        alert(setimage);
    }
    }; 

    const handleUpload = (event)=>{
         const upload = storage.ref(`images/${image.name}`).put(image);
        upload.on("state_changed",
            (snapshot)=>{
                //progress function --------- 
                const progress = Math.round((snapshot.bytesTransferred/snapshot.totalBytes)*100);
                setprogress(progress);
            },
            (err) =>{
                //error to show
                console.log(err);
                alert(err.message);
            },
            ()=>{
                //complete function
                storage.ref("images").child(image.name).getDownloadURL().then(url=>{
                    db.collection("posts").add({
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        caption: caption ,
                        imageUrl: url,
                        username:username
                    });

                    setprogress(0);
                    setcaption("");
                    setimage(null);
                })
            }
        ); 
    };

    return(
        <div className="imageupload">
            <progress className="progress" value={progress} max="100"/>
            <input type="text" value={caption} onChange={event=>{setcaption(event.target.value)}}  placeholder="Enter a caption...."/>
            <input type="file" onChange={handleChange} />
            <Button onClick={handleUpload}>Upload</Button>
        </div>
    );
}

export default Imageupload;