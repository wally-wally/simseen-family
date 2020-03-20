import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import { store } from '@/store/index.js'

const EMAILS = 'emails'
const DINNER = 'dinner'
const DINNERCART = 'dinnercart'
const DINNERWISH = 'dinnerwish'
const BIBLE = 'bible'
const NOTICE = 'notice'
const MEMO = 'memo'
const TODOS = 'todos'
const UPDATES = 'updates'

const API_KEY = process.env.VUE_APP_FIREBASE_API_KEY
const AUTH_DOMAIN = process.env.VUE_APP_FIREBASE_AUTH_DOMAIN
const DATABASE_URL = process.env.VUE_APP_FIREBASE_DATABASE_URL
const PROJECT_ID = process.env.VUE_APP_FIREBASE_PROJECT_ID
const STORAGE_BUCKET = process.env.VUE_APP_FIREBASE_STORAGE_BUCKET
const MESSAGINGSENDERID = process.env.VUE_APP_FIREBASE_MESSAGINGSENDERID
const APP_ID = process.env.VUE_APP_FIREBASE_APP_ID
const MEASUREMENTID = process.env.VUE_APP_FIREBASE_MEASUREMENTID

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  databaseURL: DATABASE_URL,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
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
	getDinnerCart() {
		const dinnerCartCollection = firestore.collection(DINNERCART)
		return dinnerCartCollection
				.get()
				.then((docSnapshots) => {				
					return docSnapshots.docs.map((doc) => {
						let data = doc.data()
						return data.cart
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
	getUpdates() {
		const updatesCollection = firestore.collection(UPDATES)
		return updatesCollection
				.orderBy('date', 'desc')
				.get()
				.then((docSnapshots) => {					
					return docSnapshots.docs.map((doc) => {
						let data = doc.data()
						return data
					})
				})
	},
	postDinnerCart(dinnercart) {
		const dinnerCartDocument = firestore.collection(DINNERCART).doc('dinnercart')
		return dinnerCartDocument.set({
			cart: dinnercart
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