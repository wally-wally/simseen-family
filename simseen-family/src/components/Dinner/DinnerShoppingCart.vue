<template>
  <div>
    <div class="todo-contents">
      <div class="todo-input">
        <v-row>
          <v-col cols="10" class="py-0 pl-4 pr-1">
            <v-text-field
              v-model="todo"
              label="1자 이상 20자 이하로 작성!"
              color="#E6CC00"
              :counter="0"
              :style="{ fontFamily: 'Poor Story' }">
            </v-text-field>
          </v-col>
          <v-col cols="2" :style="{ lineHeight: '70px', textAlign: 'center' }" class="py-0 pl-1 pr-4">
            <v-btn small class="px-1" color="#E6CC00" :disabled="todo.length < 1 || todo.length > 20 ? true : false" :style="{ fontFamily: 'Poor Story' }" @click="selectTodo(todoItems.length)">추가</v-btn>
          </v-col>
        </v-row>
      </div>
      <div v-if="todoItems.length" class="delete-completed-items">
        <v-btn x-small color="warning" dark id="delete-icon" :style="{ fontFamily: 'Poor Story' }" @click="removeCompletedDialog = true">구매한 품목 모두 삭제</v-btn>
        <v-btn x-small color="error" dark id="delete-icon" :style="{ fontFamily: 'Poor Story' }" @click="allRemoveDialog = true">전체 삭제</v-btn>
      </div>
      <div class="todo-list-item">
        <v-list-item-group
          ref="form"
          v-if="todoItems.length"
          v-model="completedItems"
          multiple
          active-class="orange--text"
          :style="{ fontFamily: 'Poor Story' }">
          <template v-for="(item, index) in todoItems">
            <v-row :key="`${index}-${item.item}`">
              <v-col cols="10" class="py-1">
                <v-list-item>
                  <template>
                    <v-list-item-content class="py-2">
                      <v-list-item-title :class="item.completed ? 'completed-item' : ''" v-text="item.item"></v-list-item-title>
                    </v-list-item-content>
                  </template>
                </v-list-item>
              </v-col>
              <v-col :cols="deleteIconWidth" class="py-1" :style="{ lineHeight: '48px', textAlign: 'center' }">
                <i class="fas fa-trash-alt" style="color: crimson; font-size: 18px;" @click="selectTodo(index)"></i>
              </v-col>
            </v-row>
            <v-divider
              v-if="index + 1 < todoItems.length"
              :key="index">
            </v-divider>
          </template>
        </v-list-item-group>
        <div v-else class="full-todos">
          <p v-if="loadingStatus" class="mb-6">데이터를 불러오는 중 입니다.</p>
          <p v-else class="mb-6">구매할 품목을 작성해주세요.</p>
        </div>
      </div>
      <v-dialog v-model="addDialog" persistent>
        <v-card>
          <v-card-text class="px-4 pt-4 pb-2" id="notice-card">
            <p class="text-center" style="font-size: 120px;"><i class="fas fa-plus"></i></p>
            <p class="text-center" style="font-size: 1.2em; font-family: 'Noto Sans KR', sans-serif; font-weight: 600; letter-spacing: -0.02em;">새로운 품목을 추가하시겠습니까?</p>
            <p class="text-center" style="font-size: 0.9em; font-family: 'Noto Sans KR'">(하단 <span style="color: #FF5252;">'진행'</span> 버튼을 누르면 진행됩니다.)</p>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions class="pa-4" :style="{ fontFamily: 'Poor Story' }">
            <span></span>
            <v-spacer></v-spacer>
            <v-btn small color="error" @click="runTodo(selectTodoIndex === todoItems.length ? 0 : 1)">진행</v-btn>
            <v-btn small color="#E6CC00" @click="addDialog = false">닫기</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="removeDialog" persistent>
        <v-card>
          <v-card-text class="px-4 pt-4 pb-2" id="notice-card">
            <p class="text-center" style="font-size: 120px;"><i class="fas fa-trash-alt"></i></p>
            <p class="text-center" style="font-size: 1.2em; font-family: 'Noto Sans KR', sans-serif; font-weight: 600;">선택한 품목을 삭제하시겠습니까?</p>
            <p class="text-center" style="font-size: 0.9em; font-family: 'Noto Sans KR'">(하단 <span style="color: #FF5252;">'진행'</span> 버튼을 누르면 진행됩니다.)</p>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions class="pa-4" :style="{ fontFamily: 'Poor Story' }">
            <span></span>
            <v-spacer></v-spacer>
            <v-btn small color="error" @click="runTodo(selectTodoIndex === todoItems.length ? 0 : 1)">진행</v-btn>
            <v-btn small color="#E6CC00" @click="removeDialog = false">닫기</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="removeCompletedDialog" persistent>
        <v-card>
          <v-card-text class="px-4 pt-4 pb-2" id="notice-card">
            <p class="text-center" style="font-size: 120px;"><i class="fas fa-trash-alt"></i></p>
            <p class="text-center" style="font-size: 1.2em; font-family: 'Noto Sans KR', sans-serif; font-weight: 600;">구매한 품목들을 삭제하시겠습니까?</p>
            <p class="text-center" style="font-size: 0.9em; font-family: 'Noto Sans KR'">(하단 <span style="color: #FF5252;">'진행'</span> 버튼을 누르면 진행됩니다.)</p>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions class="pa-4" :style="{ fontFamily: 'Poor Story' }">
            <span></span>
            <v-spacer></v-spacer>
            <v-btn small color="error" @click="deleteCompletedItems">진행</v-btn>
            <v-btn small color="#E6CC00" @click="removeCompletedDialog = false">닫기</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="allRemoveDialog" persistent>
        <v-card>
          <v-card-text class="px-4 pt-4 pb-2" id="notice-card">
            <p class="text-center" style="font-size: 120px;"><i class="fas fa-trash-alt"></i></p>
            <p class="text-center" style="font-size: 1.2em; font-family: 'Noto Sans KR', sans-serif; font-weight: 600;">모든 품목을 삭제하시겠습니까?</p>
            <p class="text-center" style="font-size: 0.9em; font-family: 'Noto Sans KR'">(하단 <span style="color: #FF5252;">'진행'</span> 버튼을 누르면 진행됩니다.)</p>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions class="pa-4" :style="{ fontFamily: 'Poor Story' }">
            <span></span>
            <v-spacer></v-spacer>
            <v-btn small color="error" @click="allDeleteItems">진행</v-btn>
            <v-btn small color="#E6CC00" @click="allRemoveDialog = false">닫기</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script>
import FirebaseService from '@/services/FirebaseService'

export default {
  name: 'DinnerShoppingCart',
  data() {
    return {
      todoItems: [],
      todo: '',
      completedItems: [],
      addDialog: false,
      removeDialog: false,
      removeCompletedDialog: false,
      allRemoveDialog: false,
      selectTodoIndex: 0,
      init: 1,
      loadingStatus: 1,
      deleteIconWidth: 1
    }
  },
  created() {
    this.getShoppingCart()
  },
  mounted() {
    window.addEventListener('orientationchange', () => {
      let orientation = window.orientation
      this.deleteIconWidth = orientation === 90 || orientation === -90 ? 2 : 1
    })
  },
  methods: {
    async getShoppingCart() {
      let getData = await FirebaseService.getShoppingCart()
      this.todoItems = getData.shoppingcart
      if (this.init) {
        let vm = this
        for (let i = 0; i < vm.todoItems.length; i++) {
          if (vm.todoItems[i].completed) {
            vm.completedItems.push(i)
          }
        }
        this.loadingStatus = 0
      }
    },
    selectTodo(idx) {
      this.selectTodoIndex = idx
      if (this.selectTodoIndex === this.todoItems.length) {
        this.addDialog = true
      } else {
        this.removeDialog = true
      }
    },
    runTodo(status) {
      let items = this.todoItems
      if (!status) { // 추가
        let addItems = {
          completed: false,
          item: this.todo
        }
        items.push(addItems)
        FirebaseService.postDinnerMemo(items, 0)
        this.addDialog = false
        this.todo = ''
        this.init = 0
      } else { // 삭제
        let sendItems = []
        let resetCompletedItems = []
        let deleteCheck = 0
        this.completedItems = []
        items.forEach((item, idx) => {
          if (idx !== this.selectTodoIndex) {
            sendItems.push({
              item: item.item,
              completed: item.completed
            })
            if (deleteCheck && item.completed) {
              resetCompletedItems.push(idx - 1)
            } else if (!deleteCheck && item.completed) {
              resetCompletedItems.push(idx)
            }
          }
          else {
            deleteCheck = 1
          }
        })
        FirebaseService.postDinnerMemo(sendItems, 0)
        this.removeDialog = false
        this.init = 0
        this.todoItems = sendItems
        if (this.todoItems.length) {
          setTimeout(() => {
            this.$refs.form.items.forEach((item, idx) => {
              if (resetCompletedItems.includes(idx)) {
                item.isActive = true
                item.groupClasses['orange--text'] = true
              } else {
                item.isActive = false
                item.groupClasses['orange--text'] = false
              }
            })
            this.completedItems = resetCompletedItems
          }, 0)
        }
      }
    },
    initCartForm() {
      this.todo =  ''
      this.completedItems = []
      this.removeCompletedDialog = false
    },
    deleteCompletedItems() {
      let revisedData = this.todoItems.filter(data => !data.completed)
      this.todoItems = revisedData
      this.initCartForm()
      FirebaseService.postDinnerMemo(revisedData, 0)
    },
    allDeleteItems() {
      this.todoItems = []
      this.initCartForm()
      FirebaseService.postDinnerMemo(this.todoItems, 0)
    },
    toggleCompletedItems(newValue, oldValue) {
      let longIdxCollection = []
      let shortIdxCollection = []
      if (newValue.length > oldValue.length) {
        longIdxCollection = newValue
        shortIdxCollection = oldValue
      } else if (newValue.length < oldValue.length){
        longIdxCollection = oldValue
        shortIdxCollection = newValue
      }
      let difference = longIdxCollection.filter(elem => !shortIdxCollection.includes(elem))
      const newCompleted = newValue.includes(difference[0])
      let editTodo = {
        completed: newCompleted,
        item: this.todoItems[difference[0]].item
      }
      this.todoItems[difference[0]] = editTodo
      FirebaseService.postDinnerMemo(this.todoItems, 0)
      let sortedCompletedItems = this.completedItems.sort((a, b) => a - b)
      this.completedItems = sortedCompletedItems
    }
  },
  watch: {
    completedItems: {
      handler(newValue, oldValue) {
        if(Math.abs(oldValue.length - newValue.length) === 1) {
          this.toggleCompletedItems(newValue, oldValue)
        }
      }
    }
  }
}
</script>

<style scoped>
  .full-todos {
    background-color: #F4F2DB;
    box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.05);
  }

  .full-todos > p {
    padding: 8px;
    font-size: 15px;
    font-family: 'Nanum Gothic';
    font-weight: 600;
    line-height: 1.7em;
    letter-spacing: 0.5px;
    text-align: center;
  }

  .delete-completed-items {
    display: flex;
    justify-content: flex-end;
    margin: 0.6em 0 0.4em;
  }

  .delete-completed-items > #delete-icon {
    margin-left: 0.5em;
  }

  .completed-item {
    text-decoration: line-through;
  }
</style>