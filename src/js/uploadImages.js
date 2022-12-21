import {getAuth} from 'firebase/auth'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { toast } from 'react-toastify'
import {v4 as uuidv4} from 'uuid'

const auth = getAuth()

export const uploadImageArray = async imgArr => {
    const imgUrls = await Promise.all(
        [...imgArr].map((image) => storeImage(image))
    ).catch((error) => {
        //setLoading(false)
        toast.error('Images not uploaded.')
    })

    return imgUrls
}

//Store image in Firebase
const storeImage = async (image) => {
    return new Promise((resolve,reject) => {
        const storage = getStorage()
        const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`

        const storageRef = ref(storage, 'images/' + fileName)

        const uploadTask = uploadBytesResumable(storageRef, image)

        uploadTask.on('state_changed', 
            (snapshot) => {
                // Observe state change events such as progress, pause, and resume
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                case 'paused':
                    console.log('Upload is paused');
                    break;
                case 'running':
                    console.log('Upload is running');
                    break;
                }
            }, 
            (error) => {
                reject(error)
            }, 
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                resolve(downloadURL.replace('https://firebasestorage.googleapis.com/v0/b/recipes-app-a8829.appspot.com','https://ik.imagekit.io/x25zmqidz'));
                });
            }
        );
    })
}