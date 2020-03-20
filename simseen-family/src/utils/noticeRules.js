function noticeRules() {
  let rules = {
    'titleRules': [
      v => !!v || '제목을 작성하세요.',
      v => (v && v.length <= 15) || '최대 15자까지 작성 가능합니다.'
    ],
    'bodyRules': [
      v => !!v || '내용을 작성하세요.',
      v => (v && v.length >= 5) || '최소 5자 이상 작성해야 합니다.'
    ],
    'imgRules': [
      v => (v.length <= 3) || '최대 3장까지 첨부할 수 있습니다.'
    ]
  }
  return rules
}

export { noticeRules }