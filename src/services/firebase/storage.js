import {
	deleteObject,
	ref,
	uploadBytesResumable,
	getStorage, connectStorageEmulator
} from 'firebase/storage'
const storage = getStorage();
const FILES_PATH = 'files'
if (process.env.NODE_ENV === 'development') {
	connectStorageEmulator(storage,"localhost",9199)
}
export const fileRef = (currentUserId, messageId, fileName) => {
	return ref(storage, `${FILES_PATH}/${currentUserId}/${messageId}/${fileName}`)
}

export const deleteFile = (currentUserId, messageId, file) => {
	return deleteObject(
		fileRef(
			currentUserId,
			messageId,
			`${file.name}.${file.extension || file.type}`
		)
	)
}

export const storageRef = path => {
	return ref(storage, path)
}
export const uploadFileTask = (currentUserId, messageId, file, type) => {
	const uploadFileRef = fileRef(
		currentUserId,
		messageId,
		`${file.name}.${type}`
	)
	return uploadBytesResumable(uploadFileRef, file.blob, {
		contentType: type
	})

}
