import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

const DINNER = 'dinner'
const BIBLE = 'bible'

const firebaseConfig = {
  apiKey: "AIzaSyD8HZeiV2xRzIXuAjaz7Iy0vGON29aSIsY",
  authDomain: "simseen-family.firebaseapp.com",
  databaseURL: "https://simseen-family.firebaseio.com",
  projectId: "simseen-family",
  storageBucket: "simseen-family.appspot.com",
  messagingSenderId: "106251777097",
  appId: "1:106251777097:web:f18393b28102df8a6a3b98",
  measurementId: "G-M8T1Z7847Z"
}

firebase.initializeApp(firebaseConfig)

const firestore = firebase.firestore()

export default {
	getDinner() {
		const dinnerCollection = firestore.collection(DINNER)
		return dinnerCollection
				.orderBy('date', 'asc')
				.get()
				.then((docSnapshots) => {					
					return docSnapshots.docs.map((doc) => {
						let data = doc.data()
						data.date = new Date(data.date.toDate())
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
	}
}