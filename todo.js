const rootElement = document.querySelector('#root')

const FETCH_TODOS_URL = 'https://jsonplaceholder.typicode.com/todos'
const DELETE_TODO_URL = (todoId) => `https://jsonplaceholder.typicode.com/todos/${todoId}`
const TOGGLE_TODO_COMPLETED_URL = (todoId) => `https://jsonplaceholder.typicode.com/todos/${todoId}`

const todos = []

const fetchTodos = async () => {
    const response = await fetch(FETCH_TODOS_URL)
    const data = await response.json()

    return data
}

const deleteTodo = async (todoId) => {
    await fetch(DELETE_TODO_URL(todoId), {method: "DELETE"})
}

const toggleTodoCompleted = async (todo) => {
    await fetch(TOGGLE_TODO_COMPLETED_URL(todo.id), {method: "PATCH", body: {...todo, completed: !todo.completed}})
}

const renderTodos = () => {
    todos.forEach(todo => {
        const todoHTML = document.createElement('div')
        todoHTML.classList.add('todo')
        const checkboxHTML = document.createElement('input')
        checkboxHTML.type = 'checkbox'
        checkboxHTML.checked = todo.completed
        checkboxHTML.addEventListener('change', async () => {
            await toggleTodoCompleted(todo)
            const todoIndex = todos.findIndex(t => t.id === todo.id)
            todos[todoIndex] = {...todos[todoIndex], completed: !todos[todoIndex].completed}
        })
        todoHTML.append(checkboxHTML)
        todoHTML.innerHTML += `
            <span class="todo-text">${todo.title}</span>
        `
        const todoDeleteButtonHTML = document.createElement('button')
        todoDeleteButtonHTML.textContent = 'delete'
        todoDeleteButtonHTML.addEventListener('click', async () => {
            await deleteTodo(todo.id)
            const todoIndex = todos.findIndex(t => t.id === todo.id)
            todos.splice(todoIndex, 1)
            todoHTML.remove()
        })
            
        todoHTML.append(todoDeleteButtonHTML)
        
        rootElement.append(todoHTML)
    })
}

const start = async () => {
    todos.push(...(await fetchTodos()))

    renderTodos()
}

start()