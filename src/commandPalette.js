export function initializeCommandPalette (commands) {
  document.addEventListener('DOMContentLoaded', () => {
    const dialog = document.createElement('dialog')
    dialog.id = 'command-palette'
    dialog.className = 'command-palette'
    dialog.innerHTML = `
            <input type="text" id="command-input" class="command-input" placeholder="Type a command...">
            <ul id="command-list" class="command-list"></ul>
            <footer>
                <p>Press <kbd>↵</kbd> to select, <kbd>↑</kbd> <kbd>↓</kbd> to navigate, <kbd>Esc</kbd> to exit</p>
            </footer>
        `
    document.body.appendChild(dialog)
    const commandInput = document.getElementById('command-input')
    const commandList = document.getElementById('command-list')

    let currentIndex = -1

    function openCommandPalette () {
      document.getElementById('command-palette').open = true
      commandInput.focus()
      updateCommandList('')
    }

    function closeCommandPalette () {
      document.getElementById('command-palette').open = false
      commandInput.value = ''
      currentIndex = -1
    }

    function updateCommandList (input) {
      commandList.innerHTML = ''
      const filteredCommands = input
        ? commands.filter(cmd => cmd.name.toLowerCase().includes(input.toLowerCase()))
        : commands

      filteredCommands.forEach((cmd, index) => {
        const li = document.createElement('li')
        li.textContent = cmd.name
        li.onclick = () => {
          cmd.action()
          closeCommandPalette()
        }
        if (index === currentIndex) {
          li.classList.add('selected')
        }
        commandList.appendChild(li)
      })
    }

    commandInput.addEventListener('input', (e) => updateCommandList(e.target.value))

    document.addEventListener('keydown', (event) => {
      const items = commandList.getElementsByTagName('li')
      if (event.key === 'ArrowDown') {
        currentIndex = (currentIndex + 1) % items.length
        updateCommandList(commandInput.value)
      } else if (event.key === 'ArrowUp') {
        if (currentIndex <= 0) currentIndex = items.length
        currentIndex = (currentIndex - 1) % items.length
        updateCommandList(commandInput.value)
      } else if (event.key === 'Enter' && currentIndex >= 0) {
        items[currentIndex].click()
      } else if (event.key === 'Escape') {
        closeCommandPalette()
      }
    })

    // Open command palette with Ctrl+Shift+H
    document.addEventListener('keydown', (event) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'H') {
        openCommandPalette()
      }
    })
  })
}
