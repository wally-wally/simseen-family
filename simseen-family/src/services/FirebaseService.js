import firebase from 'firebase/app'
import 'firebase/firestore'
// import 'firebase/storage'
import 'firebase/auth'
import store from '../store'

const EMAILS = 'emails'
const DINNER = 'dinner'
const DINNERWISH = 'dinnerwish'
const BIBLE = 'bible'
const NOTICE = 'notice'
const MEMO = 'memo'
const TODOS = 'todos'

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
// const firestorage = firebase.storage().ref()

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
				.orderBy('bibleIdx', 'desc')
				.get()
				.then((docSnapshots) => {				
					return docSnapshots.docs.map((doc) => {
						let data = doc.data()
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
	getDinnerWish() {
		const dinnerWishCollection = firestore.collection(DINNERWISH)
		return dinnerWishCollection
				.get()
				.then((docSnapshots) => {				
					return docSnapshots.docs.map((doc) => {
						let data = doc.data()
						return data.dinnerwish
					})
				})
	},
	getTodos(userEmail) {
		const todosCollection = firestore.collection(TODOS)
		return todosCollection
				.get()
				.then(docSnapshots => {				
					return docSnapshots.docs.find(doc => doc.id === userEmail).data().todos
				})
	},
	getMemo(userEmail) {
		const memoCollection = firestore.collection(MEMO)
		return memoCollection
				.get()
				.then(docSnapshots => {
					return docSnapshots.docs.find(doc => doc.id === userEmail).data().memo
				})
	},
	postDinnerWish(dinnerwish) {
		const dinnerWishDocument = firestore.collection(DINNERWISH).doc('dinnerwish')
		return dinnerWishDocument.set({
			dinnerwish
		})
	},
	postMemo(user, memo) {
		const memoDocument = firestore.collection(MEMO).doc(user)
		return memoDocument.set({
			memo
		})
	},
	postTodos(user, todos) {
		const todosCollection = firestore.collection(TODOS).doc(user)
		return todosCollection.set({
			todos
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
	changeBible(bible, status) {
		let documentIdx = bible.bibleIdx <= 9 ? '0' + bible.bibleIdx.toString() : bible.bibleIdx.toString()
		let bibleDocument = firestore.collection(BIBLE).doc(documentIdx)
		let select = status ? true : false
		return bibleDocument.set({
			body: bible.body,
			bibleIdx: bible.bibleIdx,
			position: bible.position,
			select
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