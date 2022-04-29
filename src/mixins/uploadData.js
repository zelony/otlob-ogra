import { uploadBytesResumable, getDownloadURL} from "firebase/storage";
import {storageRef} from "@/services/firebase/storage";
export default {
  data: () => ({ uploading: false, uploadPercentage: 0 }),
  methods: {
    async uploadFile(file, fileName, refLink, needUrl = true) {
      return new Promise((resolve, reject) => {
        try {
          this.uploading = true;
          const filePath = `${refLink}/${fileName}`;
          const ref = storageRef(filePath);
          const uploadTask = uploadBytesResumable(ref,file, { contentType: file.type });
          this.performUploadTask(uploadTask, null, filePath, needUrl)
            .then(downloadUr => {
              // downloadUrl = downloadUr;
              this.uploading = false;
              resolve(downloadUr || filePath);
            })
            .catch(reject);
        } catch (e) {
          this.$store.commit("toast/error", e);
          reject(e);
        }
      });
    },
    performUploadTask(uploadTask, doc, filePath, needUrl = true) {
      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          snapshot => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            this.uploadPercentage = progress;
            if (doc) {
              doc.update({
                percentage: progress
              });
              switch (snapshot.state) {
                case 'paused': // or 'paused'
                  doc.update({
                    paused: true
                  });
                  break;
                case 'running':
                  doc.update({
                    paused: false
                  });
                  break;
              }
            }
          },
          error => {
            this.$store.commit("toast/error", error);
            reject(error);
          },
          async () => {
            const downloadUrl =
              needUrl && (await this.getUrl(uploadTask.snapshot.ref));
            if (doc) {
              doc.update({
                percentage: 100,
                finished: true,
                url: downloadUrl,
                path: filePath,
                uploadedAt: this.$firebase.firebase_.firestore.FieldValue.serverTimestamp(),
                storageUri: uploadTask.snapshot.metadata.fullPath
              });
            }
            resolve(downloadUrl || null);
          }
        );
      });
    },
    async getUrl(path) {
      try {
        const storageRef = storageRef(path);
        return await getDownloadURL(storageRef);
      } catch (e) {
        this.$store.commit("toast/error", e);
        return null;
      }
    },
    dataURLtoFile(dataurl) {
      let arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);

      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      const fileName = Date.now();
      const full_name = `${fileName}.${mime.split("/")[1]}`;
      return new File([u8arr], full_name, { type: mime });
    },
    fileToDataUrl(file){
      return new Promise((resolve,reject) =>{
        const reader = new FileReader();

        reader.addEventListener("load", function () {
          resolve(reader.result);
        }, false);
        reader.onerror = ev => reject(ev);
        reader.readAsDataURL(file);
      })

    },
    getTypeOfBase64(string){
      return string.split(";base64")[0].replace("data:image/","");
    },
  },
};
