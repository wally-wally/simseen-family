<template>
  <div class="ma-4">
    <div class="todo-title">
      <i class="fas fa-list"></i>
      <span class="success-rate pl-1" :style="{ color: successRate === 100 ? 'crimson' : 'black' }">(달성률 : {{ successRate }}[%])</span>
    </div>
    <div class="todo-contents">
      <div class="todo-input">
        <v-row v-if="todoItems.length < 5">
          <v-col cols="10" class="py-0 pl-4 pr-1">
            <v-text-field
              v-model="todo"
              label="할 일(3자 이상 25자 이하로 작성 가능)"
              color="#E6CC00"
              :counter="0"
              :style="{ fontFamily: 'Poor Story' }">
            </v-text-field>
          </v-col>
          <v-col cols="2" :style="{ lineHeight: '70px', textAlign: 'center' }" class="py-0 pl-1 pr-4">
            <v-btn small class="px-1" color="#E6CC00" :disabled="todo.length < 3 || todo.length > 25 ? true : false" :style="{ fontFamily: 'Poor Story' }" @click="selectTodo(todoItems.length)">추가</v-btn>
          </v-col>
        </v-row>
        <div v-else class="full-todos">
          <p>최대 5개 까지 저장할 수 있습니다.</p>
        </div>
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
                    <!-- <v-list-item-action>
                      <i v-if="!active" class="far fa-star" style="color: grey;"></i>
                      <i v-else class="fas fa-star" style="color: yellow;"></i>
                    </v-list-item-action> -->
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
          <p v-if="loadingStatus" class="mb-6">데이터를 불러오는 중입니다.</p>
          <p v-else class="mb-6">할 일을 등록해주세요.</p>
        </div>
      </div>
      <v-dialog v-model="todoDialog" persistent>
        <v-card>
          <v-card-text class="px-4 pt-4 pb-2" id="notice-card">
            <p class="text-center" style="font-size: 120px;"><i :class="selectTodoIndex === todoItems.length ? 'fas fa-plus' : 'fas fa-trash-alt'"></i></p>
            <p class="text-center" style="font-size: 1.2em; font-family: 'Noto Sans KR', sans-serif; font-weight: 600; letter-spacing: -0.02em;" v-if="selectTodoIndex === todoItems.length">새로운 할 일을 추가하시겠습니까?</p>
            <p class="text-center" style="font-size: 1.2em; font-family: 'Noto Sans KR', sans-serif; font-weight: 600;" v-else>선택한 항목을 삭제하시겠습니까?</p>
            <p class="text-center" style="font-size: 0.9em; font-family: 'Noto Sans KR'">(하단 <span style="color: #FF5252;">'진행'</span> 버튼을 누르면 진행됩니다.)</p>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions class="pa-4" :style="{ fontFamily: 'Poor Story' }">
            <span></span>
            <v-spacer></v-spacer>
            <v-btn small color="error" @click="runTodo(selectTodoIndex === todoItems.length ? 0 : 1)">진행</v-btn>
            <v-btn small color="#E6CC00" @click="todoDialog = false">닫기</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script>
import FirebaseService from '@/services/FirebaseService'

export default {
  name: 'TodoList',
  data() {
    return {
      userEmail: this.$store.state.email.split('@')[0],
      todoItems: [],
      todo: '',
      completedItems: [],
      todoDialog: false,
      selectTodoIndex: 0,
      init: 1,
      loadingStatus: 1,
      deleteIconWidth: 1,
      // deleteStatus: 0
    }
  },
  created() {
    this.getTodos()
  },
  computed: {
    successRate() {
      return this.todoItems.length ? Math.round((this.completedItems.length / this.todoItems.length)*100) : 0
    }
  },
  mounted() {
    window.addEventListener('orientationchange', () => {
      let orientation = window.orientation
      this.deleteIconWidth = orientation === 90 || orientation === -90 ? 2 : 1
    })
  },
  methods: {
    async getTodos() {
      this.todoItems = await FirebaseService.getTodos(this.userEmail)
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
      this.todoDialog = true
    },
    runTodo(status) {
      let items = this.todoItems
      if (!status) { // 추가
        let addItems = {
          completed: false,
          item: this.todo
        }
        items.push(addItems)
        FirebaseService.postTodos(this.userEmail, items)
        this.todoDialog = false
        this.todo = ''
        this.init = 0
      } else { // 삭제
        // items.splice(this.selectTodoIndex, 1)
        // this.deleteStatus = 1
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
        FirebaseService.postTodos(this.userEmail, sendItems)
        this.todoDialog = false
        this.init = 0
        this.todoItems = sendItems
        // this.deleteStatus = 1
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
  watch: {
    completedItems: {
      handler(newValue, oldValue) {
        if(newValue !== oldValue) {
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
          FirebaseService.postTodos(this.userEmail, this.todoItems)
          let sortedCompletedItems = this.completedItems.sort((a, b) => a - b)
          this.completedItems = sortedCompletedItems
        }
      }
    }
  }

}
</script>

<style scoped>
  .todo-title {
    font-weight: bold;
    font-size: 18px;
    margin-bottom: 8px;
  }

  .todo-title .fas::after {
    content: ' 체크리스트';
    font-family: 'Yeon Sung';
  }

  .success-rate {
    content: ' 체크리스트';
    font-size: 14px;
    font-family: 'Yeon Sung';
  }

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

  .completed-item {
    text-decoration: line-through;
  }
</style>