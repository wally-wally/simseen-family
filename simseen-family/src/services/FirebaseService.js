import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

const DINNER = 'dinner'
const BIBLE = 'bible'
const NOTICE = 'notice'

const API_KEY = process.env.VUE_APP_FIREBASE_API_KEY
const DATABASE_URL = process.env.VUE_APP_FIREBASE_DATABASE_URL
const MESSAGINGSENDERID = process.env.VUE_APP_FIREBASE_MESSAGINGSENDERID
const APP_ID = process.env.VUE_APP_FIREBASE_APP_ID
const MEASUREMENTID = process.env.VUE_APP_FIREBASE_MEASUREMENTID

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: "simseen-family.firebaseapp.com",
  databaseURL: DATABASE_URL,
  projectId: "simseen-family",
  storageBucket: "simseen-family.appspot.com",
  messagingSenderId: MESSAGINGSENDERID,
  appId: APP_ID,
  measurementId: MEASUREMENTID
}

firebase.initializeApp(firebaseConfig)

const firestore = firebase.firestore()

export default {
	getNotice() {
		const noticeCollection = firestore.collection(NOTICE)
		return noticeCollection
				.orderBy('created_at', 'desc')
				.get()
				.then((docSnapshots) => {				
					return docSnapshots.docs.map((doc) => {
						let data = doc.data()
						data.created_at = new Date(data.created_at.toDate())
						return data
					})
				})
	},
	getBible() {
		const bibleCollection = firestore.collection(BIBLE)
		return bibleCollection
				.orderBy('date', 'desc')
				.get()
				.then((docSnapshots) => {				
					return docSnapshots.docs.map((doc) => {
						let data = doc.data()
						data.date = new Date(data.date.toDate())
						return data
					})
				})
	},
	getDinner() {
		const dinnerCollection = firestore.collection(DINNER)
		return dinnerCollection
				.orderBy('date', 'desc')
				.get()
				.then((docSnapshots) => {					
					return docSnapshots.docs.map((doc) => {
						let data = doc.data()
						data.date = new Date(data.date.toDate())
						return data
					})
				})
	},
	postNotice(title, user, body) {
		return firestore.collection(NOTICE).add({
			title,
			user,
			body,
			created_at: firebase.firestore.FieldValue.serverTimestamp()
		})
	},
}