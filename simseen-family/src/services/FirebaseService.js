import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import store from '../store'

const EMAILS = 'emails'
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
	getEmail() {
		const emailCollection = firestore.collection(EMAILS)
		return emailCollection
				.get()
				.then((docSnapshots) => {
					return docSnapshots.docs.map((doc) => {
						let data = doc.data()
						return data
					})
				})
	},
	getNotice() {
		const noticeCollection = firestore.collection(NOTICE)
		return noticeCollection
				.orderBy('noticeIdx', 'desc')
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
	postNotice(title, user, userEmail, body, imgUrl) {
		let noticeIdx = store.state.lastNoticeIndex + 1
		let noticeDocument = firestore.collection(NOTICE).doc(noticeIdx.toString())
		return noticeDocument.set({
			title,
			user,
			userEmail,
			body,
			imgUrl,
			noticeIdx,
			created_at: firebase.firestore.FieldValue.serverTimestamp()
		})
	},
	updateNotice(noticeIdx, title, user, userEmail, body, imgUrl, created_at) {
		let noticeDocument = firestore.collection(NOTICE).doc(noticeIdx.toString())
		return noticeDocument.set({
			noticeIdx,
			title,
			user,
			userEmail,
			body,
			imgUrl,
			created_at
		})
	},
	postDinner(date, menus) {
		let documentName = date.split('-').join('')
		let dinnerDocument = firestore.collection(DINNER).doc(documentName)
		return dinnerDocument.set({
			date: new Date(date),
			menus
		})
	},
	deleteNotice(index) {
		const noticeCollection = firestore.collection(NOTICE)
		noticeCollection.doc(index.toString()).delete()
	},
	loginWithGoogle() {
		let provider = new firebase.auth.GoogleAuthProvider()
		return firebase.auth().signInWithPopup(provider).then(function(result) {
			return result
		}).catch(function(error) {
			console.error('[Google Login Error]', error)
		})
	}
}