function loadView(view) {
  return () => import (`@/views/${view}`)
}

export { loadView }